import { Badge } from "@/components/ui/badge";
import {
  PARTICIPANT_STATUS_LABEL,
  type ParticipantStatus,
} from "@/lib/types/enums";
import { cn } from "@/lib/utils";

const statusColorMap: Record<ParticipantStatus, string> = {
  attending:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  absent:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  pending:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  waitlisted:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
};

interface ParticipantStatusBadgeProps {
  status: ParticipantStatus;
  className?: string;
}

export function ParticipantStatusBadge({
  status,
  className,
}: ParticipantStatusBadgeProps) {
  return (
    <Badge className={cn(statusColorMap[status], className)} variant="outline">
      {PARTICIPANT_STATUS_LABEL[status]}
    </Badge>
  );
}
