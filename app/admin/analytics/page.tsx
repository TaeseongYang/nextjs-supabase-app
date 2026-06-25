import { AdminStatsCard } from "@/components/admin-stats-card";
import { MonthlyAreaChart } from "@/components/admin-charts/monthly-area-chart";
import { ParticipationBarChart } from "@/components/admin-charts/participation-bar-chart";
import { StatusPieChart } from "@/components/admin-charts/status-pie-chart";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_ADMIN_STATS,
  MOCK_EVENT_STATUS_DIST,
  MOCK_MONTHLY_STATS,
} from "@/lib/mock/admin.mock";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, Percent, Users } from "lucide-react";
import { redirect } from "next/navigation";

// 관리자 통계 분석 페이지
export default async function AdminAnalyticsPage() {
  // 인증 확인 — 미인증 시 관리자 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/admin/login");
  }

  // 총 참여자 수 합산
  const totalParticipants = MOCK_MONTHLY_STATS.reduce(
    (sum, item) => sum + item.participant_count,
    0,
  );

  return (
    <div>
      <PageHeader
        title="통계 분석"
        description="서비스 사용 현황 및 추이 분석"
      />

      {/* 상단 요약 지표 카드 3개 */}
      <div className="grid grid-cols-3 gap-4">
        <AdminStatsCard
          title="총 이벤트"
          value={MOCK_ADMIN_STATS.total_events}
          description="전체 등록된 이벤트 수"
          icon={BarChart3}
        />
        <AdminStatsCard
          title="총 참여자"
          value={totalParticipants}
          description="전체 이벤트 누적 참여자 수"
          icon={Users}
        />
        <AdminStatsCard
          title="평균 참여율"
          value={`${MOCK_ADMIN_STATS.avg_participation_rate}%`}
          description="이벤트 평균 참여율"
          icon={Percent}
        />
      </div>

      {/* 월별 추이 차트 — 전체 너비 */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              월별 이벤트 및 참여자 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyAreaChart data={MOCK_MONTHLY_STATS} />
          </CardContent>
        </Card>
      </div>

      {/* 하단 2열 차트 그리드 */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* 이벤트 상태 분포 Pie 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">이벤트 상태 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={MOCK_EVENT_STATUS_DIST} />
          </CardContent>
        </Card>

        {/* 월별 참여자 수 Bar 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">월별 참여자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <ParticipationBarChart data={MOCK_MONTHLY_STATS} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
