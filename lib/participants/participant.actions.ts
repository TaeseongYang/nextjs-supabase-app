"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EventRepository } from "@/lib/events/event.repository";
import { ParticipantRepository } from "./participant.repository";
import { ParticipantService } from "./participant.service";
import type { CreateParticipantDto } from "@/lib/types/api";
import type { ParticipantStatus } from "@/lib/types/enums";
import type { Participant } from "@/lib/types/entities";

/**
 * 내부 에러 코드를 사용자 친화적 한국어 메시지로 변환
 */
function toUserMessage(raw: string): string {
  if (raw.includes("EVENT_NOT_FOUND")) return "이벤트를 찾을 수 없습니다";
  if (raw.includes("EVENT_CLOSED")) return "참여 신청이 마감된 이벤트입니다";
  if (raw.includes("PARTICIPANT_NOT_FOUND")) return "참여자를 찾을 수 없습니다";
  if (raw.includes("FORBIDDEN")) return "권한이 없습니다";
  if (raw.includes("UNAUTHENTICATED")) return "로그인이 필요합니다";
  return "오류가 발생했습니다";
}

/**
 * 현재 로그인 사용자 ID 추출
 * 미인증 시 UNAUTHENTICATED 에러 throw
 */
async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    throw new Error("UNAUTHENTICATED");
  }

  return data.claims.sub;
}

/**
 * ParticipantService 팩토리 — 매 호출마다 새 인스턴스 생성 (Fluid compute 호환)
 */
async function createParticipantServiceAsync(): Promise<{
  service: ParticipantService;
  eventRepository: EventRepository;
}> {
  const supabase = await createClient();
  const participantRepository = new ParticipantRepository(supabase);
  const service = new ParticipantService(participantRepository);
  const eventRepository = new EventRepository(supabase);
  return { service, eventRepository };
}

/**
 * 초대 토큰으로 이벤트 참여 등록 (인증 필수 — 로그인 사용자만 가능)
 * - 미인증 시 UNAUTHENTICATED 에러 반환
 * - cancelled / completed 상태이면 EVENT_CLOSED 에러
 * - 정원 초과 시 waitlisted로 자동 전환
 */
export async function joinEventAction(
  token: string,
  dto: CreateParticipantDto,
): Promise<{ data: Participant | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // 인증 확인 — 로그인하지 않은 사용자는 참여 불가
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: toUserMessage("UNAUTHENTICATED") };
    }

    // 프로필에서 표시 이름 조회
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    const userName = profile?.full_name ?? user.email ?? "알 수 없음";

    // 초대 토큰으로 이벤트 조회
    const eventRepository = new EventRepository(supabase);
    const eventResult = await eventRepository.findByTokenWithDetails(token);

    if (!eventResult) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const { event } = eventResult;

    // 이벤트 상태 검증 — 취소 또는 완료된 이벤트는 참여 불가
    if (event.status === "cancelled" || event.status === "completed") {
      throw new Error("EVENT_CLOSED");
    }

    // 참여 등록 — user_id와 프로필 이름을 함께 전달
    const participantRepository = new ParticipantRepository(supabase);
    const service = new ParticipantService(participantRepository);
    const participant = await service.registerParticipant(
      event.id,
      event.max_participants,
      user.id,
      userName,
      dto,
    );

    // 참여 페이지 캐시 무효화
    revalidatePath(`/join/${token}`);

    return { data: participant, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 초대 토큰으로 참여자 목록 조회 (인증 불필요 — 게스트 페이지용)
 */
export async function getParticipantsByTokenAction(token: string): Promise<{
  data: Participant[] | null;
  error: string | null;
}> {
  try {
    const { service, eventRepository } = await createParticipantServiceAsync();

    // 초대 토큰으로 이벤트 조회
    const eventResult = await eventRepository.findByTokenWithDetails(token);

    if (!eventResult) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const participants = await service.getParticipantsByEvent(
      eventResult.event.id,
    );

    return { data: participants, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 ID로 참여자 목록 조회 (인증 필요 — 주최자용)
 */
export async function getParticipantsByEventAction(
  eventId: string,
): Promise<{ data: Participant[] | null; error: string | null }> {
  try {
    await getAuthenticatedUserId();

    const { service } = await createParticipantServiceAsync();
    const participants = await service.getParticipantsByEvent(eventId);

    return { data: participants, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 참여자 상태 변경 (인증 필요 — 주최자만 가능)
 * absent 전환 시 가장 오래된 대기자를 attending으로 자동 승격
 */
export async function updateParticipantStatusAction(
  participantId: string,
  eventId: string,
  newStatus: ParticipantStatus,
): Promise<{ data: Participant | null; error: string | null }> {
  try {
    await getAuthenticatedUserId();

    const { service } = await createParticipantServiceAsync();
    const participant = await service.updateParticipantStatus(
      participantId,
      newStatus,
    );

    // 주최자 이벤트 상세 페이지 캐시 무효화
    revalidatePath(`/events/${eventId}`);

    return { data: participant, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 참여자 삭제 (인증 필요 — 주최자만 가능)
 * attending 상태였던 참여자 삭제 시 대기자 자동 승격
 */
export async function removeParticipantAction(
  participantId: string,
  eventId: string,
): Promise<{ data: null; error: string | null }> {
  try {
    await getAuthenticatedUserId();

    const { service } = await createParticipantServiceAsync();
    await service.removeParticipant(participantId);

    // 주최자 이벤트 상세 페이지 캐시 무효화
    revalidatePath(`/events/${eventId}`);

    return { data: null, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}
