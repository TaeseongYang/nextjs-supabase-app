import type { ParticipantRepository } from "./participant.repository";
import type { CreateParticipantDto } from "@/lib/types/api";
import type { ParticipantStatus } from "@/lib/types/enums";
import type { Participant } from "@/lib/types/entities";

export class ParticipantService {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  /**
   * 참여 등록
   * - dto.status가 'attending'이고 정원이 설정된 경우: 현재 attending 수 >= maxParticipants이면 waitlisted로 전환
   * - maxParticipants가 null이면 정원 제한 없음
   * - userId: 로그인한 사용자 ID (RLS 정책에 의해 필수)
   * - userName: 프로필에서 조회한 표시 이름
   */
  async registerParticipant(
    eventId: string,
    maxParticipants: number | null,
    userId: string,
    userName: string,
    dto: CreateParticipantDto,
  ): Promise<Participant> {
    let finalStatus: ParticipantStatus = dto.status;

    // 참석 의사가 있고 정원 제한이 있는 경우에만 정원 체크
    if (finalStatus === "attending" && maxParticipants !== null) {
      const attendingCount =
        await this.participantRepository.countAttending(eventId);
      if (attendingCount >= maxParticipants) {
        // 정원 초과 시 대기 상태로 전환
        finalStatus = "waitlisted";
      }
    }

    return this.participantRepository.create({
      event_id: eventId,
      user_id: userId,
      name: userName,
      phone: null,
      status: finalStatus,
    });
  }

  /**
   * 이벤트 참여자 목록 조회
   */
  async getParticipantsByEvent(eventId: string): Promise<Participant[]> {
    return this.participantRepository.findByEventId(eventId);
  }

  /**
   * 참여자 상태 변경
   * - newStatus가 'absent'이면 가장 오래된 대기자를 attending으로 승격
   */
  async updateParticipantStatus(
    participantId: string,
    newStatus: ParticipantStatus,
  ): Promise<Participant> {
    const updated = await this.participantRepository.updateStatus(
      participantId,
      newStatus,
    );

    // 불참으로 전환된 경우 → 대기자 승격
    if (newStatus === "absent") {
      const waitlisted = await this.participantRepository.findFirstWaitlisted(
        updated.event_id,
      );
      if (waitlisted) {
        await this.participantRepository.updateStatus(
          waitlisted.id,
          "attending",
        );
      }
    }

    return updated;
  }

  /**
   * 참여자 삭제
   * - 삭제 전 현재 status 확인
   * - 삭제 대상이 attending 상태였으면 대기자 승격
   */
  async removeParticipant(participantId: string): Promise<void> {
    const participant =
      await this.participantRepository.findById(participantId);

    if (!participant) {
      throw new Error("PARTICIPANT_NOT_FOUND");
    }

    await this.participantRepository.deleteById(participantId);

    // attending 상태였던 경우에만 대기자 승격
    if (participant.status === "attending") {
      const waitlisted = await this.participantRepository.findFirstWaitlisted(
        participant.event_id,
      );
      if (waitlisted) {
        await this.participantRepository.updateStatus(
          waitlisted.id,
          "attending",
        );
      }
    }
  }
}
