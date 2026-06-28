import type {
  EventStatus,
  ParticipantStatus,
  CarpoolRequestStatus,
  SplitType,
} from "./enums";

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  max_participants: number | null;
  status: EventStatus;
  invite_token: string;
  created_at: string;
  cover_image_url: string | null;
}

export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  name: string;
  phone: string | null;
  status: ParticipantStatus;
  joined_at: string;
}

export interface Announcement {
  id: string;
  event_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

export interface Carpool {
  id: string;
  event_id: string;
  driver_participant_id: string;
  departure_location: string;
  departure_time: string;
  max_passengers: number;
}

export interface CarpoolRequest {
  id: string;
  carpool_id: string;
  participant_id: string;
  status: CarpoolRequestStatus;
}

export interface SettlementItem {
  id: string;
  event_id: string;
  title: string;
  total_amount: number;
  split_type: SplitType;
}

export interface SettlementDetail {
  id: string;
  settlement_item_id: string;
  participant_id: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
}
