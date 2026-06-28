import Link from "next/link";
import { PlusCircle, Link2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/event-card";
import { getMyEventsAction } from "@/lib/events/event.actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "사용자";

  // 실데이터 이벤트 목록 조회
  const { data } = await getMyEventsAction();
  const events = data ?? [];

  // 다가오는 이벤트: recruiting 또는 confirmed 상태만 필터 후 최대 2개
  const upcomingEvents = events
    .filter((e) => e.status === "recruiting" || e.status === "confirmed")
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* 인사말 */}
      <div>
        <h1 className="text-xl font-bold">안녕하세요, {displayName}님 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          오늘도 모임을 즐겁게 관리해보세요
        </p>
      </div>

      {/* 빠른 액션 */}
      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          빠른 액션
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/events/new"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-primary p-5 text-primary-foreground transition-opacity hover:opacity-90"
          >
            <PlusCircle className="h-7 w-7" />
            <span className="text-sm font-medium">이벤트 만들기</span>
          </Link>
          <Link
            href="/events"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-secondary p-5 text-secondary-foreground transition-opacity hover:opacity-90"
          >
            <Link2 className="h-7 w-7" />
            <span className="text-sm font-medium">초대 링크로 참여</span>
          </Link>
        </div>
      </div>

      {/* 다가오는 이벤트 미리보기 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            다가오는 이벤트
          </h2>
          <Link
            href="/events"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={user?.id ?? ""}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            다가오는 이벤트가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
