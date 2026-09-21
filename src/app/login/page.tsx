import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AuthForm } from "@/features/auth/components/auth-form";
import { Wordmark } from "@/features/shell/components/wordmark";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập hoặc tạo tài khoản Lingora.",
};

const HIGHLIGHTS = [
  { value: "6", label: "cấp độ CEFR" },
  { value: "4", label: "kỹ năng" },
  { value: "10'", label: "mỗi ngày" },
] as const;

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="bg-brand-soft max-app:hidden flex flex-1 flex-col justify-between p-12">
        <Wordmark />

        <div className="flex max-w-105 flex-col gap-5">
          <Image
            src="/brand/lingora-mark.png"
            alt=""
            width={72}
            height={72}
            style={{ width: 72, height: 72 }}
            priority
          />
          <p className="text-brand-ink text-2xl font-bold tracking-tight">
            Learn. Practice. Speak.
          </p>
          <p className="text-brand-ink/80 text-[17px] leading-relaxed">
            Lộ trình A1 → C2 theo khung CEFR. Mỗi ngày 10 phút, luôn biết mình
            đang ở đâu và học gì tiếp.
          </p>
          <div className="text-muted-foreground flex gap-6 text-[13px]">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label}>
                <b className="text-foreground block text-xl font-bold tracking-tight">
                  {item.value}
                </b>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-xs">© 2026 Lingora</p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-5 py-8">
        <Wordmark className="app:hidden w-full max-w-100" />

        {/* searchParams là dữ liệu động: Cache Components bắt buộc Suspense. */}
        <Suspense fallback={<FormSkeleton />}>
          <AuthSection searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function AuthSection({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  return <AuthForm redirectTo={safeRedirect((await searchParams).next)} />;
}

/**
 * Chỉ nhận đường dẫn nội bộ: tham số next đến từ URL nên không được phép đưa
 * người dùng sang tên miền khác sau khi đăng nhập.
 */
function safeRedirect(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

function FormSkeleton() {
  return (
    <div className="flex w-full max-w-100 flex-col gap-7">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
