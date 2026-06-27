import Link from "next/link";
import { KeyRound, ChevronRight, Info } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export function ProfileAccountSection() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        계정 설정
      </h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
          <Link
            href="/auth/update-password"
            className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">비밀번호 변경</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3 px-4 py-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              앱 버전 0.1.0 · 모임
            </span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
