"use client";

import { Pin } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatEventDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types/entities";

interface AnnouncementsTabProps {
  announcements: Announcement[];
}

export function AnnouncementsTab({ announcements }: AnnouncementsTabProps) {
  if (announcements.length === 0) {
    return <EmptyState title="공지가 없습니다" />;
  }

  // 고정 공지를 상단으로 정렬
  const sorted = [...announcements].sort((a, b) => {
    if (a.is_pinned === b.is_pinned) return 0;
    return a.is_pinned ? -1 : 1;
  });

  return (
    <ul className="space-y-3">
      {sorted.map((announcement) => (
        <li
          key={announcement.id}
          className="rounded-lg border bg-card p-4 text-card-foreground"
        >
          {/* 고정 공지 핀 아이콘 */}
          {announcement.is_pinned && (
            <div className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
              <Pin className="h-3 w-3" />
              고정
            </div>
          )}
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {announcement.content}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatEventDate(announcement.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}
