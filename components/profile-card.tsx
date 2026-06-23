import type { Database } from "@/lib/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileCardProps {
  profile: ProfileRow;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const displayName = profile.full_name || "이름 없음";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {initials}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <CardTitle>{displayName}</CardTitle>
          {profile.username && (
            <Badge variant="secondary">@{profile.username}</Badge>
          )}
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {profile.bio && (
          <div>
            <span className="font-semibold text-muted-foreground">소개</span>
            <p className="mt-1">{profile.bio}</p>
          </div>
        )}
        {profile.website && (
          <div>
            <span className="font-semibold text-muted-foreground">웹사이트</span>
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-primary hover:underline"
            >
              {profile.website}
            </a>
          </div>
        )}
        <div className="text-xs text-muted-foreground border-t pt-3">
          가입일: {new Date(profile.created_at).toLocaleDateString("ko-KR")}
        </div>
      </CardContent>
    </Card>
  );
}
