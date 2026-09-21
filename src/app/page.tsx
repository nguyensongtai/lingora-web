import { Suspense } from "react";

import { HomeScreen } from "@/features/home/home-screen";
import { LandingScreen } from "@/features/landing/components/landing-screen";
import { AppShell } from "@/features/shell/components/app-shell";
import { hasSession } from "@/lib/auth/session";

/**
 * Một địa chỉ, hai mặt: khách thấy trang giới thiệu, người đã đăng nhập thấy
 * thẳng màn hình học. Tách thành hai đường dẫn thì người đã đăng nhập vẫn phải
 * đi qua trang bán hàng mỗi lần mở app.
 */
export default function RootPage() {
  return (
    // hasSession đọc cookie: Cache Components bắt buộc Suspense.
    <Suspense fallback={null}>
      <RootRoute />
    </Suspense>
  );
}

async function RootRoute() {
  if (!(await hasSession())) {
    return <LandingScreen />;
  }

  return (
    <AppShell>
      <HomeScreen />
    </AppShell>
  );
}
