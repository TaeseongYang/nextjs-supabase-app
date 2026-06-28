// 이벤트 카드 서버 컴포넌트 — 이벤트 목록에서 개별 이벤트를 표시한다
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ImageIcon, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/event-status-badge";
import { formatEventDate } from "@/lib/utils";
import type { EventWithStats } from "@/lib/types/api";

interface EventCardProps {
  event: EventWithStats;
  currentUserId: string;
}

export function EventCard({ event, currentUserId }: EventCardProps) {
  const maxParticipantsText =
    event.max_participants != null ? ` / 최대 ${event.max_participants}명` : "";
  const isMyEvent = event.organizer_id === currentUserId;

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-start gap-3 p-4">
          {/* 왼쪽: 커버 이미지 썸네일 */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {event.cover_image_url ? (
              <Image
                src={event.cover_image_url}
                alt={`${event.title} 커버 이미지`}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-7 w-7 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* 오른쪽: 텍스트 정보 */}
          <div className="min-w-0 flex-1">
            {/* 상단: 제목 + 상태 배지 — nowrap으로 한 줄 유지 */}
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm leading-snug font-semibold text-foreground">
                {event.title}
              </span>
              <EventStatusBadge
                status={event.status}
                className="shrink-0 px-1.5 py-0.5 text-xs whitespace-nowrap"
              />
            </div>
            {/* 내 이벤트 구분 배지 */}
            {isMyEvent && (
              <div className="mt-0.5">
                <Badge
                  variant="outline"
                  className="h-4 border-primary/30 bg-primary/5 px-1.5 py-0 text-[10px] text-primary"
                >
                  내 이벤트
                </Badge>
              </div>
            )}

            {/* 중단: 날짜 및 장소 */}
            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {formatEventDate(event.event_date)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* 하단: 참여자 수 */}
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>
                참여 {event.attending_count}/{event.participant_count}명
                {maxParticipantsText}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
