import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type {
  AdminListParams,
  AdminDashboardStats,
  MonthlyStatsRow,
  EventStatusDistRow,
} from "@/lib/admin/admin.types";
import { EVENT_STATUS_LABEL } from "@/lib/types/enums";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export class AdminRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * 대시보드 요약 통계 조회
   * 전체 이벤트 수, 사용자 수, 이번 달 신규 이벤트 수, 평균 참여율을 병렬로 조회한다.
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const now = new Date();
    // 이번 달 1일 00:00:00 UTC 기준 ISO 문자열
    const thisMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const [
      eventsCountResult,
      usersCountResult,
      newEventsResult,
      totalParticipantsResult,
      attendingParticipantsResult,
    ] = await Promise.all([
      // 전체 이벤트 수
      this.supabase.from("events").select("*", { count: "exact", head: true }),
      // 일반 사용자 수 (관리자 제외)
      this.supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_admin", false),
      // 이번 달 신규 이벤트 수
      this.supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonthStart),
      // 전체 참여자 수
      this.supabase
        .from("participants")
        .select("*", { count: "exact", head: true }),
      // 참석 확정 참여자 수
      this.supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("status", "attending"),
    ]);

    if (eventsCountResult.error) {
      throw new Error(
        `AdminRepository.getDashboardStats(events): ${eventsCountResult.error.message}`,
      );
    }
    if (usersCountResult.error) {
      throw new Error(
        `AdminRepository.getDashboardStats(users): ${usersCountResult.error.message}`,
      );
    }
    if (newEventsResult.error) {
      throw new Error(
        `AdminRepository.getDashboardStats(newEvents): ${newEventsResult.error.message}`,
      );
    }
    if (totalParticipantsResult.error) {
      throw new Error(
        `AdminRepository.getDashboardStats(totalParticipants): ${totalParticipantsResult.error.message}`,
      );
    }
    if (attendingParticipantsResult.error) {
      throw new Error(
        `AdminRepository.getDashboardStats(attendingParticipants): ${attendingParticipantsResult.error.message}`,
      );
    }

    const totalParticipants = totalParticipantsResult.count ?? 0;
    const attendingParticipants = attendingParticipantsResult.count ?? 0;
    // 평균 참여율: 전체 참여자 대비 참석 확정 비율 (0이면 0 반환)
    const avgParticipationRate =
      totalParticipants > 0
        ? Math.round((attendingParticipants / totalParticipants) * 100)
        : 0;

    return {
      total_events: eventsCountResult.count ?? 0,
      total_users: usersCountResult.count ?? 0,
      new_events_this_month: newEventsResult.count ?? 0,
      avg_participation_rate: avgParticipationRate,
    };
  }

  /**
   * 이벤트 목록 조회 (페이지네이션, 검색, 정렬, 상태 필터 지원)
   */
  async findManyEvents(
    params: AdminListParams,
  ): Promise<{ data: EventRow[]; total: number }> {
    let query = this.supabase.from("events").select("*", { count: "exact" });

    // 제목 검색
    if (params.search) {
      query = query.ilike("title", `%${params.search}%`);
    }

    // 상태 필터 ('all'이 아닌 경우에만 적용)
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // 정렬 기준 적용
    if (params.sort) {
      query = query.order(params.sort, {
        ascending: params.order === "asc",
      });
    } else {
      // 기본 정렬: 생성일 내림차순
      query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션
    const from = (params.page - 1) * params.pageSize;
    const to = params.page * params.pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`AdminRepository.findManyEvents: ${error.message}`);
    }

    return { data: data ?? [], total: count ?? 0 };
  }

  /**
   * 이벤트 삭제 (관리자 권한 — RLS 정책으로 보장)
   */
  async deleteEventById(id: string): Promise<void> {
    const { error } = await this.supabase.from("events").delete().eq("id", id);

    if (error) {
      throw new Error(`AdminRepository.deleteEventById: ${error.message}`);
    }
  }

  /**
   * 사용자 목록 조회 (관리자 제외, 페이지네이션, 검색, 정렬 지원)
   */
  async findManyUsers(
    params: AdminListParams,
  ): Promise<{ data: ProfileRow[]; total: number }> {
    let query = this.supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("is_admin", false);

    // 이름 또는 이메일 검색
    if (params.search) {
      query = query.or(
        `full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`,
      );
    }

    // 정렬 기준 적용
    if (params.sort) {
      query = query.order(params.sort, {
        ascending: params.order === "asc",
      });
    } else {
      // 기본 정렬: 가입일 내림차순
      query = query.order("created_at", { ascending: false });
    }

    // 페이지네이션
    const from = (params.page - 1) * params.pageSize;
    const to = params.page * params.pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`AdminRepository.findManyUsers: ${error.message}`);
    }

    return { data: data ?? [], total: count ?? 0 };
  }

  /**
   * 특정 사용자가 생성한 이벤트 수 조회
   */
  async getEventCountByUserId(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", userId);

    if (error) {
      throw new Error(
        `AdminRepository.getEventCountByUserId: ${error.message}`,
      );
    }

    return count ?? 0;
  }

  /**
   * 특정 이벤트의 참여자 통계 조회 (전체 수 / 참석 확정 수)
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
        `AdminRepository.getParticipantStats(total): ${totalResult.error.message}`,
      );
    }
    if (attendingResult.error) {
      throw new Error(
        `AdminRepository.getParticipantStats(attending): ${attendingResult.error.message}`,
      );
    }

    return {
      total: totalResult.count ?? 0,
      attending: attendingResult.count ?? 0,
    };
  }

  /**
   * 최근 13개월 월별 이벤트 생성 수 및 참여자 수 통계 조회
   * JS에서 월별 그룹핑 후 최근 12개월 데이터를 오름차순으로 반환한다.
   */
  async getMonthlyStats(): Promise<MonthlyStatsRow[]> {
    const now = new Date();
    // 최근 13개월 시작일 (현재 월 포함 12개월 이전 달의 1일)
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 12,
      1,
    ).toISOString();

    const [eventsResult, participantsResult] = await Promise.all([
      this.supabase
        .from("events")
        .select("id, created_at")
        .gte("created_at", startDate),
      this.supabase
        .from("participants")
        .select("id, joined_at")
        .gte("joined_at", startDate),
    ]);

    if (eventsResult.error) {
      throw new Error(
        `AdminRepository.getMonthlyStats(events): ${eventsResult.error.message}`,
      );
    }
    if (participantsResult.error) {
      throw new Error(
        `AdminRepository.getMonthlyStats(participants): ${participantsResult.error.message}`,
      );
    }

    // 이벤트 월별 그룹핑
    const eventsByMonth: Record<string, number> = {};
    for (const event of eventsResult.data ?? []) {
      if (!event.created_at) continue;
      const month = event.created_at.slice(0, 7); // 'YYYY-MM'
      eventsByMonth[month] = (eventsByMonth[month] ?? 0) + 1;
    }

    // 참여자 월별 그룹핑
    const participantsByMonth: Record<string, number> = {};
    for (const participant of participantsResult.data ?? []) {
      if (!participant.joined_at) continue;
      const month = participant.joined_at.slice(0, 7); // 'YYYY-MM'
      participantsByMonth[month] = (participantsByMonth[month] ?? 0) + 1;
    }

    // 최근 12개월 배열 생성 (현재 월 포함, 오름차순)
    const months: MonthlyStatsRow[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({
        month,
        event_count: eventsByMonth[month] ?? 0,
        participant_count: participantsByMonth[month] ?? 0,
      });
    }

    return months;
  }

  /**
   * 이벤트 상태별 분포 조회
   * 4개 상태에 대한 COUNT를 병렬로 조회하고 한국어 레이블을 매핑하여 반환한다.
   */
  async getEventStatusDist(): Promise<EventStatusDistRow[]> {
    const statuses = [
      "recruiting",
      "confirmed",
      "completed",
      "cancelled",
    ] as const;

    const results = await Promise.all(
      statuses.map((status) =>
        this.supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("status", status),
      ),
    );

    return statuses.map((status, index) => {
      const result = results[index];
      if (result.error) {
        throw new Error(
          `AdminRepository.getEventStatusDist(${status}): ${result.error.message}`,
        );
      }
      return {
        status,
        count: result.count ?? 0,
        label: EVENT_STATUS_LABEL[status],
      };
    });
  }

  /**
   * 최근 생성된 이벤트 목록 조회
   */
  async getRecentEvents(limit: number): Promise<EventRow[]> {
    const { data, error } = await this.supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`AdminRepository.getRecentEvents: ${error.message}`);
    }

    return data ?? [];
  }

  /**
   * 최근 가입한 사용자 프로필 목록 조회
   */
  async getRecentProfiles(limit: number): Promise<ProfileRow[]> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`AdminRepository.getRecentProfiles: ${error.message}`);
    }

    return data ?? [];
  }
}
