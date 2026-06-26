import { AdminUsersTable } from "@/components/admin-users-table";
import { PageHeader } from "@/components/page-header";
import { checkAdminAction } from "@/lib/profiles/profile.actions";
import { MOCK_ADMIN_USERS } from "@/lib/mock/admin.mock";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 관리자 사용자 관리 페이지
export default async function AdminUsersPage() {
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
      <PageHeader
        title="사용자 관리"
        description={`총 ${MOCK_ADMIN_USERS.length}명의 사용자`}
      />
      <AdminUsersTable users={MOCK_ADMIN_USERS} />
    </div>
  );
}
