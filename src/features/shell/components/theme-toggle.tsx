"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "../hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Đổi chế độ sáng/tối"
      className="text-muted-foreground hover:bg-secondary hover:text-foreground grid size-10 place-items-center rounded-lg transition-colors"
    >
      <Icon className="size-[18px]" />
    </button>
  );
}
