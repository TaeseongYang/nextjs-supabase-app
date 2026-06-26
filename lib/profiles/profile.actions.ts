"use server";

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository } from "./profile.repository";
import { ProfileService } from "./profile.service";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

async function createProfileServiceAsync() {
  const supabase = await createClient();
  const repository = new ProfileRepository(supabase);
  return new ProfileService(repository);
}

export async function getProfileAction(
  userId: string,
): Promise<{ data: ProfileRow | null; error: string | null }> {
  try {
    const service = await createProfileServiceAsync();
    const data = await service.getProfile(userId);
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}

export async function updateProfileAction(
  userId: string,
  payload: Omit<ProfileUpdate, "id" | "created_at" | "updated_at">,
): Promise<{ data: ProfileRow | null; error: string | null }> {
  try {
    const service = await createProfileServiceAsync();
    const data = await service.updateProfile(userId, payload);
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}

// 현재 로그인 사용자의 관리자 권한 여부 확인
export async function checkAdminAction(): Promise<{
  isAdmin: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims) return { isAdmin: false, error: null };
    const service = await createProfileServiceAsync();
    const profile = await service.getProfile(data.claims.sub);
    return { isAdmin: profile?.is_admin ?? false, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { isAdmin: false, error: message };
  }
}
