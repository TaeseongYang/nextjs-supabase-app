import type { ActivityFeedItem } from "@/lib/mock/admin.mock";
import { CalendarDays, CheckCircle, UserPlus } from "lucide-react";

interface AdminActivityFeedProps {
  items: ActivityFeedItem[];
}

// 활동 타입별 아이콘 매핑
const ACTIVITY_ICON_MAP = {
  event_created: CalendarDays,
  user_joined: UserPlus,
  event_completed: CheckCircle,
} as const;

// 활동 타입별 아이콘 색상 매핑
const ACTIVITY_COLOR_MAP = {
  event_created: "text-blue-500",
  user_joined: "text-green-500",
  event_completed: "text-gray-500",
} as const;

// 날짜 문자열을 간단한 한국어 형식으로 포맷
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// 관리자 최근 활동 피드 컴포넌트
export function AdminActivityFeed({ items }: AdminActivityFeedProps) {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const Icon = ACTIVITY_ICON_MAP[item.type];
        const colorClass = ACTIVITY_COLOR_MAP[item.type];

        return (
          <li key={item.id} className="flex items-start gap-3">
            {/* 활동 타입 아이콘 */}
            <div className="mt-0.5 shrink-0">
              <Icon className={`h-4 w-4 ${colorClass}`} />
            </div>

            {/* 활동 설명 및 시간 */}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{item.description}</p>
              <time className="text-xs text-muted-foreground">
                {formatDate(item.created_at)}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
