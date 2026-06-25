"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 참여 응답 폼 유효성 검사 스키마
const joinResponseSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
  phone: z.string().optional(),
  status: z.enum(["attending", "absent", "pending"]),
});

// 폼 입력값 타입
type JoinResponseValues = z.infer<typeof joinResponseSchema>;

export function JoinResponseForm() {
  const form = useForm<JoinResponseValues>({
    resolver: zodResolver(joinResponseSchema),
    defaultValues: {
      name: "",
      phone: "",
      status: "attending",
    },
  });

  // 폼 제출 핸들러: 유효성 검사 통과 후 데이터 처리
  function onSubmit(data: JoinResponseValues) {
    console.log("참여 응답:", data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      {/* 이름 필드 (필수) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="이름을 입력하세요"
          {...form.register("name")}
        />
        {form.formState.errors.name?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* 연락처 필드 (선택) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          placeholder="010-0000-0000"
          {...form.register("phone")}
        />
      </div>

      {/* 참여 여부 필드 (필수) — shadcn Select를 RHF Controller로 연결 */}
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

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full">
        참여 응답 제출
      </Button>
    </form>
  );
}
