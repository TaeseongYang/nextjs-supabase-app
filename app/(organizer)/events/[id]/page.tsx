import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">이벤트 상세</h1>
        <span className="text-sm text-muted-foreground">ID: {id}</span>
      </div>
      {/* TODO: Phase 3에서 실제 이벤트 데이터 연동 */}
      <div className="grid grid-cols-4 gap-2 border-b pb-4">
        {["공지", "참여자", "카풀", "정산"].map((tab) => (
          <button
            key={tab}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">탭 내용이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}
