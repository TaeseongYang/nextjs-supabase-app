"use client";

import { EmptyState } from "@/components/empty-state";
import { SPLIT_TYPE_LABEL } from "@/lib/types/enums";
import type { SettlementSummary } from "@/lib/types/api";

interface SettlementsTabProps {
  settlements: SettlementSummary[];
}

export function SettlementsTab({ settlements }: SettlementsTabProps) {
  if (settlements.length === 0) {
    return <EmptyState title="정산 항목이 없습니다" />;
  }

  return (
    <ul className="space-y-4">
      {settlements.map((settlement) => {
        const totalAmount = settlement.total_paid + settlement.total_unpaid;

        return (
          <li key={settlement.item.id} className="rounded-lg border p-4">
            {/* 항목 헤더 */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">
                  {settlement.item.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  총액 {settlement.item.total_amount.toLocaleString()}원 ·{" "}
                  {SPLIT_TYPE_LABEL[settlement.item.split_type]}
                </p>
              </div>
              {/* 입금 현황 */}
              <div className="shrink-0 text-right text-sm">
                <span className="font-medium text-foreground">
                  {settlement.total_paid.toLocaleString()}원
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {totalAmount.toLocaleString()}원
                </span>
                <p className="text-xs text-muted-foreground">입금 현황</p>
              </div>
            </div>

            {/* 참여자별 정산 상세 */}
            {settlement.details.length > 0 && (
              <ul className="mt-3 space-y-1 border-t pt-3">
                {settlement.details.map((detail) => (
                  <li
                    key={detail.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">
                      {detail.participant.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {detail.amount.toLocaleString()}원
                      </span>
                      {/* 입금 여부 표시 */}
                      {detail.is_paid ? (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs text-destructive">미납</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
