interface CarpoolingPageProps {
  params: Promise<{ token: string }>;
}

export default async function CarpoolingPage({ params }: CarpoolingPageProps) {
  const { token } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">카풀 신청</h1>
      <p className="text-sm text-muted-foreground">초대 코드: {token}</p>
      {/* TODO: Phase 3에서 카풀 목록 조회 및 신청 기능 구현 */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">카풀 목록이 여기에 표시됩니다.</p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          카풀 신청 버튼이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
