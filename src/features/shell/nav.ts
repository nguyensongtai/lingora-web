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

/**
 * Trang chủ chỉ khớp chính xác; các mục khác khớp cả route con của chúng.
 *
 * pathname null nghĩa là chưa biết đường dẫn — đó là lúc thanh điều hướng đang
 * được prerender trên một route có param động. Khi đó không mục nào sáng lên,
 * và trạng thái thật stream xuống ngay sau đó.
 */
export function isActive(item: NavItem, pathname: string | null): boolean {
  if (pathname === null) {
    return false;
  }
  return item.href === "/"
    ? pathname === "/"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function navTitle(pathname: string | null): string {
  return NAV_ITEMS.find((item) => isActive(item, pathname))?.label ?? "Lingora";
}
