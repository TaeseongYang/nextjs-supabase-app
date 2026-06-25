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
import type { EventWithStats } from "@/lib/types/api";
import type { EventStatus } from "@/lib/types/enums";
import { formatEventDate } from "@/lib/utils";
import { useMemo, useState } from "react";

interface AdminEventsTableProps {
  events: EventWithStats[];
}

// 상태 필터 옵션 정의
const STATUS_OPTIONS: { value: EventStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "recruiting", label: "모집 중" },
  { value: "confirmed", label: "확정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

// 관리자 이벤트 관리 테이블 컴포넌트 (검색 및 상태 필터 포함)
export function AdminEventsTable({ events }: AdminEventsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");

  // 검색어 및 상태 필터 적용
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 툴바 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="이벤트 제목 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as EventStatus | "all")}
        >
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
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
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
                    <Button variant="outline" size="sm">
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
