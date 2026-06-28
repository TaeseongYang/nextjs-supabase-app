"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUserRow } from "@/lib/admin/admin.types";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminUsersTableProps {
  users: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
}

// 가입일을 간단한 한국어 형식으로 포맷
function formatJoinDate(dateStr: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

// 관리자 사용자 관리 테이블 컴포넌트 (URL searchParams 기반 서버 사이드 검색)
export function AdminUsersTable({
  users,
  total,
  page,
  pageSize,
}: AdminUsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL searchParams에서 현재 검색어 읽기
  const currentSearch = searchParams.get("search") ?? "";

  // 검색어 변경 시 URL 업데이트 (페이지 리셋 포함)
  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page"); // 검색 시 1페이지로 리셋
    router.push(`/admin/users?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* 검색 툴바 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="이름 또는 이메일 검색..."
          defaultValue={currentSearch}
          onBlur={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(e.currentTarget.value);
          }}
          className="max-w-xs"
        />
      </div>

      {/* 사용자 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead className="text-center">이벤트 수</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name ?? "이름 없음"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatJoinDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{user.event_count}</Badge>
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

      {/* 페이지 정보 표시 */}
      <div className="text-sm text-muted-foreground">
        총 {total}개 중 {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, total)}개 표시
      </div>
    </div>
  );
}
