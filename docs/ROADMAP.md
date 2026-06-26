# 모임 이벤트 관리 웹 MVP 개발 로드맵

흩어진 모임 운영(일정 · 참여자 · 카풀 · 정산)을 초대 링크 하나로 통합 관리하는 웹 서비스.

## 개요

모임 이벤트 관리 웹은 수영 · 헬스 · 친구 모임을 운영하는 20~30대 주최자를 위한 **초대 링크 기반 통합 모임 관리 도구**로 다음 기능을 제공합니다:

- **이벤트 통합 관리**: 일정 · 장소 · 인원 · 상태(모집/확정/완료/취소)를 한 곳에서 CRUD
- **비회원 참여 플로우**: 초대 링크 하나로 비회원 참여자가 이름 + 연락처만 입력해 즉시 참여, 정원 초과 시 자동 대기자 전환
- **카풀 · 정산 조율**: 드라이버/동승 매칭과 1/n · 개별 분담 정산 트래킹, 카카오톡 공유용 OG 미리보기 제공

대상 사용자

- **주최자(Organizer)**: 이메일/소셜 로그인 후 이벤트 CRUD, 참여자/카풀/정산 관리
- **참여자(Participant)**: 회원가입 없이 초대 링크로 접근해 참여 응답, 카풀 신청, 정산 확인

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림
- **Playwright MCP 테스트 수행 절차 (API/비즈니스 로직 Task 한정)**:
  1. 개발 서버가 실행 중인지 확인 후 `mcp__playwright__browser_navigate`로 앱 접속
  2. 구현한 기능의 핵심 Happy Path 시나리오 테스트 (정상 동작 확인)
  3. 에러 시나리오 테스트 (잘못된 입력, 권한 없음, 네트워크 오류 등)
  4. `mcp__playwright__browser_console_messages`로 콘솔 에러 없음 확인
  5. `mcp__playwright__browser_network_requests`로 API 응답 코드 및 데이터 구조 검증
  6. 테스트 결과(통과/실패 여부, 발견된 문제)를 작업 파일 "## 테스트 체크리스트"에 기록
  7. **테스트 실패 시**: 즉시 수정 후 재테스트 — 통과할 때까지 다음 단계 진행 불가

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 구조 및 라우팅 설정** - 우선순위
  - Next.js App Router 기반 전체 라우트 구조 생성 (`/`, `/auth/*`, `/dashboard`, `/events/new`, `/events/[id]`, `/events/[id]/edit`, `/join/[token]`, `/join/[token]/carpooling`, `/join/[token]/settlement`)
  - 모든 주요 페이지의 빈 껍데기(`page.tsx`) 파일 생성
  - 주최자 영역(`/dashboard`, `/events/*`)과 비회원 참여 영역(`/join/*`) 분리 레이아웃 골격 구현
  - 스타터킷 잔여 튜토리얼/데모 코드 정리 (`components/tutorial/*`, `hero.tsx`, `next-logo.tsx` 등)

- **Task 002: 타입 정의 및 인터페이스 설계**
  - 8개 도메인 엔티티 TypeScript 인터페이스 정의 (users, events, participants, announcements, carpools, carpool_requests, settlement_items, settlement_details)
  - Enum 타입 정의 (이벤트 상태 `recruiting/confirmed/completed/cancelled`, 참여 상태 `attending/absent/pending/waitlisted`, 카풀 신청 상태 `pending/confirmed/rejected`, 분담 방식 `equal/custom`)
  - API 요청/응답 DTO 타입 및 공통 응답 형식 정의
  - 더미 데이터용 mock 객체 생성 (DB 스키마 설계 및 Supabase 설정은 UI 검토 후 Phase 3에서 진행)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 라이브러리 및 디자인 시스템 구현** ✅ - 완료
  - See: `/tasks/003-component-library.md`
  - ✅ shadcn/ui 기반 추가 컴포넌트 9개 설치 (tabs, dialog, select, table, textarea, sonner, avatar, skeleton, separator)
  - ✅ 도메인 상태 배지 컴포넌트 구현 (EventStatusBadge, ParticipantStatusBadge)
  - ✅ 빈 상태(EmptyState), 로딩 스켈레톤(LoadingSkeleton) 등 공통 컴포넌트 구현
  - ✅ PageHeader 공통 컴포넌트 및 `components/index.ts` 인덱스 정리
  - ✅ 더미 데이터 생성 유틸리티 작성 (`lib/mock/*` — 이벤트/참여자/카풀/정산 샘플 데이터)

- **Task 004: 주최자 영역 페이지 UI 완성** ✅ - 완료
  - See: `/tasks/004-page-ui.md`
  - ✅ 랜딩 페이지(`/`) — 서비스 소개 + 회원가입/로그인 CTA
  - ✅ 주최자 대시보드(`/dashboard`) — 내 이벤트 목록 카드 + 상태 필터 UI (더미 데이터)
  - ✅ 이벤트 생성/수정 페이지 폼 UI (`/events/new`, `/events/[id]/edit`) — React Hook Form + Zod 스키마 골격
  - ✅ 이벤트 상세 페이지(`/events/[id]`) — 공지/참여자/카풀/정산 4개 탭 레이아웃 + 초대 링크 공유 UI

- **Task 005: 참여자(비회원) 영역 페이지 UI 완성** ✅ - 완료
  - See: `/tasks/005-guest-ui.md`
  - ✅ 참여자 진입 페이지(`/join/[token]`) — 공지 표시 + 참여 응답 폼 + 참여자 현황 UI
  - ✅ 카풀 신청 페이지(`/join/[token]/carpooling`) — 드라이버 등록/동승 신청/카풀 현황 테이블 UI
  - ✅ 정산 내역 페이지(`/join/[token]/settlement`) — 비용 항목/분담 내역/입금 상태 요약 UI
  - ✅ 전 페이지 모바일 반응형 검증 및 비회원 진입 플로우(링크 → 참여 → 카풀/정산) 네비게이션 완성

- **Task 006-admin: 관리자 데스크톱 페이지 UI 완성** ✅ - 완료
  - See: `/tasks/006-admin-ui.md`
  - ✅ recharts 패키지 설치
  - ✅ 관리자 전용 Mock 데이터 작성 (`lib/mock/admin.mock.ts` — AdminUser, AdminStats, MonthlyStats, EventStatusDist, ActivityFeedItem)
  - ✅ `app/admin/` 라우트 구조 구현 (route group 아님, /admin/\* URL 유지)
  - ✅ 관리자 데스크톱 레이아웃 구현 (`app/admin/layout.tsx` — w-60 고정 사이드바 + 메인 영역)
  - ✅ 관리자 사이드바 네비게이션 구현 (`components/admin-sidebar-nav.tsx` — usePathname 활성 상태)
  - ✅ 관리자 로그인 페이지 UI 구현 (`/admin/login` — Supabase 인증 연결, 성공 시 /admin/dashboard 이동)
  - ✅ `/admin` 접근 시 `/admin/login`으로 자동 리디렉션 (`app/admin/page.tsx`)
  - ✅ 관리자 대시보드 메인 페이지 UI 구현 (`/admin/dashboard` — 핵심 지표 카드 4개 + 최근 활동 피드 + 이벤트 상태 분포)
  - ✅ 이벤트 관리 테이블 페이지 UI 구현 (`/admin/events` — 제목 검색 + 상태 필터 + shadcn/ui Table)
  - ✅ 사용자 관리 테이블 페이지 UI 구현 (`/admin/users` — 이름/이메일 검색 + 이벤트 수 Badge)
  - ✅ 통계 분석 페이지 UI 구현 (`/admin/analytics` — 월별 AreaChart + 상태 분포 PieChart + 참여자 BarChart)
  - ✅ 미들웨어 publicPaths에 `/admin/login` 추가 (`lib/supabase/proxy.ts`)

> **⛳ UI 검토 게이트 (Phase 2 → Phase 3 진입 전 필수)**
> Phase 2 완료 후 전체 UI/UX를 실제로 사용해보며 보완점을 확인한다.
> 화면 구성 · 사용자 플로우 · 모바일 레이아웃 이슈를 이 단계에서 모두 수정한 뒤
> DB 스키마를 최종 확정하고 Phase 3(Supabase 연동)으로 진행한다.

### Phase 3: 핵심 기능 구현

- **Task 006: 데이터베이스 구축 및 RLS 정책 설정** - 우선순위
  - UI 검토 완료 및 스키마 최종 확정 후 Supabase에 8개 테이블 마이그레이션 적용 (FK 관계, `invite_token` UNIQUE 제약 포함)
  - Row Level Security 정책 설정 (주최자는 본인 이벤트만 / 비회원은 유효한 토큰으로만 접근)
  - `lib/database.types.ts` 타입 재생성 및 더미 데이터 → 실제 쿼리 연결 준비
  - 시드 데이터 작성 및 로컬/원격 스키마 검증

- **Task 007: 주최자 인증 시스템 구현 (F010)**
  - Supabase Auth 이메일 회원가입/로그인/로그아웃 연동 (기존 폼 컴포넌트 활용)
  - 소셜(Google) 로그인 연동 및 콜백 처리(`/auth/callback`)
  - 미들웨어 기반 `/dashboard`, `/events/*` 보호 라우트 및 세션 갱신 처리
  - **[테스트 필수 - 완료 조건]** Playwright MCP로 인증 플로우 E2E 테스트 수행:
    - [ ] 회원가입 → 이메일 확인 → 로그인 플로우 정상 동작 확인 (응답 200/302)
    - [ ] 로그아웃 후 보호 페이지 접근 시 `/auth/login` 리다이렉션 확인
    - [ ] 잘못된 자격증명 입력 시 에러 메시지 노출 확인 (401)
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 008: 이벤트 CRUD 및 초대 링크 API 구현 (F001, F002, F011)**
  - 이벤트 생성/조회/수정/삭제 및 상태 전환(모집→확정→완료/취소) API 구현
  - 고유 토큰 기반 초대 링크 생성 및 토큰 검증 로직, 대시보드 목록/상태 필터 연동
  - 카카오톡 공유용 OG 메타 태그(`generateMetadata`) 적용 (`/join/[token]`)
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 API 통합 테스트:
    - [ ] 이벤트 생성/수정/삭제 정상 동작 확인 (POST 201, PUT 200, DELETE 200)
    - [ ] 본인 소유 아닌 이벤트 수정/삭제 시 권한 차단 확인 (403)
    - [ ] 잘못된 입력(필수값 누락, 과거 날짜 등) 검증 에러 확인 (400)
    - [ ] 존재하지 않는 토큰 접근 시 404 처리 확인
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 009: 참여자 등록 및 현황 관리 API 구현 (F003, F004)**
  - 비회원 참여 등록 API (이름 필수 + 연락처 선택), 참여 상태(참석/불참/미정) 응답 처리
  - 최대 인원 초과 시 대기자(waitlisted) 자동 전환 및 결원 발생 시 승격 로직
  - 주최자용 참여자 목록/인원 현황 집계 API 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 API 통합 테스트:
    - [ ] 정상 참여 등록 및 현황 반영 확인 (POST 201)
    - [ ] 정원 초과 시 대기자 자동 전환 확인 (status=waitlisted)
    - [ ] 이름 미입력 등 유효성 위반 시 에러 확인 (400)
    - [ ] 잘못된/만료된 토큰 접근 차단 확인 (404)
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 010: 공지 · 카풀 · 정산 API 구현 (F005, F006, F007)**
  - 공지사항 작성/수정 및 상단 고정(is_pinned) API (F005)
  - 카풀 드라이버 등록 / 동승 신청 / 주최자 확정·거절 및 현황 테이블 API (F006)
  - 정산 항목 추가, 1/n·개별 분담 계산, 입금 체크 및 정산 요약 API (F007)
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 API 통합 테스트:
    - [ ] 공지 작성/수정/고정 정상 동작 확인 (POST/PUT 200·201)
    - [ ] 카풀 등록/신청/확정 플로우 및 정원 초과 신청 차단 확인
    - [ ] 정산 1/n·개별 분담 금액 계산 정확성 및 입금 체크 반영 확인
    - [ ] 비회원/권한 없는 요청 차단 확인 (403/404)
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 010-1: 핵심 기능 통합 테스트**
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 사용한 전체 사용자 플로우 테스트:
    - [ ] 주최자 가입 → 로그인 → 이벤트 생성 → 초대 링크 공유 전체 플로우
    - [ ] 비회원 참여자: 링크 진입 → 참여 응답 → 카풀 신청 → 정산 확인 전체 플로우
    - [ ] 주최자: 참여 현황·카풀 확정·정산 입금 체크 관리 플로우 검증
    - [ ] 에러 핸들링 및 엣지 케이스 (정원 초과, 중복 신청, 만료 토큰, 빈 데이터) 테스트
    - [ ] 모바일/반응형 환경에서 주최자·참여자 주요 플로우 동작 확인

### Phase 4: 고급 기능 및 최적화

- **Task 010-2: Tailwind CSS v4 업그레이드** ✅ - 완료
  - ✅ tailwindcss v3.4.1 → v4.3.1 업그레이드 및 `@tailwindcss/postcss` 4.3.1 설치
  - ✅ `tw-animate-css` 1.4.0 도입으로 `tailwindcss-animate` 대체, autoprefixer 제거 (v4 내장)
  - ✅ `postcss.config.mjs`를 `@tailwindcss/postcss` 플러그인 방식으로 전환
  - ✅ `app/globals.css` CSS-first 방식 전환 (`@import "tailwindcss"`, `@theme inline`, `@custom-variant dark`)
  - ✅ `tailwind.config.ts` 삭제 (v4에서 불필요) 및 `.prettierrc` `tailwindConfig` → `tailwindStylesheet` 변경
  - ✅ 빌드 · 타입체크 · 린트 전체 통과 검증

- **Task 011: 사용자 경험 향상 및 부가 기능**
  - 카카오톡 공유 미리보기 최적화 및 동적 OG 이미지 생성
  - 참여/카풀/정산 변경에 대한 실시간 반영(Supabase Realtime) 적용 검토
  - 토스트 알림, 로딩/에러 바운더리, 빈 상태 UX 보강 및 접근성 개선

- **Task 012: 성능 최적화 및 배포**
  - 서버 컴포넌트 캐싱/재검증 전략 및 쿼리 최적화
  - Supabase advisors 기반 보안/성능 점검 및 RLS 정책 최종 검수
  - Vercel 배포, 환경 변수 구성, 모니터링·로깅 및 CI 파이프라인 구축
