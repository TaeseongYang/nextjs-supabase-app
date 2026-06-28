import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { EventStatusBadge } from "@/components/event-status-badge";
import { AnnouncementsTab } from "@/components/event-detail-tabs/announcements-tab";
import { JoinResponseForm } from "@/components/join-response-form";
import { ParticipantStats } from "@/components/participant-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/utils";
import { getJoinPageDataAction } from "@/lib/events/event.actions";
import { getParticipantsByTokenAction } from "@/lib/participants/participant.actions";
import { createClient } from "@/lib/supabase/server";

// 회원 전용 초대 링크 참여 페이지 — 로그인 사용자만 접근 가능
interface JoinPageProps {
  params: Promise<{ token: string }>;
}

/**
 * OG 메타 태그 생성 — 카카오톡/SNS 공유용
 */
export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { token } = await params;
  const { data } = await getJoinPageDataAction(token);

  if (!data) {
    return { title: "이벤트를 찾을 수 없습니다" };
  }

  const { event, participant_count } = data;

  // 날짜 포맷: "2025년 1월 15일 오후 3:00"
  const eventDate = new Date(event.event_date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const title = `${event.title} — 참여 초대`;
  const description = `일시: ${eventDate} | 장소: ${event.location} | ${participant_count}명 참여 중`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  // Next.js 15 비동기 params 패턴
  const { token } = await params;

  // 로그인 사용자 확인 — 미인증이면 게이트로 redirect
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/join/${token}/login`);
  }

  // 프로필에서 표시 이름 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();
  const userName = profile?.full_name ?? user.email ?? "사용자";

  // 이벤트 데이터와 참여자 목록을 병렬로 조회 — 성능 최적화
  const [joinPageResult, participantsResult] = await Promise.all([
    getJoinPageDataAction(token),
    getParticipantsByTokenAction(token),
  ]);

  // 이벤트 없음 → 404
  if (!joinPageResult.data) notFound();

  const { event, announcements } = joinPageResult.data;
  // 참여자 목록 — 실패 시 빈 배열로 폴백
  const participants = participantsResult.data ?? [];

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

      {/* 3. 참여 응답 폼 섹션 — 로그인 사용자 이름 전달 */}
      <Card>
        <CardHeader>
          <CardTitle>참여 응답</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinResponseForm token={token} userName={userName} />
        </CardContent>
      </Card>

      {/* 4. 참여자 현황 섹션 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">참여 현황</h2>
        <ParticipantStats participants={participants} />
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
