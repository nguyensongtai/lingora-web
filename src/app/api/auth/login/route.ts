import { NextResponse } from "next/server";

import type { ApiErrorBody } from "@/lib/api/client";
import { apiBaseUrl } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { writeSession } from "@/lib/auth/session";

type TokenPair = components["schemas"]["TokenPair"];

/**
 * Đổi email/mật khẩu lấy phiên. Token do API trả về được cất vào httpOnly
 * cookie ngay tại đây và không bao giờ đi tiếp xuống trình duyệt — response chỉ
 * mang thông tin tài khoản.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "malformed_body", message: "Body không đọc được." },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!upstream.ok) {
    const failure = (await upstream.json().catch(() => null)) as ApiErrorBody | null;
    return NextResponse.json(
      failure ?? { code: "internal_error", message: "Không gọi được máy chủ." },
      { status: upstream.status },
    );
  }

  const pair = (await upstream.json()) as TokenPair;

  await writeSession({
    accessToken: pair.access_token,
    refreshToken: pair.refresh_token,
    expiresIn: pair.expires_in,
  });

  // Chỉ trả tài khoản: token ở lại phía server.
  return NextResponse.json(pair.user);
}
