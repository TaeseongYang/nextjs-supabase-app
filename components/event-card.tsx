// 이벤트 카드 서버 컴포넌트 — 이벤트 목록에서 개별 이벤트를 표시한다
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/event-status-badge";
import { formatEventDate } from "@/lib/utils";
import type { EventWithStats } from "@/lib/types/api";

interface EventCardProps {
  event: EventWithStats;
}

export function EventCard({ event }: EventCardProps) {
  // 최대 참여자 수 텍스트 — null 이면 표시 생략
  const maxParticipantsText =
    event.max_participants != null ? ` / 최대 ${event.max_participants}명` : "";

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="p-4">
          {/* 상단: 제목 + 상태 배지 */}
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold leading-snug text-foreground">
              {event.title}
            </span>
            <EventStatusBadge status={event.status} />
          </div>

          {/* 중단: 날짜 및 장소 */}
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{formatEventDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* 하단: 참여자 수 */}
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              참여 {event.attending_count}/{event.participant_count}명
              {maxParticipantsText}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
