"use client";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/utils";
import type { CarpoolWithDetails } from "@/lib/types/api";

interface GuestCarpoolsListProps {
  carpools: CarpoolWithDetails[];
}

// 비회원(guest) 영역에서 카풀 목록을 표시하는 컴포넌트
export function GuestCarpoolsList({ carpools }: GuestCarpoolsListProps) {
  // 카풀이 없을 때 빈 상태 표시
  if (carpools.length === 0) {
    return (
      <EmptyState
        title="카풀이 없습니다"
        description="등록된 카풀이 없습니다."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {carpools.map((carpool) => (
        <li key={carpool.id} className="rounded-lg border p-4">
          {/* 드라이버 정보 및 잔여 좌석 */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{carpool.driver.name}</p>
              <p className="text-sm text-muted-foreground">
                출발지: {carpool.departure_location}
              </p>
              <p className="text-sm text-muted-foreground">
                출발 시간: {formatEventDate(carpool.departure_time)}
              </p>
            </div>
            {/* 잔여 좌석 뱃지 */}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              잔여 {carpool.remaining_seats}석
            </span>
          </div>

          {/* 동승자 목록 — CarpoolsTab 패턴과 동일 */}
          {carpool.passengers.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                동승자
              </p>
              <div className="flex flex-wrap gap-1">
                {carpool.passengers.map((passenger) => (
                  <span
                    key={passenger.id}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {passenger.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 동승 신청 / 마감 버튼 */}
          <div className="mt-3 flex justify-end">
            {carpool.remaining_seats === 0 ? (
              <Button disabled variant="outline" size="sm">
                마감
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("동승 신청:", carpool.id)}
              >
                동승 신청
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
