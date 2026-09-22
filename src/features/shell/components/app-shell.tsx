import type { ReactNode } from "react";
import { Suspense } from "react";

import { ProgressChips } from "@/features/progress/components/progress-chips";
import { readProgress } from "@/features/progress/server";
import { hasSession } from "@/lib/auth/session";

import { AccountBadge, AccountBadgeSkeleton } from "./account-badge";
import { AppSidebar, AppSidebarFallback } from "./app-sidebar";
import { AppTopbar, AppTopbarFallback } from "./app-topbar";
import { MobileNav, MobileNavFallback } from "./mobile-nav";

/**
 * Khung của khu vực học. Là component chứ không chỉ là layout vì trang "/"
 * nằm ngoài route group — nó phải tự chọn giữa khung này và trang giới thiệu.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      {/* Cả hai phần dưới đều đọc cookie: Cache Components bắt buộc Suspense. */}
      {/*
        Ba khối điều hướng còn đọc usePathname. Trên route có param động
        (/courses/[id]) đường dẫn chỉ biết lúc chạy, nên không bọc Suspense là
        build hỏng. Fallback giữ nguyên khung và chỉ bỏ phần tô sáng, để không
        có cú nhảy layout khi trạng thái thật stream xuống.
      */}
      <Suspense fallback={<AppSidebarFallback account={<AccountBadgeSkeleton />} />}>
        <AppSidebar
          account={
            <Suspense fallback={<AccountBadgeSkeleton />}>
              <AccountBadge />
            </Suspense>
          }
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<AppTopbarFallback />}>
          <SessionAwareTopbar />
        </Suspense>
        {children}
        <Suspense fallback={<MobileNavFallback />}>
          <MobileNav />
        </Suspense>
      </div>
    </div>
  );
}

async function SessionAwareTopbar() {
  const signedIn = await hasSession();
  if (!signedIn) {
    return <AppTopbar signedIn={false} />;
  }

  // readProgress được bọc cache() nên trang bên trong dùng lại đúng lần đọc này.
  return (
    <AppTopbar
      signedIn
      chips={<ProgressChips initialProgress={await readProgress()} />}
    />
  );
}
