import type { AdminRepository } from "./admin.repository";
import type {
  AdminListParams,
  AdminDashboardStats,
  AdminEventRow,
  AdminUserRow,
  AdminAnalyticsData,
  ActivityFeedItem,
  PaginatedResult,
} from "./admin.types";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export class AdminService {
  constructor(private readonly repository: AdminRepository) {}

  /**
   * 대시보드 요약 통계 조회
   * Repository에 그대로 위임한다.
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return this.repository.getDashboardStats();
  }

  /**
   * 관리자 이벤트 목록 조회 (페이지네이션 + 참여자 통계 병렬 집계)
   * 각 이벤트에 대해 participant_count, attending_count를 병렬로 조회하여 합산한다.
   */
  async getEventList(
    params: AdminListParams,
  ): Promise<PaginatedResult<AdminEventRow>> {
    const { data: events, total } =
      await this.repository.findManyEvents(params);

    // 각 이벤트의 참여자 통계를 병렬로 조회
    const statsResults = await Promise.all(
      events.map((event) => this.repository.getParticipantStats(event.id)),
    );

    const enrichedEvents: AdminEventRow[] = events.map((event, index) => {
      const stats = statsResults[index];
      return {
        ...event,
        participant_count: stats.total,
        attending_count: stats.attending,
      };
    });

    return {
      data: enrichedEvents,
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  /**
   * 이벤트 삭제 (관리자 권한)
   * Repository에 그대로 위임한다.
   */
  async deleteEvent(id: string): Promise<void> {
    return this.repository.deleteEventById(id);
  }

  /**
   * 관리자 사용자 목록 조회 (페이지네이션 + 이벤트 수 병렬 집계)
   * ProfileRow → AdminUserRow 매핑을 수행하며 event_count를 병렬로 조회한다.
   */
  async getUserList(
    params: AdminListParams,
  ): Promise<PaginatedResult<AdminUserRow>> {
    const { data: profiles, total } =
      await this.repository.findManyUsers(params);

    // 각 사용자의 이벤트 수를 병렬로 조회
    const eventCounts = await Promise.all(
      profiles.map((profile) =>
        this.repository.getEventCountByUserId(profile.id),
      ),
    );

    // ProfileRow를 AdminUserRow로 매핑
    const users: AdminUserRow[] = profiles.map(
      (profile: ProfileRow, index: number) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name ?? null,
        created_at: profile.created_at,
        is_admin: profile.is_admin,
        event_count: eventCounts[index],
      }),
    );

    return {
      data: users,
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  /**
   * 통계 분석 데이터 조회
   * 월별 통계와 상태별 분포를 병렬로 조회하고 전체 참여자 수를 계산한다.
   */
  async getAnalytics(): Promise<AdminAnalyticsData> {
    const [monthly, statusDist] = await Promise.all([
      this.repository.getMonthlyStats(),
      this.repository.getEventStatusDist(),
    ]);

    // 월별 참여자 수 합산으로 전체 참여자 수 계산
    const totalParticipants = monthly.reduce(
      (sum, m) => sum + m.participant_count,
      0,
    );

    return { monthly, statusDist, totalParticipants };
  }

  /**
   * 최근 활동 피드 조회
   * 최근 이벤트 생성과 최근 사용자 가입을 병렬로 조회한 뒤
   * 날짜 내림차순으로 정렬하여 최신 8개를 반환한다.
   */
  async getActivityFeed(): Promise<ActivityFeedItem[]> {
    const [recentEvents, recentProfiles] = await Promise.all([
      this.repository.getRecentEvents(5),
      this.repository.getRecentProfiles(5),
    ]);

    // 이벤트 생성 피드 아이템 변환
    const eventItems: ActivityFeedItem[] = recentEvents.map((event) => ({
      id: event.id,
      type: "event_created" as const,
      description: `${event.title} 이벤트가 생성되었습니다.`,
      created_at: event.created_at ?? "",
    }));

    // 사용자 가입 피드 아이템 변환
    const userItems: ActivityFeedItem[] = recentProfiles.map((profile) => ({
      id: profile.id,
      type: "user_joined" as const,
      description: `${profile.full_name ?? profile.email}님이 서비스에 가입했습니다.`,
      created_at: profile.created_at,
    }));

    // 날짜 내림차순 정렬 후 최신 8개 반환
    return [...eventItems, ...userItems]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 8);
  }
}
