import type { Route } from "next";
import {
  BookOpen,
  Bot,
  ChartColumn,
  House,
  Layers,
  List,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: Route;
  label: string;
  /** Nhãn tiếng Anh, hiển thị mờ bên cạnh để người học quen dần thuật ngữ. */
  en: string;
  icon: LucideIcon;
  /** Có mặt trên thanh điều hướng dưới của mobile — nơi chỉ đủ chỗ cho 5 mục. */
  primary: boolean;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Trang chủ", en: "Home", icon: House, primary: true },
  { href: "/learn", label: "Học", en: "Learn", icon: BookOpen, primary: true },
  { href: "/practice", label: "Luyện tập", en: "Practice", icon: Layers, primary: true },
  { href: "/vocabulary", label: "Từ vựng", en: "Vocabulary", icon: List, primary: true },
  { href: "/tutor", label: "AI Tutor", en: "Speaking", icon: Bot, primary: false },
  { href: "/progress", label: "Tiến độ", en: "Progress", icon: ChartColumn, primary: true },
];

/** Trang chủ chỉ khớp chính xác; các mục khác khớp cả route con của chúng. */
export function isActive(item: NavItem, pathname: string): boolean {
  return item.href === "/"
    ? pathname === "/"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function navTitle(pathname: string): string {
  return NAV_ITEMS.find((item) => isActive(item, pathname))?.label ?? "Lingora";
}
