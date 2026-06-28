"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}

// 관리자 페이지네이션 컴포넌트 (URL searchParams 기반 페이지 이동)
export function AdminPagination({
  page,
  pageSize,
  total,
  basePath,
}: AdminPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  // 1페이지 이하이면 렌더링하지 않음
  if (totalPages <= 1) return null;

  // 특정 페이지로 이동 (기존 searchParams 유지)
  function goToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages} 페이지 (총 {total}개)
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
        >
          이전
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
