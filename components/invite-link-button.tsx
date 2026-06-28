"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface InviteLinkButtonProps {
  token: string;
}

export function InviteLinkButton({ token }: InviteLinkButtonProps) {
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // window.location은 클라이언트에서만 사용 가능
  useEffect(() => {
    setInviteUrl(`${window.location.origin}/join/${token}`);
  }, [token]);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("초대 링크가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link2 className="h-4 w-4" />
        초대 링크
      </div>
      <div className="flex items-center gap-2">
        {/* URL 노출 영역 — 읽기 전용 */}
        <div className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
          <span className="block truncate">
            {inviteUrl || `...​/join/${token}`}
          </span>
        </div>
        {/* 복사 버튼 */}
        <Button
          variant="default"
          size="sm"
          className="shrink-0"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="mr-1 h-4 w-4" />
              복사
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        위 링크를 참여자에게 공유하세요. 브라우저 주소창의 URL과 다릅니다.
      </p>
    </div>
  );
}
