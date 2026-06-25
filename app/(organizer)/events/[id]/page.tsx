import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { EventStatusBadge } from "@/components/event-status-badge";
import { InviteLinkButton } from "@/components/invite-link-button";
import { EventDetailTabs } from "@/components/event-detail-tabs";
import { MOCK_EVENTS, MOCK_JOIN_PAGE_DATA } from "@/lib/mock/events.mock";
import { MOCK_PARTICIPANTS } from "@/lib/mock/participants.mock";
import { MOCK_CARPOOLS_WITH_DETAILS } from "@/lib/mock/carpools.mock";
import { MOCK_SETTLEMENT_SUMMARIES } from "@/lib/mock/settlement.mock";
import { formatEventDate } from "@/lib/utils";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;

  // 인증 확인 — 미인증 시 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  // id로 이벤트 찾기 (Phase 3에서 실제 DB 연동 예정)
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  // 해당 이벤트의 공지사항만 필터링
  const announcements = MOCK_JOIN_PAGE_DATA.announcements.filter(
    (a) => a.event_id === id,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더: 제목 + 수정 버튼 */}
      <PageHeader
        title={event.title}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${id}/edit`}>
              <Pencil className="mr-1 h-4 w-4" />
              수정
            </Link>
          </Button>
        }
      />

      {/* 이벤트 기본 정보 섹션 */}
      <div className="flex flex-col gap-2">
        {/* 상태 배지 */}
        <EventStatusBadge status={event.status} />

        {/* 날짜 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{formatEventDate(event.event_date)}</span>
        </div>

        {/* 장소 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{event.location}</span>
        </div>

        {/* 설명 (있을 때만 표시) */}
        {event.description && <p className="text-sm">{event.description}</p>}
      </div>

      {/* 초대 링크 복사 버튼 */}
      <InviteLinkButton token={event.invite_token} />

      <Separator />

      {/* 탭 (공지 / 참여자 / 카풀 / 정산) */}
      <EventDetailTabs
        announcements={announcements}
        participants={MOCK_PARTICIPANTS}
        carpools={MOCK_CARPOOLS_WITH_DETAILS}
        settlements={MOCK_SETTLEMENT_SUMMARIES}
      />
    </div>
  );
}
