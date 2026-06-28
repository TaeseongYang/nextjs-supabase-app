"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";
import type { Database } from "@/lib/database.types";
import type {
  CreateEventDto,
  UpdateEventDto,
  EventWithStats,
  JoinPageData,
} from "@/lib/types/api";
import type { EventStatus } from "@/lib/types/enums";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

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
 * 내부 에러 코드를 사용자 친화적 한국어 메시지로 변환
 */
function toUserMessage(raw: string): string {
  if (raw.includes("EVENT_NOT_FOUND")) return "이벤트를 찾을 수 없습니다";
  if (raw.includes("FORBIDDEN")) return "권한이 없습니다";
  if (raw.includes("PAST_DATE")) return "현재 시각 이후의 날짜를 선택하세요";
  if (raw.includes("UNAUTHENTICATED")) return "로그인이 필요합니다";
  if (raw.includes("INVALID_TRANSITION"))
    return "유효하지 않은 상태 전환입니다";
  if (raw.includes("UPLOAD_FAILED")) return "이미지 업로드에 실패했습니다";
  return "오류가 발생했습니다";
}

/**
 * EventService 팩토리 — 매 호출마다 새 인스턴스 생성 (Fluid compute 호환)
 */
async function createEventServiceAsync(): Promise<EventService> {
  const supabase = await createClient();
  const repository = new EventRepository(supabase);
  return new EventService(repository);
}

/**
 * 내 이벤트 목록 조회 (인증 필요)
 */
export async function getMyEventsAction(): Promise<{
  data: EventWithStats[] | null;
  error: string | null;
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    const data = await service.getEventsByOrganizer(userId);
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 단일 이벤트 조회 (인증 필요, 소유권 검증)
 */
export async function getEventAction(id: string): Promise<{
  data: EventRow | null;
  error: string | null;
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    const data = await service.getEventById(id, userId);
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 생성 (인증 필요)
 * 성공 시 /events, /dashboard 캐시 무효화
 */
export async function createEventAction(dto: CreateEventDto): Promise<{
  data: EventRow | null;
  error: string | null;
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    const data = await service.createEvent(userId, dto);
    revalidatePath("/events");
    revalidatePath("/dashboard");
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 수정 (인증 필요, 소유권 검증)
 * 성공 시 /events, /dashboard 캐시 무효화
 */
export async function updateEventAction(
  id: string,
  dto: UpdateEventDto,
): Promise<{ data: EventRow | null; error: string | null }> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    const data = await service.updateEvent(id, userId, dto);
    revalidatePath("/events");
    revalidatePath("/dashboard");
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 상태 변경 (인증 필요, 전환 규칙 검증)
 * 성공 시 /events, /dashboard 캐시 무효화
 */
export async function changeEventStatusAction(
  id: string,
  newStatus: EventStatus,
): Promise<{ data: EventRow | null; error: string | null }> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    const data = await service.changeEventStatus(id, userId, newStatus);
    revalidatePath("/events");
    revalidatePath("/dashboard");
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 삭제 (인증 필요, 소유권 검증)
 * 성공 시 /events, /dashboard 캐시 무효화
 */
export async function deleteEventAction(id: string): Promise<{
  data: null;
  error: string | null;
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const service = await createEventServiceAsync();
    await service.deleteEvent(id, userId);
    revalidatePath("/events");
    revalidatePath("/dashboard");
    return { data: null, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 이벤트 커버 이미지 업로드 (인증 필요)
 * FormData로 File을 받아 Supabase Storage에 저장 후 공개 URL 반환
 * 파일 경로: event-covers/{userId}/{timestamp}.{ext}
 */
export async function uploadEventCoverAction(
  formData: FormData,
): Promise<{ data: { url: string } | null; error: string | null }> {
  try {
    const userId = await getAuthenticatedUserId();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { data: null, error: "유효하지 않은 파일입니다" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { data: null, error: "파일 크기는 5MB 이하여야 합니다" };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { data: null, error: "JPG, PNG, WebP, GIF 형식만 허용됩니다" };
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;

    const supabase = await createClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      throw new Error(`UPLOAD_FAILED: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("event-covers")
      .getPublicUrl(path);

    return { data: { url: urlData.publicUrl }, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}

/**
 * 초대 토큰으로 참여 페이지 데이터 조회 (인증 불필요 — anon 접근)
 */
export async function getJoinPageDataAction(token: string): Promise<{
  data: JoinPageData | null;
  error: string | null;
}> {
  try {
    const service = await createEventServiceAsync();
    const data = await service.getEventByToken(token);
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toUserMessage(raw) };
  }
}
