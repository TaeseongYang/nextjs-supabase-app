import type { SettlementSummary } from "@/lib/types/api";
import type { SettlementDetail, SettlementItem } from "@/lib/types/entities";
import { MOCK_PARTICIPANTS } from "./participants.mock";

const MOCK_SETTLEMENT_ITEMS: SettlementItem[] = [
  {
    id: "si-001",
    event_id: "evt-001",
    title: "숙박비",
    total_amount: 300000,
    split_type: "equal",
  },
  {
    id: "si-002",
    event_id: "evt-001",
    title: "저녁 식사",
    total_amount: 150000,
    split_type: "custom",
  },
];

const MOCK_SETTLEMENT_DETAILS: Array<
  SettlementDetail & { participant: (typeof MOCK_PARTICIPANTS)[number] }
> = [
  {
    id: "sd-001",
    settlement_item_id: "si-001",
    participant_id: "part-001",
    amount: 100000,
    is_paid: true,
    paid_at: "2024-12-21T10:00:00Z",
    participant: MOCK_PARTICIPANTS[0],
  },
  {
    id: "sd-002",
    settlement_item_id: "si-001",
    participant_id: "part-002",
    amount: 100000,
    is_paid: true,
    paid_at: "2024-12-21T11:00:00Z",
    participant: MOCK_PARTICIPANTS[1],
  },
  {
    id: "sd-003",
    settlement_item_id: "si-001",
    participant_id: "part-005",
    amount: 100000,
    is_paid: false,
    paid_at: null,
    participant: MOCK_PARTICIPANTS[4],
  },
  {
    id: "sd-004",
    settlement_item_id: "si-002",
    participant_id: "part-001",
    amount: 50000,
    is_paid: true,
    paid_at: "2024-12-21T12:00:00Z",
    participant: MOCK_PARTICIPANTS[0],
  },
  {
    id: "sd-005",
    settlement_item_id: "si-002",
    participant_id: "part-002",
    amount: 60000,
    is_paid: false,
    paid_at: null,
    participant: MOCK_PARTICIPANTS[1],
  },
  {
    id: "sd-006",
    settlement_item_id: "si-002",
    participant_id: "part-005",
    amount: 40000,
    is_paid: false,
    paid_at: null,
    participant: MOCK_PARTICIPANTS[4],
  },
];

export const MOCK_SETTLEMENT_SUMMARIES: SettlementSummary[] = [
  {
    item: MOCK_SETTLEMENT_ITEMS[0],
    details: MOCK_SETTLEMENT_DETAILS.filter(
      (d) => d.settlement_item_id === "si-001",
    ),
    total_paid: 200000,
    total_unpaid: 100000,
  },
  {
    item: MOCK_SETTLEMENT_ITEMS[1],
    details: MOCK_SETTLEMENT_DETAILS.filter(
      (d) => d.settlement_item_id === "si-002",
    ),
    total_paid: 50000,
    total_unpaid: 100000,
  },
];
