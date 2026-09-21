"use client";

import { LogOut } from "lucide-react";

import { useLogout } from "@/features/auth/hooks/use-logout";

export function SignOutButton() {
  const { mutate, isPending } = useLogout();

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      aria-label="Đăng xuất"
      title="Đăng xuất"
      className="text-muted-foreground hover:bg-secondary hover:text-foreground grid size-9 flex-none place-items-center rounded-lg transition-colors disabled:opacity-50"
    >
      <LogOut className="size-4" />
    </button>
  );
}
