import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { MOCK_EVENTS, MOCK_JOIN_PAGE_DATA } from "@/lib/mock/events.mock";
import { MOCK_PARTICIPANTS } from "@/lib/mock/participants.mock";
import { EventStatusBadge } from "@/components/event-status-badge";
import { AnnouncementsTab } from "@/components/event-detail-tabs/announcements-tab";
import { JoinResponseForm } from "@/components/join-response-form";
import { ParticipantStats } from "@/components/participant-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/utils";

// 게스트 초대 링크 페이지 — 토큰으로 이벤트를 조회하고 참여 응답을 받는다
interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  // Next.js 15 비동기 params 패턴
  const { token } = await params;

  // token으로 이벤트 조회 — 없으면 404
  const event = MOCK_EVENTS.find((e) => e.invite_token === token);
  if (!event) notFound();

  // 해당 이벤트의 공지사항만 필터링
  const announcements = MOCK_JOIN_PAGE_DATA.announcements.filter(
    (a) => a.event_id === event.id,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* 1. 이벤트 헤더 섹션 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <EventStatusBadge status={event.status} />

        {/* 날짜 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{formatEventDate(event.event_date)}</span>
        </div>

        {/* 장소 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>

        {/* 설명 (있을 때만 표시) */}
        {event.description && (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        )}
      </div>

      {/* 2. 공지사항 섹션 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">공지사항</h2>
        <AnnouncementsTab announcements={announcements} />
      </div>

      {/* 3. 참여 응답 폼 섹션 (Card로 감싸기) */}
      <Card>
        <CardHeader>
          <CardTitle>참여 응답</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinResponseForm />
        </CardContent>
      </Card>

      {/* 4. 참여자 현황 섹션 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">참여 현황</h2>
        <ParticipantStats participants={MOCK_PARTICIPANTS} />
      </div>

      {/* 5. 하단 네비게이션 */}
      <div className="flex justify-end gap-3 pt-2">
        <Button asChild variant="outline">
          <Link href={`/join/${token}/carpooling`}>카풀 신청 →</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/join/${token}/settlement`}>정산 내역 →</Link>
        </Button>
      </div>
    </div>
  );
}
