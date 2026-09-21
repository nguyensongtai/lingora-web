"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_ITEMS, isActive } from "../nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-border app:hidden fixed inset-x-0 bottom-0 z-20 flex h-16 border-t px-1">
      {NAV_ITEMS.filter((item) => item.primary).map((item) => {
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors",
              active ? "text-brand" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-[22px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
