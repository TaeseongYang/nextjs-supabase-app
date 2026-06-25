interface SettlementPageProps {
  params: Promise<{ token: string }>;
}

export default async function SettlementPage({ params }: SettlementPageProps) {
  const { token } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">정산 내역</h1>
      <p className="text-sm text-muted-foreground">초대 코드: {token}</p>
      {/* TODO: Phase 3에서 정산 내역 조회 기능 구현 */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          정산 항목 테이블이 여기에 표시됩니다.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          분담 내역 및 입금 현황이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
