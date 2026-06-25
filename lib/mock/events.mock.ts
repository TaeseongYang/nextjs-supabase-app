import type { EventWithStats, JoinPageData } from "@/lib/types/api";
import type { Announcement, Event } from "@/lib/types/entities";

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-001",
    organizer_id: "user-001",
    title: "2024 팀 워크숍",
    description: "연말 팀 빌딩 및 내년 목표 공유 워크숍",
    location: "강원도 춘천 리조트",
    event_date: "2024-12-20T10:00:00Z",
    max_participants: 30,
    status: "confirmed",
    invite_token: "token-evt-001",
    created_at: "2024-11-01T09:00:00Z",
  },
  {
    id: "evt-002",
    organizer_id: "user-001",
    title: "신년 번개 모임",
    description: "새해 첫 번개 자리",
    location: "서울 강남구 삼성동",
    event_date: "2025-01-05T18:00:00Z",
    max_participants: null,
    status: "recruiting",
    invite_token: "token-evt-002",
    created_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "evt-003",
    organizer_id: "user-001",
    title: "여름 MT",
    description: "부서 여름 워터파크 MT",
    location: "경기도 가평 오션월드",
    event_date: "2024-07-15T09:00:00Z",
    max_participants: 20,
    status: "completed",
    invite_token: "token-evt-003",
    created_at: "2024-06-01T08:00:00Z",
  },
  {
    id: "evt-004",
    organizer_id: "user-001",
    title: "취소된 등산 모임",
    description: "북한산 단풍 등산 (기상 악화로 취소)",
    location: "서울 북한산 국립공원",
    event_date: "2024-10-20T07:00:00Z",
    max_participants: 15,
    status: "cancelled",
    invite_token: "token-evt-004",
    created_at: "2024-10-01T09:00:00Z",
  },
];

export const MOCK_EVENTS_WITH_STATS: EventWithStats[] = [
  { ...MOCK_EVENTS[0], participant_count: 25, attending_count: 22 },
  { ...MOCK_EVENTS[1], participant_count: 8, attending_count: 6 },
  { ...MOCK_EVENTS[2], participant_count: 18, attending_count: 18 },
  { ...MOCK_EVENTS[3], participant_count: 10, attending_count: 0 },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-001",
    event_id: "evt-001",
    content: "집결 장소: 홍대입구역 2번 출구 오전 8시",
    is_pinned: true,
    created_at: "2024-12-10T09:00:00Z",
  },
  {
    id: "ann-002",
    event_id: "evt-001",
    content: "개인 세면도구 및 여벌 옷 꼭 챙겨오세요!",
    is_pinned: false,
    created_at: "2024-12-12T10:00:00Z",
  },
];

export const MOCK_JOIN_PAGE_DATA: JoinPageData = {
  event: MOCK_EVENTS[0],
  announcements: MOCK_ANNOUNCEMENTS,
  participant_count: 25,
  attending_count: 22,
};
