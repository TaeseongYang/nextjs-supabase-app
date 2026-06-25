import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SettlementsTab } from "@/components/event-detail-tabs/settlements-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/mock/events.mock";
import { MOCK_SETTLEMENT_SUMMARIES } from "@/lib/mock/settlement.mock";
import { formatEventDate } from "@/lib/utils";

// 정산 내역 페이지 Props
interface SettlementPageProps {
  params: Promise<{ token: string }>;
}

export default async function SettlementPage({ params }: SettlementPageProps) {
  const { token } = await params;

  // 목 데이터에서 첫 번째 이벤트 사용
  const event = MOCK_EVENTS[0];

  // 정산 요약 계산
  const totalPaid = MOCK_SETTLEMENT_SUMMARIES.reduce(
    (acc, s) => acc + s.total_paid,
    0,
  );
  const totalUnpaid = MOCK_SETTLEMENT_SUMMARIES.reduce(
    (acc, s) => acc + s.total_unpaid,
    0,
  );
  const totalAmount = totalPaid + totalUnpaid;

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 및 이벤트 요약 */}
      <div>
        <PageHeader title="정산 내역" />
        <p className="text-sm text-muted-foreground">
          {event.title} · {formatEventDate(event.event_date)}
        </p>
      </div>

      {/* 정산 요약 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>정산 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {/* 총 금액 */}
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold">
                {totalAmount.toLocaleString()}원
              </p>
              <p className="text-sm text-muted-foreground">총 금액</p>
            </div>
            {/* 입금 완료 */}
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalPaid.toLocaleString()}원
              </p>
              <p className="text-sm text-muted-foreground">입금 완료</p>
            </div>
            {/* 미납 */}
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-destructive">
                {totalUnpaid.toLocaleString()}원
              </p>
              <p className="text-sm text-muted-foreground">미납</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 항목별 내역 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">항목별 내역</h2>
        <SettlementsTab settlements={MOCK_SETTLEMENT_SUMMARIES} />
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex justify-between pt-2">
        {/* 이전 페이지: 카풀 신청 */}
        <Button asChild variant="outline">
          <Link href={`/join/${token}/carpooling`}>← 카풀 신청</Link>
        </Button>
        {/* 처음으로 */}
        <Button asChild>
          <Link href={`/join/${token}`}>처음으로 →</Link>
        </Button>
      </div>
    </div>
  );
}
