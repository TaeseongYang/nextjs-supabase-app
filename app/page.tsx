import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarDays,
  Car,
  Receipt,
  Share2,
  LayoutDashboard,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (claimsData?.claims) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
          <span className="font-semibold">모임</span>
          <ThemeSwitcher />
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-5xl flex-col items-center gap-16 p-5 py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-5xl font-bold tracking-tight">모임</h1>
            <p className="max-w-xl text-xl text-muted-foreground">
              초대 링크 하나로 모임을 통합 관리하세요
            </p>
            <p className="max-w-xl text-muted-foreground">
              일정 · 참여자 · 카풀 · 정산을 한 곳에서 손쉽게 관리하고,
              <br />
              초대 링크만으로 누구나 참여할 수 있습니다.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">시작하기</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">로그인</Link>
              </Button>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">이벤트 관리</h3>
              <p className="text-sm text-muted-foreground">
                일정·장소·인원을 한 곳에서 관리하고 참여자 현황을 실시간으로
                확인하세요.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">카풀 조율</h3>
              <p className="text-sm text-muted-foreground">
                드라이버 등록과 동승 신청을 자동으로 매칭하여 카풀을 쉽게
                조율하세요.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">정산 트래킹</h3>
              <p className="text-sm text-muted-foreground">
                1/n 또는 개별 분담으로 정산하고 입금 여부를 한눈에 확인하세요.
              </p>
            </div>
          </div>
          {/* 사용 흐름 섹션 */}
          <div className="flex w-full flex-col gap-8">
            <h2 className="text-center text-2xl font-bold">
              이렇게 사용하세요
            </h2>
            <div className="flex flex-col gap-6">
              {/* 스텝 1: 이벤트 생성 */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <CalendarDays className="h-4 w-4" />
                    이벤트 생성
                  </div>
                  <p className="text-sm text-muted-foreground">
                    날짜, 장소, 인원을 설정하고 이벤트를 만드세요.
                  </p>
                </div>
              </div>

              {/* 스텝 2: 초대 링크 공유 */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Share2 className="h-4 w-4" />
                    초대 링크 공유
                  </div>
                  <p className="text-sm text-muted-foreground">
                    카카오톡으로 링크를 보내면 누구나 바로 참여할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 스텝 3: 통합 관리 */}
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <LayoutDashboard className="h-4 w-4" />
                    통합 관리
                  </div>
                  <p className="text-sm text-muted-foreground">
                    참여 현황, 카풀, 정산을 한 화면에서 확인하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex w-full items-center justify-center border-t py-6 text-xs text-muted-foreground">
        <p>© 2026 모임. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}
