"use client";

import { Button } from "@/components/ui/button";

import { useLogout } from "../hooks/use-logout";

export function LogoutButton() {
  const { mutate, isPending } = useLogout();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? "Đang thoát…" : "Đăng xuất"}
    </Button>
  );
}
