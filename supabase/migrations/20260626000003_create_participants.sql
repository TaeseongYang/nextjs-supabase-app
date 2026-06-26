CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  status participant_status NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- anon: SELECT + INSERT 허용 (비회원 참여 등록)
CREATE POLICY "anon_select_participants" ON participants
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_participants" ON participants
  FOR INSERT TO anon WITH CHECK (true);

-- authenticated: 본인 이벤트 참여자 ALL 허용
CREATE POLICY "auth_all_participants" ON participants
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = participants.event_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = participants.event_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_participants_event_id ON participants (event_id);
