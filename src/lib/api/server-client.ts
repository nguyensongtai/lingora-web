import "server-only";

import { readAccessToken } from "@/lib/auth/session";

import { apiBaseUrl } from "./client";
import { fetchWithDeadline } from "./deadline";

/**
 * serverFetch gọi API kèm access token lấy từ cookie. Chỉ dùng trong Server
 * Component và Route Handler — token không bao giờ đi xuống trình duyệt.
 *
 * Việc làm mới token là của proxy: Server Component không set cookie được,
 * nên tới lúc nó chạy thì access token đã được proxy bảo đảm còn hạn.
 */
export async function serverFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await readAccessToken();

  const headers = new Headers(init.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetchWithDeadline(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
