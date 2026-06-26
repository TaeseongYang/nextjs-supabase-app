-- =============================================================
-- 시드 데이터 파일 (supabase/seed.sql)
-- =============================================================
-- 목적: 테이블 구조 및 RLS 정책 검증용 샘플 데이터
--
-- 주의사항:
--   - events.organizer_id는 auth.users(id)를 참조하므로
--     실제 삽입 시 반드시 실존하는 auth.users.id로 교체 필요
--   - 아래 주석 처리된 예시 UUID를 실제 Supabase Auth 사용자 ID로 변경 후 실행
--   - 개발 시 Supabase 대시보드 > Authentication > Users 에서
--     테스트 사용자를 먼저 생성한 뒤 해당 ID를 사용하세요
-- =============================================================

-- =============================================================
-- 예시: 실제 실행 시 아래 블록의 주석을 해제하고
-- '<YOUR_AUTH_USER_ID>' 를 실제 auth.users.id 로 교체하세요
-- =============================================================

/*

-- 1. profiles 테이블 샘플 (auth.users 트리거가 없는 경우 수동 삽입)
INSERT INTO public.profiles (id, email, full_name, username)
VALUES
  ('<YOUR_AUTH_USER_ID>', 'organizer@example.com', '주최자 홍길동', 'organizer1')
ON CONFLICT (id) DO NOTHING;

-- 2. events 테이블 샘플
INSERT INTO public.events (id, organizer_id, title, description, location, event_date, invite_token, status, max_participants)
VALUES
  (
    'aaaaaaaa-0000-4000-8000-000000000001',
    '<YOUR_AUTH_USER_ID>',
    '테스트 수영 모임',
    '매주 토요일 수영장에서 만나요',
    '서울 강남구 수영장',
    NOW() + INTERVAL '7 days',
    'test-invite-token-001',
    'recruiting',
    20
  ),
  (
    'aaaaaaaa-0000-4000-8000-000000000002',
    '<YOUR_AUTH_USER_ID>',
    '헬스 번개 모임',
    NULL,
    '서울 마포구 헬스장',
    NOW() + INTERVAL '3 days',
    'test-invite-token-002',
    'confirmed',
    10
  )
ON CONFLICT (id) DO NOTHING;

-- 3. participants 테이블 샘플 (비회원 참여자 — user_id 없음)
INSERT INTO public.participants (id, event_id, name, phone, status)
VALUES
  ('bbbbbbbb-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '참여자 김철수', '010-1234-5678', 'attending'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000001', '참여자 이영희', '010-9876-5432', 'attending'),
  ('bbbbbbbb-0000-4000-8000-000000000003', 'aaaaaaaa-0000-4000-8000-000000000001', '참여자 박민준', NULL,             'pending'),
  ('bbbbbbbb-0000-4000-8000-000000000004', 'aaaaaaaa-0000-4000-8000-000000000002', '참여자 최수진', '010-5555-1234', 'attending')
ON CONFLICT (id) DO NOTHING;

-- 4. announcements 테이블 샘플
INSERT INTO public.announcements (id, event_id, content, is_pinned)
VALUES
  ('cccccccc-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '수영모자 필참입니다!', true),
  ('cccccccc-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000001', '준비운동 10분 전 도착 부탁드려요.', false)
ON CONFLICT (id) DO NOTHING;

-- 5. carpools 테이블 샘플
INSERT INTO public.carpools (id, event_id, driver_participant_id, departure_location, departure_time, max_passengers)
VALUES
  (
    'dddddddd-0000-4000-8000-000000000001',
    'aaaaaaaa-0000-4000-8000-000000000001',
    'bbbbbbbb-0000-4000-8000-000000000001',
    '강남역 3번 출구',
    NOW() + INTERVAL '7 days' - INTERVAL '1 hour',
    3
  )
ON CONFLICT (id) DO NOTHING;

-- 6. carpool_requests 테이블 샘플
INSERT INTO public.carpool_requests (id, carpool_id, participant_id, status)
VALUES
  (
    'eeeeeeee-0000-4000-8000-000000000001',
    'dddddddd-0000-4000-8000-000000000001',
    'bbbbbbbb-0000-4000-8000-000000000002',
    'confirmed'
  ),
  (
    'eeeeeeee-0000-4000-8000-000000000002',
    'dddddddd-0000-4000-8000-000000000001',
    'bbbbbbbb-0000-4000-8000-000000000003',
    'pending'
  )
ON CONFLICT (id) DO NOTHING;

-- 7. settlement_items 테이블 샘플
INSERT INTO public.settlement_items (id, event_id, title, total_amount, split_type)
VALUES
  ('ffffffff-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', '레인 이용료',  60000, 'equal'),
  ('ffffffff-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000001', '음료 및 간식', 30000, 'custom')
ON CONFLICT (id) DO NOTHING;

-- 8. settlement_details 테이블 샘플 (equal 분담: 60000 / 3명 = 20000)
INSERT INTO public.settlement_details (id, settlement_item_id, participant_id, amount, is_paid, paid_at)
VALUES
  ('gggggggg-0000-4000-8000-000000000001', 'ffffffff-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000001', 20000, true,  NOW() - INTERVAL '1 day'),
  ('gggggggg-0000-4000-8000-000000000002', 'ffffffff-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000002', 20000, false, NULL),
  ('gggggggg-0000-4000-8000-000000000003', 'ffffffff-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000003', 20000, false, NULL)
ON CONFLICT (id) DO NOTHING;

*/

-- =============================================================
-- 검증 쿼리 (시드 삽입 후 Supabase SQL 에디터에서 실행)
-- =============================================================
-- SELECT COUNT(*) FROM public.events;
-- SELECT COUNT(*) FROM public.participants;
-- SELECT COUNT(*) FROM public.announcements;
-- SELECT COUNT(*) FROM public.carpools;
-- SELECT COUNT(*) FROM public.carpool_requests;
-- SELECT COUNT(*) FROM public.settlement_items;
-- SELECT COUNT(*) FROM public.settlement_details;
