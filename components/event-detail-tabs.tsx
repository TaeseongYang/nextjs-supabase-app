"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementsTab } from "@/components/event-detail-tabs/announcements-tab";
import { ParticipantsTab } from "@/components/event-detail-tabs/participants-tab";
import { CarpoolsTab } from "@/components/event-detail-tabs/carpools-tab";
import { SettlementsTab } from "@/components/event-detail-tabs/settlements-tab";
import type { Announcement, Participant } from "@/lib/types/entities";
import type { CarpoolWithDetails, SettlementSummary } from "@/lib/types/api";

interface EventDetailTabsProps {
  announcements: Announcement[];
  participants: Participant[];
  carpools: CarpoolWithDetails[];
  settlements: SettlementSummary[];
}

export function EventDetailTabs({
  announcements,
  participants,
  carpools,
  settlements,
}: EventDetailTabsProps) {
  return (
    <Tabs defaultValue="announcements">
      {/* 4탭 그리드 네비게이션 */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="announcements">공지</TabsTrigger>
        <TabsTrigger value="participants">참여자</TabsTrigger>
        <TabsTrigger value="carpools">카풀</TabsTrigger>
        <TabsTrigger value="settlements">정산</TabsTrigger>
      </TabsList>

      {/* 공지 탭 */}
      <TabsContent value="announcements" className="mt-4">
        <AnnouncementsTab announcements={announcements} />
      </TabsContent>

      {/* 참여자 탭 */}
      <TabsContent value="participants" className="mt-4">
        <ParticipantsTab participants={participants} />
      </TabsContent>

      {/* 카풀 탭 */}
      <TabsContent value="carpools" className="mt-4">
        <CarpoolsTab carpools={carpools} />
      </TabsContent>

      {/* 정산 탭 */}
      <TabsContent value="settlements" className="mt-4">
        <SettlementsTab settlements={settlements} />
      </TabsContent>
    </Tabs>
  );
}
