import "server-only";

import { readAccessToken } from "@/lib/auth/session";

import { apiBaseUrl } from "./client";

/**
 * serverFetch gọi API kèm access token lấy từ cookie. Chỉ dùng trong Server
 * Component và Route Handler — token không bao giờ đi xuống trình duyệt.
 *
 * Việc làm mới token là của middleware: Server Component không set cookie được,
 * nên tới lúc nó chạy thì access token đã được middleware bảo đảm còn hạn.
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

  return fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
