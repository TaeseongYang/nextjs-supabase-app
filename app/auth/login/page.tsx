import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

// LoginForm이 useSearchParams()를 사용하므로 Suspense 경계 필요
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
