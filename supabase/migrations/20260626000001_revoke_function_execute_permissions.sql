-- 트리거 함수의 불필요한 EXECUTE 권한 제거
-- handle_new_user()와 handle_updated_at()는 트리거로만 호출되어야 하며,
-- anon/authenticated 역할이 REST API를 통해 직접 호출할 수 없어야 합니다.

-- anon, authenticated 역할에서 EXECUTE 권한 제거
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated;

-- PUBLIC 역할(모든 역할이 상속)에서도 EXECUTE 권한 제거
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC;
