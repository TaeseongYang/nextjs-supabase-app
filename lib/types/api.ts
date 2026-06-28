import type { EventStatus, ParticipantStatus, SplitType } from "./enums";
import type {
  Announcement,
  Carpool,
  Event,
  Participant,
  SettlementDetail,
  SettlementItem,
} from "./entities";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  location: string;
  event_date: string;
  max_participants?: number;
  cover_image_url?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: EventStatus;
}

export interface CreateParticipantDto {
  name: string;
  phone?: string;
  status: ParticipantStatus;
}

export interface CreateCarpoolDto {
  driver_participant_id: string;
  departure_location: string;
  departure_time: string;
  max_passengers: number;
}

export interface CreateCarpoolRequestDto {
  carpool_id: string;
  participant_id: string;
}

export interface CreateSettlementItemDto {
  title: string;
  total_amount: number;
  split_type: SplitType;
}

export interface EventWithStats extends Event {
  participant_count: number;
  attending_count: number;
}

export interface CarpoolWithDetails extends Carpool {
  driver: Participant;
  passengers: Participant[];
  remaining_seats: number;
}

export interface SettlementSummary {
  item: SettlementItem;
  details: Array<SettlementDetail & { participant: Participant }>;
  total_paid: number;
  total_unpaid: number;
}

export interface JoinPageData {
  event: Event;
  announcements: Announcement[];
  participant_count: number;
  attending_count: number;
}
