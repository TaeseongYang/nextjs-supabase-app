import type { CarpoolWithDetails } from "@/lib/types/api";
import type { Carpool, CarpoolRequest } from "@/lib/types/entities";
import { MOCK_PARTICIPANTS } from "./participants.mock";

export const MOCK_CARPOOLS: Carpool[] = [
  {
    id: "car-001",
    event_id: "evt-001",
    driver_participant_id: "part-001",
    departure_location: "홍대입구역 2번 출구",
    departure_time: "2024-12-20T07:30:00Z",
    max_passengers: 3,
  },
  {
    id: "car-002",
    event_id: "evt-001",
    driver_participant_id: "part-005",
    departure_location: "강남역 10번 출구",
    departure_time: "2024-12-20T08:00:00Z",
    max_passengers: 2,
  },
];

export const MOCK_CARPOOL_REQUESTS: CarpoolRequest[] = [
  {
    id: "req-001",
    carpool_id: "car-001",
    participant_id: "part-002",
    status: "confirmed",
  },
  {
    id: "req-002",
    carpool_id: "car-001",
    participant_id: "part-004",
    status: "pending",
  },
  {
    id: "req-003",
    carpool_id: "car-002",
    participant_id: "part-003",
    status: "confirmed",
  },
  {
    id: "req-004",
    carpool_id: "car-002",
    participant_id: "part-006",
    status: "rejected",
  },
];

export const MOCK_CARPOOLS_WITH_DETAILS: CarpoolWithDetails[] = [
  {
    ...MOCK_CARPOOLS[0],
    driver: MOCK_PARTICIPANTS[0],
    passengers: [MOCK_PARTICIPANTS[1]],
    remaining_seats: 2,
  },
  {
    ...MOCK_CARPOOLS[1],
    driver: MOCK_PARTICIPANTS[4],
    passengers: [MOCK_PARTICIPANTS[2]],
    remaining_seats: 0,
  },
];
