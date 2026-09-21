import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { ROLE_LABELS } from "@/features/auth/types";
import { requireAdmin } from "@/lib/auth/require-admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-border border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="font-semibold">
            Lingora Admin
          </Link>
          <Suspense fallback={<Skeleton className="h-8 w-40" />}>
            <AccountBar />
          </Suspense>
        </div>
      </header>

      {children}
    </div>
  );
}

async function AccountBar() {
  const user = await requireAdmin();

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground hidden text-sm sm:inline">
        {user.display_name} · {ROLE_LABELS[user.role]}
      </span>
      <LogoutButton />
    </div>
  );
}
