# AI Agent 개발 가이드라인

## 프로젝트 개요

- **스택**: Next.js 15 App Router + React 19 + Supabase Auth + TypeScript + Tailwind CSS + shadcn/ui
- **목적**: Supabase 기반 인증 및 프로필 관리 웹 앱
- **배포 환경**: Vercel + Supabase Cloud

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
app/                        # Next.js App Router 페이지
  layout.tsx                # 루트 레이아웃 (ThemeProvider 포함)
  page.tsx                  # 공개 홈페이지
  auth/
    login/page.tsx          # 로그인 페이지
    sign-up/page.tsx        # 회원가입 페이지
    sign-up-success/page.tsx # 회원가입 완료 안내
    forgot-password/page.tsx # 비밀번호 찾기
    update-password/page.tsx # 비밀번호 변경
    error/page.tsx          # 인증 에러 페이지
    confirm/route.ts        # 이메일 확인 Route Handler
    callback/route.ts       # OAuth 콜백 Route Handler
  protected/
    layout.tsx              # 인증 필요 레이아웃 (네비게이션 포함)
    page.tsx                # 보호된 메인 페이지 (프로필 표시)

components/
  ui/                       # shadcn/ui 기본 컴포넌트 (수정 금지)
  login-form.tsx            # 로그인 폼 (Client Component)
  sign-up-form.tsx          # 회원가입 폼 (Client Component)
  google-login-button.tsx   # Google OAuth 버튼 (Client Component)
  profile-card.tsx          # 프로필 카드 (Server Component)
  auth-button.tsx           # 인증 상태 버튼
  logout-button.tsx         # 로그아웃 버튼
  forgot-password-form.tsx  # 비밀번호 찾기 폼
  update-password-form.tsx  # 비밀번호 변경 폼
  theme-switcher.tsx        # 다크/라이트 테마 전환

lib/
  supabase/
    server.ts               # 서버 컴포넌트용 Supabase 클라이언트
    client.ts               # 클라이언트 컴포넌트용 Supabase 클라이언트
    proxy.ts                # 미들웨어용 세션 갱신 함수
  profiles/
    profile.repository.ts   # DB 직접 접근 레이어
    profile.service.ts      # 비즈니스 로직 레이어
    profile.actions.ts      # Server Actions (진입점)
  database.types.ts         # Supabase 자동 생성 타입 (직접 수정 금지)
  utils.ts                  # cn() 유틸, hasEnvVars 환경 변수 체크

proxy.ts                    # Next.js 미들웨어 (루트에 위치)
```

---

## 코드 표준

### 네이밍 규칙

- **파일명**: kebab-case (`login-form.tsx`, `profile.service.ts`)
- **컴포넌트명**: PascalCase (`LoginForm`, `ProfileCard`)
- **변수/함수명**: camelCase (`handleLogin`, `createClient`)
- **클래스명**: PascalCase (`ProfileRepository`, `ProfileService`)

### TypeScript

- `any` 타입 **절대 금지** — 반드시 구체적인 타입 지정
- Props 인터페이스 명시적 정의 필수
- Supabase 타입은 반드시 `Database` 제네릭 사용: `SupabaseClient<Database>`
- `lib/database.types.ts`의 Row/Insert/Update 타입을 직접 참조: `Database["public"]["Tables"]["profiles"]["Row"]`

### import 규칙

- 상대 경로(`../`, `./`) **절대 금지**
- 반드시 `@/` 경로 별칭 사용: `import { cn } from "@/lib/utils"`
- 파일당 300줄 이하 유지

---

## 기능 구현 표준

### Server Component vs Client Component 결정

**Server Component 사용** (기본값):

- 데이터 페칭이 필요한 페이지
- Supabase 서버 클라이언트 사용 시
- `lib/supabase/server.ts`의 `createClient()` 사용

**Client Component 사용** (`"use client"` 추가):

- `useState`, `useEffect` 등 React Hook 사용 시
- 이벤트 핸들러가 있는 폼
- `useRouter`, `usePathname` 등 Next.js 클라이언트 훅 사용 시
- `lib/supabase/client.ts`의 `createClient()` 사용

### Supabase 클라이언트 사용 규칙

```typescript
// ✅ 서버 컴포넌트/Server Action에서
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // 항상 await 필요

// ✅ 클라이언트 컴포넌트에서
import { createClient } from "@/lib/supabase/client";
const supabase = createClient(); // await 불필요

// ❌ 절대 금지: 전역 변수에 클라이언트 저장
let supabase = createClient(); // 모듈 최상위에 선언 금지
```

### 사용자 인증 확인 (서버 컴포넌트)

```typescript
// ✅ 올바른 방법: getClaims() 사용
const { data: claimsData, error } = await supabase.auth.getClaims();
if (error || !claimsData?.claims) redirect("/auth/login");
const userId = claimsData.claims.sub;

// ❌ 금지: getUser() 또는 getSession() 직접 사용 (성능 비효율)
```

### 데이터 레이어 패턴 (레이어드 아키텍처)

새 도메인 추가 시 반드시 3개 파일을 동시에 생성:

```
lib/{domain}/
  {domain}.repository.ts   # Supabase 쿼리 직접 실행
  {domain}.service.ts      # 비즈니스 로직
  {domain}.actions.ts      # "use server" Server Actions (컴포넌트 진입점)
```

**Repository 패턴**:

```typescript
export class XxxRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}
  // Supabase 쿼리만 포함, 비즈니스 로직 금지
}
```

**Service 패턴**:

```typescript
export class XxxService {
  constructor(private readonly xxxRepository: XxxRepository) {}
  // Repository 호출 + 비즈니스 로직만 포함
}
```

**Actions 패턴**:

```typescript
"use server";
// createClient() → Repository 인스턴스 생성 → Service 인스턴스 생성
// 반환 타입: { data: T | null; error: string | null }
```

---

## 인증 흐름

### 이메일/비밀번호 로그인

```
LoginForm (Client) → supabase.auth.signInWithPassword() → router.push("/protected")
```

### Google OAuth 로그인

```
GoogleLoginButton → supabase.auth.signInWithOAuth({ provider: "google", redirectTo: "/auth/callback" })
→ app/auth/callback/route.ts → supabase.auth.exchangeCodeForSession(code) → redirect("/protected")
```

### 세션 미들웨어

```
모든 요청 → proxy.ts (미들웨어) → lib/supabase/proxy.ts의 updateSession()
→ 미인증 사용자가 publicPaths(["/", "/auth", "/join"]) 외 경로 접근 시 → /auth/login 리디렉션
```

### 보호된 라우트 추가

두 가지 방식 중 선택:

**방식 A: Route Group (권장)** — URL에 영향 없이 레이아웃 분리

- `app/(organizer)/` 하위에 생성 (주최자 영역, 인증 필요)
- 각 `page.tsx`에서 `getClaims()`로 직접 인증 확인 후 미인증 시 `redirect("/auth/login")`
- 미들웨어 `publicPaths`에 포함되지 않은 경로는 자동으로 인증 강제

**방식 B: /protected/ 하위** — 기존 패턴

- `app/protected/{route}/page.tsx`에 생성
- 미들웨어가 자동으로 인증을 강제함
- 페이지 내에서 추가 인증 확인 시 `getClaims()` 사용

**비회원 공개 라우트 추가 시:**

- `app/(guest)/` 하위에 생성
- `lib/supabase/proxy.ts`의 `publicPaths` 배열에 경로 추가 불필요 (`/join/*`은 이미 포함)

---

## 파일 동시 수정 규칙

| 작업                    | 반드시 함께 수정할 파일                                              |
| ----------------------- | -------------------------------------------------------------------- |
| DB 스키마 변경          | `lib/database.types.ts` 재생성 (`npx supabase gen types typescript`) |
| 새 도메인 추가          | `lib/{domain}/repository.ts` + `service.ts` + `actions.ts` 동시 생성 |
| 새 보호 라우트 추가     | `app/protected/{route}/page.tsx` (미들웨어 자동 적용)                |
| shadcn/ui 컴포넌트 추가 | `components/ui/` 하위에 추가, `components.json` 자동 업데이트        |
| 환경 변수 추가          | `.env.local` + `CLAUDE.md` 환경 변수 섹션 동시 업데이트              |

---

## UI 컴포넌트 사용 표준

### shadcn/ui 컴포넌트

- `components/ui/` 디렉토리의 파일 **직접 수정 금지**
- 새 컴포넌트 추가: `npx shadcn@latest add {component}` 명령 사용
- 현재 설치된 컴포넌트: `badge`, `button`, `card`, `checkbox`, `dropdown-menu`, `input`, `label`

### Tailwind CSS

- 인라인 스타일(`style={}`) 사용 금지
- 모든 스타일은 Tailwind 클래스 사용
- `cn()` 유틸 사용 (조건부 클래스 병합): `import { cn } from "@/lib/utils"`

### 테마

- 다크/라이트 모드 지원 필수: `text-foreground`, `bg-background`, `text-muted-foreground` 등 CSS 변수 사용
- 하드코딩된 색상(`text-gray-500`) 대신 테마 변수 사용

---

## Next.js 15 필수 사항

- **params/searchParams는 비동기**: 반드시 `const { id } = await params` 패턴 사용
- **Pages Router 완전 금지**: `getServerSideProps`, `getStaticProps`, `getStaticPaths` 사용 금지
- **Route Handler**: `app/api/` 또는 `app/{path}/route.ts` 형태로 생성

---

## 금지 사항

- `any` 타입 사용
- 상대 경로 import (`../`, `./`)
- Pages Router API (`getServerSideProps` 등)
- Supabase 클라이언트 전역 변수 저장
- `components/ui/` 파일 직접 수정
- `lib/database.types.ts` 직접 수정 (자동 생성 파일)
- 인라인 스타일 (`style={}`)
- 하드코딩된 색상 클래스 (테마 미지원)
- `getUser()` 또는 `getSession()` 서버 사이드 사용 (→ `getClaims()` 사용)
- 파일당 300줄 초과
- 비즈니스 로직을 Repository 레이어에 작성
- DB 쿼리를 Service 레이어에 직접 작성

---

## AI 의사결정 기준

### 컴포넌트 위치 결정

```
상태/이벤트/훅 필요?
├── YES → "use client" 추가, components/{name}.tsx
└── NO → Server Component, components/{name}.tsx
         데이터 페칭 포함 시 async 함수로 작성
```

### 새 기능 추가 결정

```
DB 데이터 필요?
├── YES → lib/{domain}/ 3파일 생성 → Server Action 통해 접근
└── NO → 컴포넌트에서 직접 처리

인증 필요?
├── YES → app/protected/ 하위 배치 (미들웨어 자동 적용)
└── NO → app/ 루트 또는 app/auth/ 하위 배치
```

### 에러 처리 기준

- Repository: Supabase 에러를 `throw new Error()` 로 변환
- Service: Repository 예외를 그대로 전파
- Actions: try/catch로 캐치 후 `{ data: null, error: string }` 반환
- Component: `error` 상태로 UI에 표시
