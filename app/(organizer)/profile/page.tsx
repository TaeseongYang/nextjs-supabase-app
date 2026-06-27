import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/profiles/profile.repository";
import { ProfileService } from "@/lib/profiles/profile.service";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStatsSection } from "@/components/profile/profile-stats-section";
import { ProfileQuickActions } from "@/components/profile/profile-quick-actions";
import { ProfileAccountSection } from "@/components/profile/profile-account-section";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/auth/login");

  const userId = claimsData.claims.sub;
  const repository = new ProfileRepository(supabase);
  const service = new ProfileService(repository);
  const profile = await service.getProfile(userId);

  if (!profile) {
    return (
      <div className="flex flex-col gap-8 py-4">
        <p className="text-sm text-muted-foreground">
          프로필을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <ProfileHeader profile={profile} />
      <ProfileStatsSection />
      <ProfileQuickActions />
      <ProfileAccountSection />
    </div>
  );
}
