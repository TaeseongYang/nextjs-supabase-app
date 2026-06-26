CREATE TABLE settlement_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  split_type split_type NOT NULL
);

ALTER TABLE settlement_items ENABLE ROW LEVEL SECURITY;

-- anon: SELECT 허용
CREATE POLICY "anon_select_settlement_items" ON settlement_items
  FOR SELECT TO anon USING (true);

-- authenticated: 본인 이벤트 정산 항목 ALL 허용
CREATE POLICY "auth_all_settlement_items" ON settlement_items
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = settlement_items.event_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = settlement_items.event_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_settlement_items_event_id ON settlement_items (event_id);

-- settlement_details 테이블
CREATE TABLE settlement_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_item_id UUID NOT NULL REFERENCES settlement_items(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  UNIQUE (settlement_item_id, participant_id)
);

ALTER TABLE settlement_details ENABLE ROW LEVEL SECURITY;

-- anon: SELECT + UPDATE 허용 (입금 체크)
CREATE POLICY "anon_select_settlement_details" ON settlement_details
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_settlement_details" ON settlement_details
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- authenticated: 본인 이벤트 정산 상세 ALL 허용
CREATE POLICY "auth_all_settlement_details" ON settlement_details
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM settlement_items
    JOIN events ON events.id = settlement_items.event_id
    WHERE settlement_items.id = settlement_details.settlement_item_id
      AND events.organizer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM settlement_items
    JOIN events ON events.id = settlement_items.event_id
    WHERE settlement_items.id = settlement_details.settlement_item_id
      AND events.organizer_id = auth.uid()
  ));

CREATE INDEX idx_settlement_details_settlement_item_id ON settlement_details (settlement_item_id);
