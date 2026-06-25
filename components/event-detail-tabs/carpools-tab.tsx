"use client";

import { EmptyState } from "@/components/empty-state";
import { formatEventDate } from "@/lib/utils";
import type { CarpoolWithDetails } from "@/lib/types/api";

interface CarpoolsTabProps {
  carpools: CarpoolWithDetails[];
}

export function CarpoolsTab({ carpools }: CarpoolsTabProps) {
  if (carpools.length === 0) {
    return <EmptyState title="카풀이 없습니다" />;
  }

  return (
    <ul className="space-y-3">
      {carpools.map((carpool) => (
        <li key={carpool.id} className="rounded-lg border p-3">
          {/* 드라이버 정보 */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">
                {carpool.driver.name}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                출발지: {carpool.departure_location}
              </p>
              <p className="text-sm text-muted-foreground">
                출발: {formatEventDate(carpool.departure_time)}
              </p>
            </div>
            {/* 남은 좌석 */}
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              잔여 {carpool.remaining_seats}석
            </span>
          </div>

          {/* 동승자 목록 */}
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
        </li>
      ))}
    </ul>
  );
}
