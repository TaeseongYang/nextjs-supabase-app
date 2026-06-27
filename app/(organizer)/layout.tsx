import { AuthButton } from "@/components/auth-button";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");
  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex-1">
        {/* 모바일 너비 제한 컨테이너 */}
        <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col bg-background shadow-xl">
          {/* 상단 헤더 — 로고 + 인증 버튼 + 테마 스위처 */}
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
            <Link href="/" className="text-base font-bold tracking-tight">
              모임
            </Link>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </header>

          {/* 메인 콘텐츠 — 하단 탭바 높이(pb-16)만큼 패딩 확보 */}
          <main className="flex-1 p-4 pb-16">{children}</main>

          {/* 하단 고정 탭바 */}
          <BottomTabBar />
        </div>
      </div>
    </div>
  );
}
