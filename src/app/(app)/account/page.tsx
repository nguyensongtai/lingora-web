import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PasswordForm } from "@/features/account/components/password-form";
import { ProfileForm } from "@/features/account/components/profile-form";
import { readCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Tài khoản",
};

export default function AccountPage() {
  return (
    <main className="mx-auto flex w-full max-w-160 flex-1 flex-col gap-6 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <h1 className="text-[26px] leading-tight font-bold tracking-tight">Tài khoản</h1>
      {/* Đọc cookie: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-card" />}>
        <Account />
      </Suspense>
    </main>
  );
}

async function Account() {
  // Proxy đã chặn khách ở /account, nên tới đây mà không có người dùng là phiên
  // vừa hết hạn giữa chừng — báo vậy thay vì hiện form rỗng.
  const user = await readCurrentUser();
  if (!user) {
    return <p className="text-muted-foreground">Phiên đăng nhập đã hết hạn. Tải lại trang để đăng nhập.</p>;
  }

  return (
    <>
      <section className="border-border bg-card rounded-card flex flex-col gap-5 border p-5 app:p-6">
        <div>
          <h2 className="text-base font-semibold">Hồ sơ</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{user.email}</p>
        </div>
        <ProfileForm user={user} />
      </section>

      <section className="border-border bg-card rounded-card flex flex-col gap-5 border p-5 app:p-6">
        <h2 className="text-base font-semibold">Mật khẩu</h2>
        {user.has_password ? (
          <PasswordForm />
        ) : (
          <p className="text-muted-foreground text-sm">
            Tài khoản này đăng nhập bằng Google nên chưa có mật khẩu để đổi.
          </p>
        )}
      </section>
    </>
  );
}
