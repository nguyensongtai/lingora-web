import { NextResponse } from "next/server";

import type { ApiErrorBody } from "@/lib/api/client";
import { apiBaseUrl } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { writeSession } from "@/lib/auth/session";

type TokenPair = components["schemas"]["TokenPair"];

/**
 * Tạo tài khoản rồi mở phiên ngay. Giống /api/auth/login, token ở lại phía
 * server và response chỉ mang thông tin tài khoản.
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

  const upstream = await fetch(`${apiBaseUrl}/auth/register`, {
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

  // Người vừa tạo tài khoản thì mặc định nhớ phiên: họ chưa có dịp chọn.
  await writeSession({
    accessToken: pair.access_token,
    refreshToken: pair.refresh_token,
    expiresIn: pair.expires_in,
    persist: true,
  });

  return NextResponse.json(pair.user, { status: 201 });
}
