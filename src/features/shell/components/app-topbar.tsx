"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { navTitle } from "../nav";

import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "./theme-toggle";

export function AppTopbar({
  signedIn,
  chips,
}: {
  signedIn: boolean;
  chips?: ReactNode;
}) {
  return <Topbar signedIn={signedIn} chips={chips} pathname={usePathname()} />;
}

/** Fallback của Suspense; xem chú thích ở AppSidebarFallback. */
export function AppTopbarFallback() {
  return <Topbar signedIn={false} pathname={null} />;
}

function Topbar({
  signedIn,
  chips,
  pathname,
}: {
  signedIn: boolean;
  chips?: ReactNode;
  pathname: string | null;
}) {
  return (
    <header className="bg-background app:px-8 sticky top-0 z-10 flex h-15 items-center gap-2 px-4">
      <div className="app:hidden flex flex-1 items-center gap-2">
        <Image
          src="/brand/lingora-mark.png"
          alt=""
          width={28}
          height={28}
          style={{ width: 28, height: 28 }}
          priority
        />
        <span className="text-base font-bold">{navTitle(pathname)}</span>
      </div>
      <div className="max-app:hidden flex-1" />
      {chips}
      <ThemeToggle />
      {/* Sidebar giữ nút đăng xuất trên desktop; mobile không có sidebar. */}
      {signedIn ? <MobileSignOut /> : null}
    </header>
  );
}

function MobileSignOut() {
  return (
    <span className="app:hidden">
      <SignOutButton />
    </span>
  );
}
