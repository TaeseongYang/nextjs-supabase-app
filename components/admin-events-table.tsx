"use client";

import { EventStatusBadge } from "@/components/event-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAdminEventAction } from "@/lib/admin/admin.actions";
import type { AdminEventRow } from "@/lib/admin/admin.types";
import type { EventStatus } from "@/lib/types/enums";
import { formatEventDate } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminEventsTableProps {
  events: AdminEventRow[];
  total: number;
  page: number;
  pageSize: number;
}

// 상태 필터 옵션 정의
const STATUS_OPTIONS: { value: EventStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "recruiting", label: "모집 중" },
  { value: "confirmed", label: "확정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

// 관리자 이벤트 관리 테이블 컴포넌트 (URL searchParams 기반 서버 사이드 필터링)
export function AdminEventsTable({
  events,
  total,
  page,
  pageSize,
}: AdminEventsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL searchParams에서 현재 필터 값 읽기
  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  // 검색어 변경 시 URL 업데이트 (페이지 리셋 포함)
  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page"); // 검색 시 1페이지로 리셋
    router.push(`/admin/events?${params.toString()}`);
  }

  // 상태 필터 변경 시 URL 업데이트 (페이지 리셋 포함)
  function handleStatusFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.delete("page");
    router.push(`/admin/events?${params.toString()}`);
  }

  // 이벤트 삭제 처리
  async function handleDelete(id: string) {
    if (!confirm("이벤트를 삭제하시겠습니까?")) return;
    const { error } = await deleteAdminEventAction(id);
    if (error) {
      alert(error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 툴바 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="이벤트 제목 검색..."
          defaultValue={currentSearch}
          onBlur={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(e.currentTarget.value);
          }}
          className="max-w-xs"
        />
        <Select value={currentStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 이벤트 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>장소</TableHead>
              <TableHead className="text-center">참여자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatEventDate(event.event_date)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {event.location}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {event.attending_count} / {event.participant_count}
                  </TableCell>
                  <TableCell>
                    <EventStatusBadge status={event.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        상세보기
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지 정보 표시 */}
      <div className="text-sm text-muted-foreground">
        총 {total}개 중 {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, total)}개 표시
      </div>
    </div>
  );
}
