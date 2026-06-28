import type { Database } from "@/lib/database.types";
import type { EventRepository } from "./event.repository";
import type {
  CreateEventDto,
  UpdateEventDto,
  EventWithStats,
  JoinPageData,
} from "@/lib/types/api";
import type { EventStatus } from "@/lib/types/enums";
import type { Event, Announcement } from "@/lib/types/entities";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

// 유효한 상태 전환 규칙 — 각 상태에서 전환 가능한 다음 상태 목록
const VALID_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  recruiting: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: ["recruiting"],
};

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * 새 이벤트 생성
   * - 과거 날짜 검증
   * - crypto.randomUUID()로 초대 토큰 자동 생성
   * - 초기 상태: recruiting
   */
  async createEvent(
    organizerId: string,
    dto: CreateEventDto,
  ): Promise<EventRow> {
    // 과거 날짜 검증
    if (new Date(dto.event_date) <= new Date()) {
      throw new Error("PAST_DATE");
    }

    return this.eventRepository.create({
      organizer_id: organizerId,
      title: dto.title,
      description: dto.description ?? null,
      location: dto.location,
      event_date: dto.event_date,
      max_participants: dto.max_participants ?? null,
      invite_token: crypto.randomUUID(),
      status: "recruiting",
      cover_image_url: dto.cover_image_url ?? null,
    });
  }

  /**
   * 주최자의 이벤트 목록 + 참여자 통계 조회
   * Promise.all로 모든 이벤트의 stats를 병렬 처리
   */
  async getEventsByOrganizer(organizerId: string): Promise<EventWithStats[]> {
    const events =
      await this.eventRepository.findManyByOrganizerId(organizerId);

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const stats = await this.eventRepository.getParticipantStats(event.id);
        return {
          ...event,
          // entities.ts Event 타입과 구조가 동일하므로 스프레드 적용
          created_at: event.created_at ?? new Date().toISOString(),
          participant_count: stats.total,
          attending_count: stats.attending,
        } as EventWithStats;
      }),
    );

    return eventsWithStats;
  }

  /**
   * 단일 이벤트 조회 (소유권 검증 포함)
   * - 없으면 EVENT_NOT_FOUND
   * - 타인 소유이면 FORBIDDEN
   */
  async getEventById(id: string, requesterId: string): Promise<EventRow> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    if (event.organizer_id !== requesterId) {
      throw new Error("FORBIDDEN");
    }

    return event;
  }

  /**
   * 초대 토큰으로 이벤트 조회 (인증 불필요, 소유권 검증 없음)
   * 참여자 통계 포함하여 JoinPageData 반환
   */
  async getEventByToken(token: string): Promise<JoinPageData> {
    const result = await this.eventRepository.findByTokenWithDetails(token);

    if (!result) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const stats = await this.eventRepository.getParticipantStats(
      result.event.id,
    );

    return {
      event: {
        ...result.event,
        created_at: result.event.created_at ?? new Date().toISOString(),
      } as Event,
      announcements: result.announcements.map((a) => ({
        ...a,
        created_at: a.created_at ?? new Date().toISOString(),
      })) as Announcement[],
      participant_count: stats.total,
      attending_count: stats.attending,
    };
  }

  /**
   * 이벤트 수정 (소유권 검증 포함)
   */
  async updateEvent(
    id: string,
    organizerId: string,
    dto: UpdateEventDto,
  ): Promise<EventRow> {
    // 소유권 검증 — getEventById가 FORBIDDEN/NOT_FOUND throw
    await this.getEventById(id, organizerId);

    return this.eventRepository.updateById(id, organizerId, {
      title: dto.title,
      description: dto.description ?? null,
      location: dto.location,
      event_date: dto.event_date,
      max_participants: dto.max_participants ?? null,
      cover_image_url: dto.cover_image_url ?? null,
    });
  }

  /**
   * 이벤트 상태 변경 (전환 규칙 검증 포함)
   * VALID_TRANSITIONS에 없는 전환이면 INVALID_TRANSITION throw
   */
  async changeEventStatus(
    id: string,
    organizerId: string,
    newStatus: EventStatus,
  ): Promise<EventRow> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    if (event.organizer_id !== organizerId) {
      throw new Error("FORBIDDEN");
    }

    const currentStatus = event.status as EventStatus;
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error("INVALID_TRANSITION");
    }

    return this.eventRepository.updateById(id, organizerId, {
      status: newStatus,
    });
  }

  /**
   * 이벤트 삭제 (소유권 검증 포함)
   */
  async deleteEvent(id: string, organizerId: string): Promise<void> {
    // 소유권 검증 — getEventById가 FORBIDDEN/NOT_FOUND throw
    await this.getEventById(id, organizerId);
    await this.eventRepository.deleteById(id, organizerId);
  }
}
