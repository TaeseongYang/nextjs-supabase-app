CREATE TABLE carpools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  driver_participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  departure_location TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  max_passengers INTEGER NOT NULL CHECK (max_passengers > 0)
);

ALTER TABLE carpools ENABLE ROW LEVEL SECURITY;

-- anon: SELECT 허용
CREATE POLICY "anon_select_carpools" ON carpools
  FOR SELECT TO anon USING (true);

-- authenticated: 본인 이벤트 카풀 ALL 허용
CREATE POLICY "auth_all_carpools" ON carpools
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = carpools.event_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = carpools.event_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_carpools_event_id ON carpools (event_id);

-- carpool_requests 테이블
CREATE TABLE carpool_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carpool_id UUID NOT NULL REFERENCES carpools(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  status carpool_request_status NOT NULL DEFAULT 'pending',
  UNIQUE (carpool_id, participant_id)
);

ALTER TABLE carpool_requests ENABLE ROW LEVEL SECURITY;

-- anon: SELECT + INSERT 허용 (동승 신청)
CREATE POLICY "anon_select_carpool_requests" ON carpool_requests
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_carpool_requests" ON carpool_requests
  FOR INSERT TO anon WITH CHECK (true);

-- authenticated: 본인 이벤트 신청 ALL 허용
CREATE POLICY "auth_all_carpool_requests" ON carpool_requests
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM carpools
    JOIN events ON events.id = carpools.event_id
    WHERE carpools.id = carpool_requests.carpool_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM carpools
    JOIN events ON events.id = carpools.event_id
    WHERE carpools.id = carpool_requests.carpool_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_carpool_requests_carpool_id ON carpool_requests (carpool_id);
