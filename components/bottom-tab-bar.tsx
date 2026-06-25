"use client";

// 모바일 하단 고정 탭바 — 주최자 영역의 주요 화면으로 이동하는 네비게이션
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, PlusCircle, User } from "lucide-react";

import { cn } from "@/lib/utils";

// 탭 항목 타입 정의
interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 하단 탭바 구성 항목
const TAB_ITEMS: TabItem[] = [
  { label: "홈", href: "/dashboard", icon: Home },
  { label: "이벤트", href: "/events", icon: CalendarDays },
  { label: "새 이벤트", href: "/events/new", icon: PlusCircle },
  { label: "프로필", href: "/protected", icon: User },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <nav className="w-full max-w-sm border-t bg-background">
        <div className="flex items-center justify-around px-2 pb-2 pt-1">
          {TAB_ITEMS.map(({ label, href, icon: Icon }) => {
            // 현재 경로와 탭 href가 일치하면 활성 상태로 처리
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
