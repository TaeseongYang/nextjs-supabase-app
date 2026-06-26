-- ENUM 타입 4개 생성
CREATE TYPE event_status AS ENUM ('recruiting', 'confirmed', 'completed', 'cancelled');
CREATE TYPE participant_status AS ENUM ('attending', 'absent', 'pending', 'waitlisted');
CREATE TYPE carpool_request_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE split_type AS ENUM ('equal', 'custom');

-- events 테이블 생성
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  max_participants INTEGER CHECK (max_participants > 0),
  status event_status NOT NULL DEFAULT 'recruiting',
  invite_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- anon: 모든 이벤트 SELECT 허용 (초대 토큰 기반 필터는 앱 레이어에서 처리)
CREATE POLICY "anon_select_events" ON events
  FOR SELECT TO anon USING (true);

-- authenticated: 본인 이벤트만 ALL 허용
CREATE POLICY "auth_all_events" ON events
  FOR ALL TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- 인덱스
CREATE INDEX idx_events_organizer_id ON events (organizer_id);
