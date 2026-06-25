import { AdminEventsTable } from "@/components/admin-events-table";
import { PageHeader } from "@/components/page-header";
import { MOCK_EVENTS_WITH_STATS } from "@/lib/mock/events.mock";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 관리자 이벤트 관리 페이지
export default async function AdminEventsPage() {
  // 인증 확인 — 미인증 시 관리자 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/admin/login");
  }

  return (
    <div>
      <PageHeader
        title="이벤트 관리"
        description={`총 ${MOCK_EVENTS_WITH_STATS.length}개의 이벤트`}
      />
      <AdminEventsTable events={MOCK_EVENTS_WITH_STATS} />
    </div>
  );
}
