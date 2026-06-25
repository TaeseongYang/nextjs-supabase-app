import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Link
          href="/events/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          이벤트 만들기
        </Link>
      </div>
      {/* TODO: Phase 3에서 실제 이벤트 목록 연동 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">아직 이벤트가 없습니다.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          새 이벤트를 만들어 모임을 시작해보세요.
        </p>
      </div>
    </div>
  );
}
