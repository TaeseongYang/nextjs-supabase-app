"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface JoinLoginGateProps {
  token: string;
  eventTitle: string;
  currentUserName: string | null;
}

export function JoinLoginGate({
  token,
  eventTitle,
  currentUserName,
}: JoinLoginGateProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    setIsPending(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{eventTitle}</CardTitle>
          <CardDescription>
            이 모임에 참여하려면 로그인이 필요합니다
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={`/auth/login?next=/join/${token}`}>
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/auth/sign-up?next=/join/${token}`}>
                <UserPlus className="mr-2 h-4 w-4" />
                회원가입
              </Link>
            </Button>
          </div>

          {/* 이미 다른 계정으로 로그인된 경우 */}
          {currentUserName && (
            <div className="border-t pt-4">
              <p className="mb-3 text-center text-sm text-muted-foreground">
                <span className="font-medium">{currentUserName}</span>으로
                로그인되어 있습니다
              </p>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                disabled={isPending}
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "처리 중..." : "로그아웃 후 다시 로그인"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
