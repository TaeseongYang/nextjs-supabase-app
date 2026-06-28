"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAction } from "@/lib/profiles/profile.actions";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";
import type {
  AdminListParams,
  AdminDashboardStats,
  AdminEventRow,
  AdminUserRow,
  AdminAnalyticsData,
  ActivityFeedItem,
  PaginatedResult,
} from "./admin.types";

/**
 * 관리자 권한 검증 헬퍼
 * is_admin=false 또는 미인증 시 ADMIN_FORBIDDEN 에러를 throw한다.
 */
async function requireAdmin(): Promise<void> {
  const { isAdmin } = await checkAdminAction();
  if (!isAdmin) throw new Error("ADMIN_FORBIDDEN");
}

/**
 * AdminService 팩토리 — 매 호출마다 새 인스턴스 생성 (Fluid compute 호환)
 */
async function createAdminServiceAsync(): Promise<AdminService> {
  const supabase = await createClient();
  const repository = new AdminRepository(supabase);
  return new AdminService(repository);
}

/**
 * 내부 에러 코드를 사용자 친화적 한국어 메시지로 변환
 */
function toAdminUserMessage(raw: string): string {
  if (raw.includes("ADMIN_FORBIDDEN")) return "관리자 권한이 없습니다";
  if (raw.includes("EVENT_NOT_FOUND")) return "이벤트를 찾을 수 없습니다";
  return "오류가 발생했습니다";
}

/**
 * 관리자 대시보드 통계 및 활동 피드 조회
 */
export async function getAdminDashboardStatsAction(): Promise<{
  data: { stats: AdminDashboardStats; feed: ActivityFeedItem[] } | null;
  error: string | null;
}> {
  try {
    await requireAdmin();
    const service = await createAdminServiceAsync();
    const [stats, feed] = await Promise.all([
      service.getDashboardStats(),
      service.getActivityFeed(),
    ]);
    return { data: { stats, feed }, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toAdminUserMessage(raw) };
  }
}

/**
 * 관리자 이벤트 목록 조회 (페이지네이션, 검색, 정렬, 상태 필터 지원)
 */
export async function getAdminEventsAction(params: AdminListParams): Promise<{
  data: PaginatedResult<AdminEventRow> | null;
  error: string | null;
}> {
  try {
    await requireAdmin();
    const service = await createAdminServiceAsync();
    const data = await service.getEventList(params);
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toAdminUserMessage(raw) };
  }
}

/**
 * 관리자 이벤트 삭제
 * 성공 시 /admin/events 캐시를 무효화한다.
 */
export async function deleteAdminEventAction(eventId: string): Promise<{
  data: null;
  error: string | null;
}> {
  try {
    await requireAdmin();
    const service = await createAdminServiceAsync();
    await service.deleteEvent(eventId);
    revalidatePath("/admin/events");
    return { data: null, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toAdminUserMessage(raw) };
  }
}

/**
 * 관리자 사용자 목록 조회 (페이지네이션, 검색, 정렬 지원)
 */
export async function getAdminUsersAction(params: AdminListParams): Promise<{
  data: PaginatedResult<AdminUserRow> | null;
  error: string | null;
}> {
  try {
    await requireAdmin();
    const service = await createAdminServiceAsync();
    const data = await service.getUserList(params);
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toAdminUserMessage(raw) };
  }
}

/**
 * 관리자 통계 분석 데이터 조회
 */
export async function getAdminAnalyticsAction(): Promise<{
  data: AdminAnalyticsData | null;
  error: string | null;
}> {
  try {
    await requireAdmin();
    const service = await createAdminServiceAsync();
    const data = await service.getAnalytics();
    return { data, error: null };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: toAdminUserMessage(raw) };
  }
}
