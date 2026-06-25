interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">이벤트 참여</h1>
      <p className="text-sm text-muted-foreground">초대 코드: {token}</p>
      {/* TODO: Phase 3에서 토큰으로 이벤트 조회 및 참여 폼 구현 */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">공지사항이 여기에 표시됩니다.</p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          참여 응답 폼이 여기에 표시됩니다.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          참여자 현황이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
