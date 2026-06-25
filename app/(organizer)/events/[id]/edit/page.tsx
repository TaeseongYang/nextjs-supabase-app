import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EventForm } from "@/components/event-form";
import { MOCK_EVENTS } from "@/lib/mock/events.mock";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  // params는 Next.js 15에서 Promise이므로 await 필수
  const { id: _id } = await params;

  const supabase = await createClient();
  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  // mock 데이터의 첫 번째 이벤트를 수정 대상으로 사용
  const event = MOCK_EVENTS[0];

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
      <EventForm mode="edit" defaultValues={defaultValues} />
    </div>
  );
}
