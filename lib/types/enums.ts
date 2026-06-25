export type EventStatus =
  | "recruiting"
  | "confirmed"
  | "completed"
  | "cancelled";
export type ParticipantStatus =
  | "attending"
  | "absent"
  | "pending"
  | "waitlisted";
export type CarpoolRequestStatus = "pending" | "confirmed" | "rejected";
export type SplitType = "equal" | "custom";

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  recruiting: "모집 중",
  confirmed: "확정",
  completed: "완료",
  cancelled: "취소",
};

export const PARTICIPANT_STATUS_LABEL: Record<ParticipantStatus, string> = {
  attending: "참석",
  absent: "불참",
  pending: "미정",
  waitlisted: "대기",
};

export const CARPOOL_REQUEST_STATUS_LABEL: Record<
  CarpoolRequestStatus,
  string
> = {
  pending: "대기",
  confirmed: "확정",
  rejected: "거절",
};

export const SPLIT_TYPE_LABEL: Record<SplitType, string> = {
  equal: "1/n 균등",
  custom: "개별 지정",
};
