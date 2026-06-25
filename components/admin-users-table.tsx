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
import type { AdminUser } from "@/lib/mock/admin.mock";
import { useMemo, useState } from "react";

interface AdminUsersTableProps {
  users: AdminUser[];
}

// 가입일을 간단한 한국어 형식으로 포맷
function formatJoinDate(dateStr: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

// 관리자 사용자 관리 테이블 컴포넌트 (이름/이메일 검색 포함)
export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 이름 또는 이메일 기준 필터링
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 검색 툴바 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="이름 또는 이메일 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
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
    </div>
  );
}
