import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
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
        <h1 className="text-3xl font-bold">이벤트 수정</h1>
        <span className="text-sm text-muted-foreground">ID: {id}</span>
      </div>
      {/* TODO: Phase 4에서 React Hook Form + Zod 폼 구현 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          이벤트 수정 폼이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
