import Link from "next/link";
import { PlusCircle, CalendarDays, ChevronRight } from "lucide-react";

const ACTIONS = [
  {
    label: "새 이벤트 만들기",
    href: "/events/new",
    icon: PlusCircle,
  },
  {
    label: "내 이벤트 보기",
    href: "/events",
    icon: CalendarDays,
  },
];

export function ProfileQuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        빠른 액션
      </h2>
      <div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
