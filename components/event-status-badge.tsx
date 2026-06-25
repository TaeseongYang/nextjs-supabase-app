import { Badge } from "@/components/ui/badge";
import { EVENT_STATUS_LABEL, type EventStatus } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

const statusColorMap: Record<EventStatus, string> = {
  recruiting:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  confirmed:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  completed:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  cancelled:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  return (
    <Badge className={cn(statusColorMap[status], className)} variant="outline">
      {EVENT_STATUS_LABEL[status]}
    </Badge>
  );
}
