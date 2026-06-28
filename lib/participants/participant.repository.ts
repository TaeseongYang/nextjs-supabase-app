import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { Participant } from "@/lib/types/entities";
import type { ParticipantStatus } from "@/lib/types/enums";

// DB Row 타입 별칭
type ParticipantRow = Database["public"]["Tables"]["participants"]["Row"];
type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"];

/**
 * ParticipantRow를 Participant 엔티티로 변환
 * joined_at이 null인 경우 현재 시각으로 대체
 */
function toParticipant(row: ParticipantRow): Participant {
  return {
    id: row.id,
    event_id: row.event_id,
    user_id: row.user_id ?? "",
    name: row.name,
    phone: row.phone,
    status: row.status as ParticipantStatus,
    joined_at: row.joined_at ?? new Date().toISOString(),
  };
}

export class ParticipantRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * 이벤트의 전체 참여자 목록 조회 (joined_at 오름차순)
   */
  async findByEventId(eventId: string): Promise<Participant[]> {
    const { data, error } = await this.supabase
      .from("participants")
      .select("*")
      .eq("event_id", eventId)
      .order("joined_at", { ascending: true });

    if (error) {
      throw new Error(`ParticipantRepository.findByEventId: ${error.message}`);
    }

    return (data ?? []).map(toParticipant);
  }

  /**
   * ID로 단일 참여자 조회
   * PGRST116(행 미존재)는 null 반환
   */
  async findById(id: string): Promise<Participant | null> {
    const { data, error } = await this.supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`ParticipantRepository.findById: ${error.message}`);
    }

    return data ? toParticipant(data) : null;
  }

  /**
   * attending 상태 참여자 수 조회
   */
  async countAttending(eventId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "attending");

    if (error) {
      throw new Error(`ParticipantRepository.countAttending: ${error.message}`);
    }

    return count ?? 0;
  }

  /**
   * 가장 오래된 대기자 조회 (joined_at 오름차순 첫 번째)
   * 없으면 null 반환
   */
  async findFirstWaitlisted(eventId: string): Promise<Participant | null> {
    const { data, error } = await this.supabase
      .from("participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("status", "waitlisted")
      .order("joined_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(
        `ParticipantRepository.findFirstWaitlisted: ${error.message}`,
      );
    }

    return data ? toParticipant(data) : null;
  }

  /**
   * 새 참여자 등록
   */
  async create(payload: ParticipantInsert): Promise<Participant> {
    const { data, error } = await this.supabase
      .from("participants")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`ParticipantRepository.create: ${error.message}`);
    }

    return toParticipant(data);
  }

  /**
   * 참여 상태 변경 (attending / absent / pending / waitlisted)
   */
  async updateStatus(
    id: string,
    status: ParticipantStatus,
  ): Promise<Participant> {
    const { data, error } = await this.supabase
      .from("participants")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`ParticipantRepository.updateStatus: ${error.message}`);
    }

    return toParticipant(data);
  }

  /**
   * 참여자 삭제
   */
  async deleteById(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("participants")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`ParticipantRepository.deleteById: ${error.message}`);
    }
  }
}
