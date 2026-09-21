import "server-only";

import type { components } from "@/lib/api/schema";
import { serverFetch } from "@/lib/api/server-client";

import { hasSession } from "./session";

export type CurrentUser = components["schemas"]["User"];

/**
 * null nghĩa là khách chưa đăng nhập. Lỗi khác 401 vẫn được ném ra: một API
 * đang hỏng không nên trông giống như đăng xuất.
 */
export async function readCurrentUser(): Promise<CurrentUser | null> {
  if (!(await hasSession())) {
    return null;
  }

  const response = await serverFetch("/auth/me");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      `Không đọc được tài khoản đang đăng nhập (HTTP ${response.status}).`,
    );
  }

  return (await response.json()) as CurrentUser;
}

/** "Nguyễn Song Tài" → "NT"; dùng cho ô avatar chữ. */
export function initialsOf(displayName: string): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "?";
  }
  const first = words[0]!;
  const last = words[words.length - 1]!;
  return (first[0]! + (words.length > 1 ? last[0]! : "")).toUpperCase();
}
