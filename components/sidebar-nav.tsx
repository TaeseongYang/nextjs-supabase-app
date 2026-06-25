"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard, ready: true },
  { label: "이벤트 관리", href: "/events", icon: CalendarDays, ready: false },
  { label: "사용자 관리", href: "/users", icon: Users, ready: false },
  { label: "통계 분석", href: "/stats", icon: BarChart3, ready: false },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map(({ label, href, icon: Icon, ready }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");

        if (!ready) {
          return (
            <div
              key={href}
              className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/50"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </div>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal">
                준비 중
              </span>
            </div>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
