import type { Participant } from "@/lib/types/entities";

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "part-001",
    event_id: "evt-001",
    name: "김민준",
    phone: "010-1234-5678",
    status: "attending",
    joined_at: "2024-11-05T10:00:00Z",
  },
  {
    id: "part-002",
    event_id: "evt-001",
    name: "이서연",
    phone: "010-2345-6789",
    status: "attending",
    joined_at: "2024-11-06T11:00:00Z",
  },
  {
    id: "part-003",
    event_id: "evt-001",
    name: "박지훈",
    phone: "010-3456-7890",
    status: "absent",
    joined_at: "2024-11-07T09:30:00Z",
  },
  {
    id: "part-004",
    event_id: "evt-001",
    name: "최수아",
    phone: null,
    status: "pending",
    joined_at: "2024-11-08T14:00:00Z",
  },
  {
    id: "part-005",
    event_id: "evt-001",
    name: "정태양",
    phone: "010-5678-9012",
    status: "attending",
    joined_at: "2024-11-09T16:00:00Z",
  },
  {
    id: "part-006",
    event_id: "evt-001",
    name: "한가을",
    phone: "010-6789-0123",
    status: "waitlisted",
    joined_at: "2024-11-10T10:00:00Z",
  },
];
