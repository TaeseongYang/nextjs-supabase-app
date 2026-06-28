import { AdminEventsTable } from "@/components/admin-events-table";
import { AdminPagination } from "@/components/admin-pagination";
import { PageHeader } from "@/components/page-header";
import { getAdminEventsAction } from "@/lib/admin/admin.actions";
import { checkAdminAction } from "@/lib/profiles/profile.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { EventStatus } from "@/lib/types/enums";

interface AdminEventsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

// 관리자 이벤트 관리 페이지 (서버 사이드 페이지네이션 및 필터링)
export default async function AdminEventsPage({
  searchParams,
}: AdminEventsPageProps) {
  // 인증 확인 — 미인증 시 관리자 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/admin/login");
  }

  // 관리자 권한 검증 — is_admin=false인 인증 사용자 차단
  const { isAdmin } = await checkAdminAction();
  if (!isAdmin) redirect("/admin/login");

  // searchParams 비동기 처리 (Next.js 15 필수)
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 10;
  const search = params.search ?? undefined;
  const rawStatus = params.status;
  const status =
    rawStatus && rawStatus !== "all" ? (rawStatus as EventStatus) : undefined;

  // 서버 사이드에서 이벤트 목록 조회
  const { data: result, error } = await getAdminEventsAction({
    page,
    pageSize,
    search,
    status,
  });

  if (error || !result) {
    return (
      <div>
        <PageHeader
          title="이벤트 관리"
          description="데이터를 불러오지 못했습니다"
        />
        <p className="text-destructive">
          {error ?? "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="이벤트 관리"
        description={`총 ${result.total}개의 이벤트`}
      />
      <AdminEventsTable
        events={result.data}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
      />
      <AdminPagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        basePath="/admin/events"
      />
    </div>
  );
}
