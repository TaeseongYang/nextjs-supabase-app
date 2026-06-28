import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { EventStatusBadge } from "@/components/event-status-badge";
import { InviteLinkButton } from "@/components/invite-link-button";
import { EventDetailTabs } from "@/components/event-detail-tabs";
import { EventStatusChanger } from "@/components/event-status-changer";
import { getEventAction } from "@/lib/events/event.actions";
import { getParticipantsByEventAction } from "@/lib/participants/participant.actions";
import { formatEventDate } from "@/lib/utils";
import type { EventStatus } from "@/lib/types/enums";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  // Next.js 15 비동기 params 패턴
  const { id } = await params;

  // 이벤트 데이터와 참여자 목록을 병렬로 조회 — 성능 최적화
  const [{ data: event, error }, participantsResult] = await Promise.all([
    getEventAction(id),
    getParticipantsByEventAction(id),
  ]);

  // 이벤트 없음 or 권한 없음 → 404
  if (error || !event) notFound();

  // 참여자 목록 — 실패 시 빈 배열로 폴백
  const participants = participantsResult.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더: 제목 + 수정 버튼 */}
      <PageHeader
        title={event.title}
        action={
          event.status !== "cancelled" ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/events/${id}/edit`}>
                <Pencil className="mr-1 h-4 w-4" />
                수정
              </Link>
            </Button>
          ) : undefined
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

      {/* 상태 전환 버튼 — completed/cancelled이면 null 반환 */}
      <EventStatusChanger
        eventId={event.id}
        currentStatus={event.status as EventStatus}
      />

      <Separator />

      {/* 탭 (공지 / 참여자 / 카풀 / 정산) — 참여자 실데이터 연동, 카풀/정산은 Task 010에서 처리 예정 */}
      <EventDetailTabs
        announcements={[]}
        participants={participants}
        carpools={[]}
        settlements={[]}
      />
    </div>
  );
}
