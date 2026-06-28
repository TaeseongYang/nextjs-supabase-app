import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { DashboardEventList } from "@/components/dashboard-event-list";
import { PageHeader } from "@/components/page-header";
import { getMyEventsAction } from "@/lib/events/event.actions";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? "";

  const { data, error } = await getMyEventsAction();

  // 인증 실패 시 layout에서 처리 — 여기서는 빈 배열로 폴백
  const events = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="이벤트 목록"
        action={
          <Link
            href="/events/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            이벤트 만들기
          </Link>
        }
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <DashboardEventList events={events} currentUserId={currentUserId} />
    </div>
  );
}
