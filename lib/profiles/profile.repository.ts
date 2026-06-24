import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // PGRST116: row not found — 정상 케이스로 null 반환
      if (error.code === "PGRST116") return null;
      throw new Error(`ProfileRepository.findById: ${error.message}`);
    }

    return data;
  }

  async updateById(
    userId: string,
    payload: ProfileUpdate,
  ): Promise<ProfileRow> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`ProfileRepository.updateById: ${error.message}`);
    }

    return data;
  }
}
