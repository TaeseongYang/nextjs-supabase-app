"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 이벤트 폼 유효성 검사 스키마
// max_participants는 HTML input에서 항상 string으로 들어오므로 string 타입으로 받은 뒤
// refine으로 숫자 유효성을 검사한다 (transform 분리로 zodResolver 타입 충돌 방지)
const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력하세요")
    .max(100, "제목은 100자 이하입니다"),
  description: z.string().optional(),
  location: z.string().min(1, "장소를 입력하세요"),
  event_date: z.string().min(1, "날짜를 선택하세요"),
  max_participants: z
    .string()
    .optional()
    .refine(
      (val) => {
        // 빈 문자열 또는 undefined는 허용 (선택 필드)
        if (val === "" || val === undefined) return true;
        const parsed = Number(val);
        // 정수이고 1 이상인지 검사
        return !isNaN(parsed) && Number.isInteger(parsed) && parsed >= 1;
      },
      { message: "1 이상의 숫자를 입력하세요" },
    ),
});

// 폼 입력값 타입 (RHF에서 관리하는 상태 타입)
type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<EventFormValues>;
}

export function EventForm({ mode, defaultValues }: EventFormProps) {
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: "",
      max_participants: "",
      ...defaultValues,
    },
  });

  // 폼 제출 핸들러: 검증 통과 후 데이터 처리
  function onSubmit(data: EventFormValues) {
    // max_participants를 숫자로 변환하여 최종 payload 구성
    const payload = {
      ...data,
      max_participants:
        data.max_participants === "" || data.max_participants === undefined
          ? undefined
          : Number(data.max_participants),
    };
    console.log("폼 제출:", payload);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 폼 제목 */}
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "이벤트 만들기" : "이벤트 수정"}
      </h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* 제목 필드 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">
            제목 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="이벤트 제목을 입력하세요"
            {...form.register("title")}
          />
          {form.formState.errors.title?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* 설명 필드 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            placeholder="이벤트에 대한 설명을 입력하세요"
            {...form.register("description")}
          />
          {form.formState.errors.description?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* 날짜/시간 필드 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="event_date">
            날짜/시간 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="event_date"
            type="datetime-local"
            {...form.register("event_date")}
          />
          {form.formState.errors.event_date?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.event_date.message}
            </p>
          )}
        </div>

        {/* 장소 필드 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">
            장소 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            placeholder="이벤트 장소를 입력하세요"
            {...form.register("location")}
          />
          {form.formState.errors.location?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>

        {/* 최대 인원 필드 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="max_participants">최대 인원</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            placeholder="제한 없음"
            {...form.register("max_participants")}
          />
          {form.formState.errors.max_participants?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.max_participants.message}
            </p>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
