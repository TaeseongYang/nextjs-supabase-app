"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  changeEventStatusAction,
  deleteEventAction,
} from "@/lib/events/event.actions";
import type { EventStatus } from "@/lib/types/enums";

interface StatusOption {
  label: string;
  status: EventStatus;
}

// 현재 상태별 전환 가능한 다음 상태 버튼 목록
const NEXT_STATUS_OPTIONS: Partial<Record<EventStatus, StatusOption[]>> = {
  recruiting: [
    { label: "이벤트 확정", status: "confirmed" },
    { label: "이벤트 취소", status: "cancelled" },
  ],
  confirmed: [
    { label: "이벤트 완료", status: "completed" },
    { label: "이벤트 취소", status: "cancelled" },
  ],
  cancelled: [{ label: "모집 재개", status: "recruiting" }],
};

interface EventStatusChangerProps {
  eventId: string;
  currentStatus: EventStatus;
}

export function EventStatusChanger({
  eventId,
  currentStatus,
}: EventStatusChangerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // completed/cancelled 상태는 전환 불가 — 버튼 미노출
  const options = NEXT_STATUS_OPTIONS[currentStatus];
  if (!options || options.length === 0) return null;

  function handleStatusChange(newStatus: EventStatus) {
    startTransition(async () => {
      const result = await changeEventStatusAction(eventId, newStatus);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("상태가 변경되었습니다");
      router.refresh();
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        "이벤트를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("이벤트가 삭제되었습니다");
      router.push("/events");
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.status}
          variant={option.status === "cancelled" ? "destructive" : "default"}
          size="sm"
          disabled={isPending}
          onClick={() => handleStatusChange(option.status)}
        >
          {isPending ? "처리 중..." : option.label}
        </Button>
      ))}
      {currentStatus === "cancelled" && (
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? "처리 중..." : "이벤트 삭제"}
        </Button>
      )}
    </div>
  );
}
