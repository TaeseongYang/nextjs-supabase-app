import { AdminActivityFeed } from "@/components/admin-activity-feed";
import { AdminStatsCard } from "@/components/admin-stats-card";
import { EventStatusBadge } from "@/components/event-status-badge";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_ACTIVITY_FEED,
  MOCK_ADMIN_STATS,
  MOCK_EVENT_STATUS_DIST,
} from "@/lib/mock/admin.mock";
import { checkAdminAction } from "@/lib/profiles/profile.actions";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Percent, TrendingUp, Users } from "lucide-react";
import { redirect } from "next/navigation";

// 관리자 대시보드 메인 페이지
export default async function AdminDashboardPage() {
  // 인증 확인 — 미인증 시 관리자 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/admin/login");
  }

  // 관리자 권한 검증 — is_admin=false인 인증 사용자 차단
  const { isAdmin } = await checkAdminAction();
  if (!isAdmin) redirect("/admin/login");

  return (
    <div>
      <PageHeader title="대시보드" description="서비스 현황 요약" />

      {/* 핵심 지표 요약 카드 4개 */}
      <div className="grid grid-cols-4 gap-4">
        <AdminStatsCard
          title="총 이벤트"
          value={MOCK_ADMIN_STATS.total_events}
          description="전체 등록된 이벤트 수"
          icon={CalendarDays}
        />
        <AdminStatsCard
          title="총 사용자"
          value={MOCK_ADMIN_STATS.total_users}
          description="가입된 전체 사용자 수"
          icon={Users}
        />
        <AdminStatsCard
          title="이번달 신규 이벤트"
          value={MOCK_ADMIN_STATS.new_events_this_month}
          description="이번달 새로 생성된 이벤트"
          icon={TrendingUp}
        />
        <AdminStatsCard
          title="평균 참여율"
          value={`${MOCK_ADMIN_STATS.avg_participation_rate}%`}
          description="이벤트 평균 참여율"
          icon={Percent}
        />
      </div>

      {/* 하단 2열 그리드 — 활동 피드 + 이벤트 상태 분포 */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* 최근 활동 피드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminActivityFeed items={MOCK_ACTIVITY_FEED} />
          </CardContent>
        </Card>

        {/* 이벤트 상태 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">이벤트 상태 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {MOCK_EVENT_STATUS_DIST.map((item) => (
                <li
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <EventStatusBadge status={item.status} />
                  <span className="text-sm font-medium">{item.count}개</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
