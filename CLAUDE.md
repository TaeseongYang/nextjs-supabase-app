# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev       # 개발 서버 시작 (localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 시작
npm run lint      # ESLint 검사
```

## 환경 변수 설정

`.env.local` 파일에 다음 변수를 설정해야 한다:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

`lib/utils.ts`의 `hasEnvVars`로 환경 변수 설정 여부를 확인한다. 미설정 시 앱은 동작하지만 일부 기능이 비활성화된다.

## 아키텍처 개요

**Next.js 15 App Router** + **Supabase Auth** 기반 스타터킷이다.

### 라우트 구조

- `/` — 공개 홈페이지
- `/auth/*` — 인증 관련 (login, sign-up, forgot-password, update-password, confirm, error)
- `/protected/*` — 인증 필요 영역 (`app/protected/layout.tsx`에서 네비게이션 포함)

### 인증 흐름

`proxy.ts` (Next.js 미들웨어) → `lib/supabase/proxy.ts`의 `updateSession()` 호출 → 세션 쿠키 갱신 및 미인증 사용자 `/auth/login` 리디렉션.

- **서버 컴포넌트**: `lib/supabase/server.ts`의 `createClient()` (요청마다 새 인스턴스 생성 필수)
- **클라이언트 컴포넌트**: `lib/supabase/client.ts`의 `createClient()`

### Database 타입

`lib/database.types.ts`에 Supabase 생성 타입이 있다. 스키마 변경 시 `npx supabase gen types typescript` 로 재생성.

### 컴포넌트 구조

- `components/ui/` — shadcn/ui 기반 기본 UI 컴포넌트
- `components/` — 인증 폼, 네비게이션 등 비즈니스 컴포넌트

## 핵심 개발 규칙

### Next.js 15 필수 사항

- **params/searchParams는 비동기**: `const { id } = await params` 패턴 사용
- **Server Components 우선**: `'use client'`는 상태/이벤트 핸들러가 필요한 경우에만
- Pages Router 사용 금지 (`getServerSideProps`, `getStaticProps` 등)

### Supabase 클라이언트

서버 컴포넌트에서 `createClient()`를 전역 변수에 저장하지 말 것 (Fluid compute 호환성).

### TypeScript

- `any` 타입 사용 금지
- Props 인터페이스 명시적 정의
- Supabase 타입은 `Database` 제네릭으로 전달

### 컴포넌트

- 파일명: kebab-case (`login-form.tsx`)
- 컴포넌트명: PascalCase (`LoginForm`)
- import는 `@/` 경로 별칭 사용 (상대 경로 금지)
- 파일당 300줄 이하 유지

## 기술 스택 요약

| 항목       | 버전/도구                      |
| ---------- | ------------------------------ |
| 프레임워크 | Next.js 15, React 19           |
| 인증/DB    | Supabase (`@supabase/ssr`)     |
| UI         | shadcn/ui + Radix UI           |
| 스타일     | Tailwind CSS 3                 |
| 테마       | next-themes                    |
| 아이콘     | lucide-react                   |
| 유틸리티   | clsx + tailwind-merge (`cn()`) |
