"use client";

import { cn } from "@/lib/utils";
import { BarChart3, CalendarDays, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 사이드바 네비게이션 항목 정의
const NAV_ITEMS = [
  {
    label: "대시보드",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "이벤트 관리",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "사용자 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "통계 분석",
    href: "/admin/analytics",
    icon: BarChart3,
  },
] as const;

// 관리자 사이드바 네비게이션 컴포넌트 — 활성 경로 강조 표시
export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          // 현재 경로가 해당 항목의 href로 시작하면 활성 상태
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
