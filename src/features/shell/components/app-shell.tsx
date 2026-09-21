import type { ReactNode } from "react";
import { Suspense } from "react";

import { ProgressChips } from "@/features/progress/components/progress-chips";
import { readProgress } from "@/features/progress/server";
import { hasSession } from "@/lib/auth/session";

import { AccountBadge, AccountBadgeSkeleton } from "./account-badge";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { MobileNav } from "./mobile-nav";

/**
 * Khung của khu vực học. Là component chứ không chỉ là layout vì trang "/"
 * nằm ngoài route group — nó phải tự chọn giữa khung này và trang giới thiệu.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      {/* Cả hai phần dưới đều đọc cookie: Cache Components bắt buộc Suspense. */}
      <AppSidebar
        account={
          <Suspense fallback={<AccountBadgeSkeleton />}>
            <AccountBadge />
          </Suspense>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<AppTopbar signedIn={false} />}>
          <SessionAwareTopbar />
        </Suspense>
        {children}
        <MobileNav />
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
