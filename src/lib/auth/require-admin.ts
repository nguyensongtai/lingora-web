import "server-only";

import { redirect } from "next/navigation";

import type { components } from "@/lib/api/schema";
import { serverFetch } from "@/lib/api/server-client";

type User = components["schemas"]["User"];

/**
 * requireAdmin là chốt chặn thật của khu vực quản trị. Middleware chỉ lo giữ
 * access token còn hạn; nó không biết role, nên quyền phải được kiểm ở đây —
 * và API vẫn kiểm lại lần nữa ở mọi route ghi.
 */
export async function requireAdmin(): Promise<User> {
  const response = await serverFetch("/auth/me");

  if (response.status === 401) {
    redirect("/login?next=/admin");
  }
  if (!response.ok) {
    throw new Error(`Không đọc được tài khoản đang đăng nhập (HTTP ${response.status}).`);
  }

  const user = (await response.json()) as User;
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}
