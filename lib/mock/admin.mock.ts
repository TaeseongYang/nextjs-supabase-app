import type { User } from "@/lib/types/entities";
import type { EventStatus } from "@/lib/types/enums";
import { EVENT_STATUS_LABEL } from "@/lib/types/enums";

// 관리자용 사용자 타입 — 기본 User에 이벤트 참여 횟수 추가
export type AdminUser = User & { event_count: number };

// 관리자 대시보드 요약 통계 타입
export interface AdminStats {
  total_events: number;
  total_users: number;
  new_events_this_month: number;
  avg_participation_rate: number;
}

// 월별 통계 타입
export interface MonthlyStats {
  month: string;
  event_count: number;
  participant_count: number;
}

// 이벤트 상태별 분포 타입
export interface EventStatusDist {
  status: EventStatus;
  count: number;
  label: string;
}

// 최근 활동 피드 아이템 타입
export interface ActivityFeedItem {
  id: string;
  type: "event_created" | "user_joined" | "event_completed";
  description: string;
  created_at: string;
}

// 관리자 사용자 목록 더미 데이터 (10명)
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "user-001",
    email: "kim.jiho@example.com",
    name: "김지호",
    created_at: "2024-01-15T09:00:00Z",
    event_count: 12,
  },
  {
    id: "user-002",
    email: "lee.sooyeon@example.com",
    name: "이수연",
    created_at: "2024-02-03T10:30:00Z",
    event_count: 8,
  },
  {
    id: "user-003",
    email: "park.minjun@example.com",
    name: "박민준",
    created_at: "2024-02-20T14:00:00Z",
    event_count: 5,
  },
  {
    id: "user-004",
    email: "choi.yuna@example.com",
    name: "최유나",
    created_at: "2024-03-10T08:45:00Z",
    event_count: 15,
  },
  {
    id: "user-005",
    email: "jung.hyunwoo@example.com",
    name: "정현우",
    created_at: "2024-03-25T11:00:00Z",
    event_count: 3,
  },
  {
    id: "user-006",
    email: "han.minji@example.com",
    name: "한민지",
    created_at: "2024-04-08T09:15:00Z",
    event_count: 7,
  },
  {
    id: "user-007",
    email: "oh.seungjae@example.com",
    name: "오승재",
    created_at: "2024-05-12T13:20:00Z",
    event_count: 9,
  },
  {
    id: "user-008",
    email: "yoon.areum@example.com",
    name: "윤아름",
    created_at: "2024-06-01T10:00:00Z",
    event_count: 4,
  },
  {
    id: "user-009",
    email: "kang.junho@example.com",
    name: "강준호",
    created_at: "2024-07-18T15:30:00Z",
    event_count: 11,
  },
  {
    id: "user-010",
    email: "shin.eunbi@example.com",
    name: "신은비",
    created_at: "2024-08-22T09:45:00Z",
    event_count: 6,
  },
];

// 관리자 대시보드 요약 통계 더미 데이터
export const MOCK_ADMIN_STATS: AdminStats = {
  total_events: 42,
  total_users: 156,
  new_events_this_month: 8,
  avg_participation_rate: 78,
};

// 2024년 1월 ~ 12월 월별 통계 더미 데이터
export const MOCK_MONTHLY_STATS: MonthlyStats[] = [
  { month: "2024-01", event_count: 2, participant_count: 18 },
  { month: "2024-02", event_count: 3, participant_count: 27 },
  { month: "2024-03", event_count: 4, participant_count: 42 },
  { month: "2024-04", event_count: 3, participant_count: 31 },
  { month: "2024-05", event_count: 5, participant_count: 55 },
  { month: "2024-06", event_count: 4, participant_count: 48 },
  { month: "2024-07", event_count: 6, participant_count: 72 },
  { month: "2024-08", event_count: 5, participant_count: 61 },
  { month: "2024-09", event_count: 3, participant_count: 29 },
  { month: "2024-10", event_count: 4, participant_count: 44 },
  { month: "2024-11", event_count: 5, participant_count: 58 },
  { month: "2024-12", event_count: 8, participant_count: 96 },
];

// 이벤트 상태별 분포 더미 데이터
export const MOCK_EVENT_STATUS_DIST: EventStatusDist[] = [
  {
    status: "recruiting",
    count: 12,
    label: EVENT_STATUS_LABEL.recruiting,
  },
  {
    status: "confirmed",
    count: 8,
    label: EVENT_STATUS_LABEL.confirmed,
  },
  {
    status: "completed",
    count: 18,
    label: EVENT_STATUS_LABEL.completed,
  },
  {
    status: "cancelled",
    count: 4,
    label: EVENT_STATUS_LABEL.cancelled,
  },
];

// 최근 활동 피드 더미 데이터 (8개)
export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-001",
    type: "event_created",
    description: "김지호님이 '2025 신년 파티' 이벤트를 생성했습니다.",
    created_at: "2024-12-20T14:30:00Z",
  },
  {
    id: "act-002",
    type: "user_joined",
    description: "신은비님이 서비스에 가입했습니다.",
    created_at: "2024-12-20T11:15:00Z",
  },
  {
    id: "act-003",
    type: "event_completed",
    description: "'여름 MT' 이벤트가 완료되었습니다.",
    created_at: "2024-12-19T18:00:00Z",
  },
  {
    id: "act-004",
    type: "event_created",
    description: "최유나님이 '송년 팀 회식' 이벤트를 생성했습니다.",
    created_at: "2024-12-19T10:00:00Z",
  },
  {
    id: "act-005",
    type: "user_joined",
    description: "강준호님이 서비스에 가입했습니다.",
    created_at: "2024-12-18T16:45:00Z",
  },
  {
    id: "act-006",
    type: "event_completed",
    description: "'취소된 등산 모임' 이벤트가 취소되었습니다.",
    created_at: "2024-12-18T09:30:00Z",
  },
  {
    id: "act-007",
    type: "event_created",
    description: "박민준님이 '크리스마스 번개 모임' 이벤트를 생성했습니다.",
    created_at: "2024-12-17T13:00:00Z",
  },
  {
    id: "act-008",
    type: "user_joined",
    description: "윤아름님이 서비스에 가입했습니다.",
    created_at: "2024-12-17T08:20:00Z",
  },
];
