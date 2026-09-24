import Link from "next/link";
import { LogIn } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABELS } from "@/features/auth/types";
import { initialsOf, readCurrentUser } from "@/lib/auth/current-user";

import { SignOutButton } from "./sign-out-button";

export async function AccountBadge() {
  const user = await readCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors"
      >
        <LogIn className="size-5 flex-none" />
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg px-1 py-1">
      {/* Bấm vào tên là mở trang tài khoản — chỗ người ta vẫn tìm nó. */}
      <Link
        href="/account"
        className="hover:bg-secondary/60 flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1 transition-colors"
      >
        <span className="bg-secondary grid size-8 flex-none place-items-center rounded-full text-xs font-semibold">
          {initialsOf(user.display_name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold">
            {user.display_name}
          </span>
          <span className="text-muted-foreground block text-xs">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
      </Link>
      <SignOutButton />
    </div>
  );
}

export function AccountBadgeSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <Skeleton className="size-8 flex-none rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
