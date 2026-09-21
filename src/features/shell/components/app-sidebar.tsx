"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { NAV_ITEMS, isActive } from "../nav";

import { Wordmark } from "./wordmark";

export function AppSidebar({ account }: { account: ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="border-border max-app:hidden sticky top-0 flex h-screen w-58 flex-none flex-col gap-1 border-r p-6 px-4">
      <Wordmark className="px-2 pb-6" />

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60",
              )}
            >
              <item.icon className="size-5 flex-none" />
              <span className="flex-1">{item.label}</span>
              <span className="text-muted-foreground text-[11px] font-medium">
                {item.en}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">{account}</div>
    </aside>
  );
}
