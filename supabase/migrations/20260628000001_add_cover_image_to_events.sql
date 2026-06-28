-- events 테이블에 커버 이미지 URL 컬럼 추가
ALTER TABLE events ADD COLUMN cover_image_url TEXT;

-- Storage 버킷 생성 (public: 공개 URL로 이미지 서빙)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-covers',
  'event-covers',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 인증된 사용자는 본인 폴더({userId}/...)에만 업로드 가능
CREATE POLICY "auth_insert_event_covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'event-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 본인이 업로드한 파일만 삭제 가능
CREATE POLICY "auth_delete_own_event_covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'event-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
