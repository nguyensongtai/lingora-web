import { NextResponse } from "next/server";

import { apiBaseUrl } from "@/lib/api/client";
import { clearSession, readRefreshToken } from "@/lib/auth/session";

/**
 * Thu hồi phiên ở API rồi xoá cookie. Cookie luôn được xoá kể cả khi API lỗi,
 * để người dùng không bị kẹt trong trạng thái "đăng xuất không được".
 */
export async function POST(): Promise<NextResponse> {
  const refreshToken = await readRefreshToken();

  if (refreshToken) {
    await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  await clearSession();
  return new NextResponse(null, { status: 204 });
}
