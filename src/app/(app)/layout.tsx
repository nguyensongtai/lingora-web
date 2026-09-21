import { Suspense } from "react";

import {
  AccountBadge,
  AccountBadgeSkeleton,
} from "@/features/shell/components/account-badge";
import { AppSidebar } from "@/features/shell/components/app-sidebar";
import { AppTopbar } from "@/features/shell/components/app-topbar";
import { MobileNav } from "@/features/shell/components/mobile-nav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1">
      {/* AccountBadge đọc cookie nên là dữ liệu động: Cache Components bắt buộc Suspense. */}
      <AppSidebar
        account={
          <Suspense fallback={<AccountBadgeSkeleton />}>
            <AccountBadge />
          </Suspense>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        {children}
        <MobileNav />
      </div>
    </div>
  );
}
