import Image from "next/image";
import type { Database } from "@/lib/database.types";
import { Badge } from "@/components/ui/badge";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileHeaderProps {
  profile: ProfileRow;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const displayName = profile.full_name || "이름 없음";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={displayName}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {initials}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-lg font-bold">{displayName}</p>
          {profile.username && (
            <Badge variant="secondary" className="w-fit">
              @{profile.username}
            </Badge>
          )}
          <p className="truncate text-sm text-muted-foreground">
            {profile.email}
          </p>
        </div>
      </div>

      {profile.bio && (
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
      )}

      <ProfileEditDialog profile={profile} />
    </div>
  );
}
