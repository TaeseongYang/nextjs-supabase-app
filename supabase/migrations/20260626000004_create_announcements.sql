CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- anon: SELECT 허용
CREATE POLICY "anon_select_announcements" ON announcements
  FOR SELECT TO anon USING (true);

-- authenticated: 본인 이벤트 공지 ALL 허용
CREATE POLICY "auth_all_announcements" ON announcements
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = announcements.event_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = announcements.event_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_announcements_event_id ON announcements (event_id);
