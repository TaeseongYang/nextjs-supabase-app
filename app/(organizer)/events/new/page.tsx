import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EventNewPage() {
  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">새 이벤트 만들기</h1>
      {/* TODO: Phase 4에서 React Hook Form + Zod 폼 구현 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          이벤트 생성 폼이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
