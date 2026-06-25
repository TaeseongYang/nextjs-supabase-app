import { AuthButton } from "@/components/auth-button";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* 사이드바 — 1024px 미만에서 숨김 */}
      <aside className="fixed inset-y-0 hidden flex-col border-r bg-background lg:flex lg:w-60">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            모임
          </Link>
        </div>
        <SidebarNav />
        <div className="flex items-center justify-center border-t p-4">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* 사이드바 너비만큼 오프셋 */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* 모바일 너비 제한 컨테이너 */}
        <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col bg-background shadow-xl">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
            <Link href="/" className="text-base font-bold tracking-tight">
              모임
            </Link>
            <div className="flex items-center gap-2">
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </header>
          <main className="flex-1 p-4">{children}</main>
          <footer className="flex items-center justify-center border-t py-4 lg:hidden">
            <ThemeSwitcher />
          </footer>
        </div>
      </div>
    </div>
  );
}
