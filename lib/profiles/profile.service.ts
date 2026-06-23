import type { Database } from "@/lib/database.types";
import { ProfileRepository } from "./profile.repository";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository
  ) {}

  async getProfile(userId: string): Promise<ProfileRow | null> {
    return this.profileRepository.findById(userId);
  }

  async updateProfile(
    userId: string,
    payload: Omit<ProfileUpdate, "id" | "created_at" | "updated_at">
  ): Promise<ProfileRow> {
    return this.profileRepository.updateById(userId, payload);
  }
}
