"use client";

import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteLinkButtonProps {
  token: string;
}

export function InviteLinkButton({ token }: InviteLinkButtonProps) {
  // 초대 링크를 클립보드에 복사하는 핸들러
  const handleCopy = async () => {
    const inviteUrl = `${window.location.origin}/join/${token}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast("초대 링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy}>
      <Link2 />
      초대 링크 복사
    </Button>
  );
}
