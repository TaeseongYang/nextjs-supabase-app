import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { EventForm } from "@/components/event-form";
import { getEventAction } from "@/lib/events/event.actions";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  // Next.js 15 비동기 params 패턴
  const { id } = await params;

  // Server Action으로 실데이터 조회 (소유권 검증 포함)
  const { data: event, error } = await getEventAction(id);

  // 이벤트 없음 or 권한 없음 → 404
  if (error || !event) notFound();

  // EventForm에 전달할 defaultValues 구성
  // max_participants: HTML input[type=number]는 string으로 관리하므로 문자열 변환
  const defaultValues = {
    title: event.title,
    description: event.description ?? "",
    location: event.location,
    // datetime-local input은 "YYYY-MM-DDTHH:MM" 형식 필요 (초 이하 제거)
    event_date: event.event_date.slice(0, 16),
    max_participants:
      event.max_participants != null
        ? String(event.max_participants)
        : undefined,
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="이벤트 수정" />
      <EventForm
        mode="edit"
        defaultValues={defaultValues}
        eventId={id}
        defaultCoverImageUrl={event.cover_image_url ?? undefined}
      />
    </div>
  );
}
