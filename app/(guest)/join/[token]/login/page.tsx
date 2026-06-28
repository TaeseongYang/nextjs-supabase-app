import { createClient } from "@/lib/supabase/server";
import { getJoinPageDataAction } from "@/lib/events/event.actions";
import { JoinLoginGate } from "@/components/join-login-gate";

interface JoinLoginPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinLoginPage({ params }: JoinLoginPageProps) {
  const { token } = await params;

  // 이벤트 제목 조회 (게이트 페이지에 표시)
  const { data } = await getJoinPageDataAction(token);
  const eventTitle = data?.event.title ?? "모임";

  // 현재 로그인 상태 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    currentUserName = profile?.full_name ?? user.email ?? null;
  }

  return (
    <JoinLoginGate
      token={token}
      eventTitle={eventTitle}
      currentUserName={currentUserName}
    />
  );
}
