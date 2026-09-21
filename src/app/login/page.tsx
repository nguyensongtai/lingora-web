import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<FormSkeleton />}>
            <LoginFormSection searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function LoginFormSection({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  return <LoginForm redirectTo={safeRedirect((await searchParams).next)} />;
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
  return "/admin";
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
