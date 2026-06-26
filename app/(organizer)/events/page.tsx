import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { DashboardEventList } from "@/components/dashboard-event-list";
import { PageHeader } from "@/components/page-header";
import { MOCK_EVENTS_WITH_STATS } from "@/lib/mock/events.mock";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

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
      <DashboardEventList events={MOCK_EVENTS_WITH_STATS} />
    </div>
  );
}
