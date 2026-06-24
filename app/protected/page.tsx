import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "@/lib/profiles/profile.repository";
import { ProfileService } from "@/lib/profiles/profile.service";
import { ProfileCard } from "@/components/profile-card";
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";

async function ProfileSection() {
  const supabase = await createClient();

  const { data: claimsData, error: authError } =
    await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const userId = claimsData.claims.sub;

  const repository = new ProfileRepository(supabase);
  const service = new ProfileService(repository);
  const profile = await service.getProfile(userId);

  if (!profile) {
    return (
      <div className="text-sm text-muted-foreground">
        프로필을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  return <ProfileCard profile={profile} />;
}

export default function ProtectedPage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />
          로그인한 사용자만 볼 수 있는 보호된 페이지입니다.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">내 프로필</h2>
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">
              프로필 로딩 중...
            </div>
          }
        >
          <ProfileSection />
        </Suspense>
      </div>
    </div>
  );
}
