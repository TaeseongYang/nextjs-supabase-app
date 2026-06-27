import { MOCK_EVENTS_WITH_STATS } from "@/lib/mock/events.mock";

export function ProfileStatsSection() {
  const total = MOCK_EVENTS_WITH_STATS.length;
  const active = MOCK_EVENTS_WITH_STATS.filter(
    (e) => e.status === "recruiting" || e.status === "confirmed",
  ).length;
  const completed = MOCK_EVENTS_WITH_STATS.filter(
    (e) => e.status === "completed",
  ).length;

  const stats = [
    { label: "전체", value: total },
    { label: "진행중", value: active },
    { label: "완료", value: completed },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        내 이벤트 현황
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4"
          >
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
