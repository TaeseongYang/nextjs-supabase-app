import { AdminSidebarNav } from "@/components/admin-sidebar-nav";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

// 관리자 데스크톱 레이아웃 — 좌측 고정 사이드바 + 우측 메인 영역
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* 좌측 고정 사이드바 */}
      <aside className="fixed inset-y-0 flex w-60 flex-col border-r bg-background">
        {/* 사이드바 상단 — 로고 */}
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/admin/dashboard"
            className="text-base font-bold tracking-tight"
          >
            모임 Admin
          </Link>
        </div>

        {/* 사이드바 네비게이션 */}
        <AdminSidebarNav />

        {/* 사이드바 하단 — 테마 스위처 */}
        <div className="border-t p-4">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* 우측 메인 콘텐츠 영역 — 사이드바 너비(pl-60)만큼 들여쓰기 */}
      <div className="flex flex-1 flex-col pl-60">
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-6">
          <span className="text-sm font-medium text-muted-foreground">
            관리자
          </span>
          <Suspense>
            <AuthButton />
          </Suspense>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
