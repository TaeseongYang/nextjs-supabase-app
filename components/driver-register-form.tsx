"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 드라이버 등록 폼 유효성 검사 스키마
// max_passengers는 HTML input에서 string으로 들어오므로 string 타입으로 받은 뒤
// refine으로 정수 유효성을 검사한다 (event-form.tsx 패턴과 동일)
const driverRegisterSchema = z.object({
  departure_location: z.string().min(1, "출발지를 입력하세요"),
  departure_time: z.string().min(1, "출발 시간을 선택하세요"),
  max_passengers: z
    .string()
    .min(1, "1명 이상 입력하세요")
    .refine(
      (val) => {
        const parsed = Number(val);
        return !isNaN(parsed) && Number.isInteger(parsed) && parsed >= 1;
      },
      { message: "1명 이상 입력하세요" },
    ),
});

// 폼 입력값 타입 (RHF에서 관리하는 상태 타입)
type DriverRegisterValues = z.infer<typeof driverRegisterSchema>;

export function DriverRegisterForm() {
  const form = useForm<DriverRegisterValues>({
    resolver: zodResolver(driverRegisterSchema),
    defaultValues: {
      departure_location: "",
      departure_time: "",
      max_passengers: "1",
    },
  });

  // 폼 제출 핸들러: 유효성 검사 통과 후 max_passengers를 숫자로 변환하여 처리
  function onSubmit(data: DriverRegisterValues) {
    const payload = {
      ...data,
      max_passengers: Number(data.max_passengers),
    };
    console.log("드라이버 등록:", payload);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      {/* 출발지 필드 (필수) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="departure_location">
          출발지 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="departure_location"
          placeholder="출발지를 입력하세요"
          {...form.register("departure_location")}
        />
        {form.formState.errors.departure_location?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.departure_location.message}
          </p>
        )}
      </div>

      {/* 출발 시간 필드 (필수) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="departure_time">
          출발 시간 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="departure_time"
          type="datetime-local"
          {...form.register("departure_time")}
        />
        {form.formState.errors.departure_time?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.departure_time.message}
          </p>
        )}
      </div>

      {/* 최대 탑승 인원 필드 (필수) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="max_passengers">
          최대 탑승 인원 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="max_passengers"
          type="number"
          min="1"
          {...form.register("max_passengers")}
        />
        {form.formState.errors.max_passengers?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.max_passengers.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full">
        드라이버 등록
      </Button>
    </form>
  );
}
