"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { joinEventAction } from "@/lib/participants/participant.actions";

// 참여 응답 폼 유효성 검사 스키마 — 상태 선택만 필요
const joinResponseSchema = z.object({
  status: z.enum(["attending", "absent", "pending"]),
});

// 폼 입력값 타입
type JoinResponseValues = z.infer<typeof joinResponseSchema>;

interface JoinResponseFormProps {
  token: string;
  userName: string;
}

export function JoinResponseForm({ token, userName }: JoinResponseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinResponseValues>({
    resolver: zodResolver(joinResponseSchema),
    defaultValues: {
      status: "attending",
    },
  });

  // 폼 제출 핸들러: Server Action 호출
  function onSubmit(data: JoinResponseValues) {
    startTransition(async () => {
      const result = await joinEventAction(token, { status: data.status });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("참여 신청이 완료되었습니다");
      form.reset();
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      {/* 참여자 이름 안내 — 로그인 프로필 기반 */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{userName}</span>님으로
        참여 신청합니다
      </p>

      {/* 참여 여부 선택 (필수) — shadcn Select를 RHF Controller로 연결 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">
          참여 여부 <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="참여 여부 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attending">참석</SelectItem>
                <SelectItem value="absent">불참</SelectItem>
                <SelectItem value="pending">미정</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.status?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.status.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 — 처리 중 비활성화 */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "처리 중..." : "참여 신청"}
      </Button>
    </form>
  );
}
