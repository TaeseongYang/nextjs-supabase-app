"use client";

import { EmptyState } from "@/components/empty-state";
import { ParticipantStatusBadge } from "@/components/participant-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatEventDate } from "@/lib/utils";
import type { Participant } from "@/lib/types/entities";

interface ParticipantsTabProps {
  participants: Participant[];
}

export function ParticipantsTab({ participants }: ParticipantsTabProps) {
  if (participants.length === 0) {
    return <EmptyState title="참여자가 없습니다" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>참여일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">{participant.name}</TableCell>
              {/* 연락처 없으면 "-" 표시 */}
              <TableCell className="text-muted-foreground">
                {participant.phone ?? "-"}
              </TableCell>
              <TableCell>
                <ParticipantStatusBadge status={participant.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatEventDate(participant.joined_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
