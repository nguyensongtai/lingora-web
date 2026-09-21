"use client";

import { usePathname } from "next/navigation";

import { navTitle } from "../nav";

import { ThemeToggle } from "./theme-toggle";

export function AppTopbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-15 items-center gap-2 px-4 app:px-8">
      <div className="app:hidden flex flex-1 items-center gap-2">
        <span className="bg-brand grid size-6.5 place-items-center rounded-[7px] text-sm font-bold text-white">
          L
        </span>
        <span className="text-base font-bold">{navTitle(pathname)}</span>
      </div>
      <div className="max-app:hidden flex-1" />
      <ThemeToggle />
    </header>
  );
}
