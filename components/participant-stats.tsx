import type { Participant } from "@/lib/types/entities";

interface ParticipantStatsProps {
  participants: Participant[];
}

// 참여자 통계 카드 컴포넌트 (Server Component)
export function ParticipantStats({ participants }: ParticipantStatsProps) {
  // 상태별 참여자 수 계산
  const total = participants.length;
  const attending = participants.filter((p) => p.status === "attending").length;
  const waitlisted = participants.filter(
    (p) => p.status === "waitlisted",
  ).length;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* 전체 참여자 카드 */}
      <div className="rounded-lg border p-4 text-center">
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-sm text-muted-foreground">전체 참여자</p>
      </div>

      {/* 참석 확정 카드 */}
      <div className="rounded-lg border p-4 text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {attending}
        </p>
        <p className="text-sm text-muted-foreground">참석 확정</p>
      </div>

      {/* 대기 카드 */}
      <div className="rounded-lg border p-4 text-center">
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {waitlisted}
        </p>
        <p className="text-sm text-muted-foreground">대기</p>
      </div>
    </div>
  );
}
