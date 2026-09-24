import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { ApiErrorBody } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { serverFetch } from "@/lib/api/server-client";
import { PERSIST_COOKIE } from "@/lib/auth/cookies";
import { writeSession } from "@/lib/auth/session";

type TokenPair = components["schemas"]["TokenPair"];

/**
 * Đổi mật khẩu. API thu hồi MỌI phiên — kể cả phiên đang gọi — rồi trả về một
 * cặp token mới, nên cặp đó phải được cất vào cookie ngay tại đây; không làm
 * thì người vừa đổi mật khẩu bị đăng xuất ở lần gia hạn tới.
 */
export async function PUT(request: Request): Promise<NextResponse> {
  const upstream = await serverFetch("/auth/me/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  if (!upstream.ok) {
    const failure = (await upstream.json().catch(() => null)) as ApiErrorBody | null;
    return NextResponse.json(
      failure ?? { code: "internal_error", message: "Không gọi được máy chủ." },
      { status: upstream.status },
    );
  }

  const pair = (await upstream.json()) as TokenPair;
  // Giữ đúng lựa chọn "ghi nhớ đăng nhập" của lần đăng nhập trước.
  const persist = (await cookies()).get(PERSIST_COOKIE)?.value !== "0";
  await writeSession({
    accessToken: pair.access_token,
    refreshToken: pair.refresh_token,
    expiresIn: pair.expires_in,
    persist,
  });

  return NextResponse.json(pair.user);
}
