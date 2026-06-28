-- 인증된 사용자가 invite_token으로 이벤트를 조회할 수 있도록 SELECT 정책 추가
-- (참여자가 초대 링크로 이벤트 정보를 볼 수 있어야 함)
CREATE POLICY "authenticated_select_by_token"
ON public.events
FOR SELECT
TO authenticated
USING (
  invite_token IS NOT NULL
  OR organizer_id = auth.uid()
);
