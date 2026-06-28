import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

// events 테이블에 JOIN된 announcements 결과 타입
interface EventWithAnnouncements extends EventRow {
  announcements: AnnouncementRow[];
}

export class EventRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * ID로 단일 이벤트 조회
   * PGRST116(행 미존재)는 정상 케이스이므로 null 반환
   */
  async findById(id: string): Promise<EventRow | null> {
    const { data, error } = await this.supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`EventRepository.findById: ${error.message}`);
    }

    return data;
  }

  /**
   * 주최자 ID로 이벤트 목록 조회 (날짜 내림차순)
   */
  async findManyByOrganizerId(organizerId: string): Promise<EventRow[]> {
    const { data, error } = await this.supabase
      .from("events")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("event_date", { ascending: false });

    if (error) {
      throw new Error(
        `EventRepository.findManyByOrganizerId: ${error.message}`,
      );
    }

    return data ?? [];
  }

  /**
   * 초대 토큰으로 이벤트 + 공지사항 JOIN 조회
   * PGRST116(행 미존재)는 null 반환
   */
  async findByTokenWithDetails(
    token: string,
  ): Promise<{ event: EventRow; announcements: AnnouncementRow[] } | null> {
    const { data, error } = await this.supabase
      .from("events")
      .select("*, announcements(*)")
      .eq("invite_token", token)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(
        `EventRepository.findByTokenWithDetails: ${error.message}`,
      );
    }

    if (!data) return null;

    // JOIN 결과에서 announcements 분리
    const { announcements, ...eventData } = data as EventWithAnnouncements;

    return {
      event: eventData,
      announcements: announcements ?? [],
    };
  }

  /**
   * 새 이벤트 생성
   */
  async create(payload: EventInsert): Promise<EventRow> {
    const { data, error } = await this.supabase
      .from("events")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`EventRepository.create: ${error.message}`);
    }

    return data;
  }

  /**
   * 이벤트 수정 — id + organizer_id 이중 조건으로 RLS 이중 보호
   */
  async updateById(
    id: string,
    organizerId: string,
    payload: EventUpdate,
  ): Promise<EventRow> {
    const { data, error } = await this.supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .eq("organizer_id", organizerId)
      .select()
      .single();

    if (error) {
      throw new Error(`EventRepository.updateById: ${error.message}`);
    }

    return data;
  }

  /**
   * 이벤트 삭제 — id + organizer_id 이중 조건으로 RLS 이중 보호
   */
  async deleteById(id: string, organizerId: string): Promise<void> {
    const { error } = await this.supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("organizer_id", organizerId);

    if (error) {
      throw new Error(`EventRepository.deleteById: ${error.message}`);
    }
  }

  /**
   * 참여자 통계 조회 — total(전체) / attending(참석) 병렬 count
   */
  async getParticipantStats(
    eventId: string,
  ): Promise<{ total: number; attending: number }> {
    const [totalResult, attendingResult] = await Promise.all([
      this.supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId),
      this.supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "attending"),
    ]);

    if (totalResult.error) {
      throw new Error(
        `EventRepository.getParticipantStats(total): ${totalResult.error.message}`,
      );
    }
    if (attendingResult.error) {
      throw new Error(
        `EventRepository.getParticipantStats(attending): ${attendingResult.error.message}`,
      );
    }

    return {
      total: totalResult.count ?? 0,
      attending: attendingResult.count ?? 0,
    };
  }
}
