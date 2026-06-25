import Link from "next/link";

import { DriverRegisterForm } from "@/components/driver-register-form";
import { GuestCarpoolsList } from "@/components/guest-carpools-list";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/mock/events.mock";
import { MOCK_CARPOOLS_WITH_DETAILS } from "@/lib/mock/carpools.mock";
import { formatEventDate } from "@/lib/utils";

interface CarpoolingPageProps {
  params: Promise<{ token: string }>;
}

export default async function CarpoolingPage({ params }: CarpoolingPageProps) {
  const { token } = await params;

  // 목업 데이터에서 이벤트 정보 조회
  const event = MOCK_EVENTS[0];

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 및 이벤트 요약 */}
      <div>
        <PageHeader title="카풀 신청" />
        <p className="text-sm text-muted-foreground">
          {event.title} · {formatEventDate(event.event_date)}
        </p>
      </div>

      {/* 드라이버 등록 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>드라이버로 등록하기</CardTitle>
          <CardDescription>
            직접 운전하시나요? 출발지와 시간을 등록하면 동승 신청을 받을 수
            있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DriverRegisterForm />
        </CardContent>
      </Card>

      {/* 카풀 현황 섹션 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">카풀 현황</h2>
        <GuestCarpoolsList carpools={MOCK_CARPOOLS_WITH_DETAILS} />
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex justify-between pt-2">
        <Button asChild variant="outline">
          <Link href={`/join/${token}`}>← 참여 응답</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/join/${token}/settlement`}>정산 내역 →</Link>
        </Button>
      </div>
    </div>
  );
}
