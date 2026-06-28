import type { Database } from "@/lib/database.types";
import type { EventStatus } from "@/lib/types/enums";

/**
 * 관리자 목록 조회 파라미터
 * 페이지네이션, 정렬, 검색, 필터를 지원한다.
 */
export interface AdminListParams {
  /** 현재 페이지 번호 (1-based) */
  page: number;
  /** 페이지당 항목 수 (기본값 10) */
  pageSize: number;
  /** 정렬 기준 컬럼 */
  sort?: string;
  /** 정렬 방향 */
  order?: "asc" | "desc";
  /** 검색 키워드 */
  search?: string;
  /** 이벤트 상태 필터 */
  status?: EventStatus | "all";
}

/**
 * 이벤트 목록 Row 타입
 * DB Row에 참여자 통계 정보를 추가한다.
 */
export type AdminEventRow = Database["public"]["Tables"]["events"]["Row"] & {
  /** 전체 참여자 수 */
  participant_count: number;
  /** 참석 확정 참여자 수 */
  attending_count: number;
};

/**
 * 사용자 관리 Row 타입
 * profiles 테이블 기반으로 관리자 화면에 필요한 필드를 정의한다.
 */
export interface AdminUserRow {
  /** 사용자 고유 ID (auth.users.id와 동일) */
  id: string;
  /** 이메일 주소 */
  email: string;
  /** 사용자 표시 이름 */
  full_name: string | null;
  /** 가입 일시 (ISO 8601) */
  created_at: string;
  /** 관리자 여부 */
  is_admin: boolean;
  /** 생성한 이벤트 수 */
  event_count: number;
}

/**
 * 관리자 대시보드 요약 통계
 */
export interface AdminDashboardStats {
  /** 전체 이벤트 수 */
  total_events: number;
  /** 전체 사용자 수 */
  total_users: number;
  /** 이번 달 신규 이벤트 수 */
  new_events_this_month: number;
  /** 평균 참여율 (0-100) */
  avg_participation_rate: number;
}

/**
 * 월별 통계 Row 타입
 */
export interface MonthlyStatsRow {
  /** 연월 (YYYY-MM 형식) */
  month: string;
  /** 해당 월 이벤트 수 */
  event_count: number;
  /** 해당 월 참여자 수 */
  participant_count: number;
}

/**
 * 이벤트 상태별 분포 Row 타입
 */
export interface EventStatusDistRow {
  /** 이벤트 상태 */
  status: EventStatus;
  /** 해당 상태 이벤트 수 */
  count: number;
  /** 상태 표시 레이블 (한국어) */
  label: string;
}

/**
 * 최근 활동 피드 아이템 타입
 */
export interface ActivityFeedItem {
  /** 활동 고유 ID */
  id: string;
  /** 활동 유형 */
  type: "event_created" | "user_joined" | "event_completed";
  /** 활동 설명 텍스트 */
  description: string;
  /** 활동 발생 일시 (ISO 8601) */
  created_at: string;
}

/**
 * 페이지네이션 결과 제네릭 타입
 * 목록 조회 결과를 감싸는 래퍼로 사용한다.
 */
export interface PaginatedResult<T> {
  /** 조회된 데이터 배열 */
  data: T[];
  /** 전체 항목 수 */
  total: number;
  /** 현재 페이지 번호 (1-based) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
}

/**
 * 통계 분석 페이지 데이터 타입
 */
export interface AdminAnalyticsData {
  /** 월별 통계 목록 */
  monthly: MonthlyStatsRow[];
  /** 이벤트 상태별 분포 */
  statusDist: EventStatusDistRow[];
  /** 전체 참여자 수 */
  totalParticipants: number;
}
