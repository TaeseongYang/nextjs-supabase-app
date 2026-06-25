"use client";

// 대시보드 이벤트 목록 클라이언트 컴포넌트 — 탭 필터와 EventCard 목록을 조합한다
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import type { EventWithStats } from "@/lib/types/api";
import type { EventStatus } from "@/lib/types/enums";

// 필터 탭 정의 — "all" 은 전체 보기 전용 값
type FilterValue = EventStatus | "all";

interface FilterTab {
  value: FilterValue;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { value: "all", label: "전체" },
  { value: "recruiting", label: "모집중" },
  { value: "confirmed", label: "확정" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
];

interface DashboardEventListProps {
  events: EventWithStats[];
}

export function DashboardEventList({ events }: DashboardEventListProps) {
  // 현재 활성 필터 상태 — 초기값은 전체 보기
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  // 선택한 필터에 따라 이벤트 목록 필터링
  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.status === activeFilter);

  return (
    <Tabs
      value={activeFilter}
      onValueChange={(value) => setActiveFilter(value as FilterValue)}
    >
      {/* 필터 탭 목록 — 5개 탭을 균등 분할 */}
      <TabsList className="grid w-full grid-cols-5">
        {FILTER_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* 탭 콘텐츠 — 활성 필터와 무관하게 단일 TabsContent로 렌더링 */}
      <TabsContent value={activeFilter}>
        {filteredEvents.length === 0 ? (
          // 필터 결과가 없을 때 빈 상태 표시
          <EmptyState
            icon={CalendarDays}
            title="이벤트가 없습니다"
            description="해당 상태의 이벤트가 없습니다."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
