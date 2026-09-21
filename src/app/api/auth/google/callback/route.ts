import { NextResponse } from "next/server";

import { apiBaseUrl } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import {
  OAUTH_STATE_COOKIE,
  decodeState,
  googleRedirectUri,
} from "@/lib/auth/google";
import { writeSession } from "@/lib/auth/session";

type TokenPair = components["schemas"]["TokenPair"];

/**
 * Google trả người dùng về đây. Đổi code lấy phiên qua API rồi cất token vào
 * cookie — không mã nào của Google đi tiếp xuống trình duyệt.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const params = new URL(request.url).searchParams;
  const saved = decodeState(
    request.headers
      .get("cookie")
      ?.split("; ")
      .find((part) => part.startsWith(`${OAUTH_STATE_COOKIE}=`))
      ?.slice(OAUTH_STATE_COOKIE.length + 1),
  );

  const failure = (reason: string) => {
    const response = NextResponse.redirect(
      new URL(`/login?error=${reason}`, request.url),
    );
    response.cookies.delete(OAUTH_STATE_COOKIE);
    return response;
  };

  // Người dùng bấm "Huỷ" ở màn Google cũng rơi vào đây, kèm error=access_denied.
  if (params.get("error")) {
    return failure("google_cancelled");
  }

  const code = params.get("code");
  if (!code || !saved || saved.state !== params.get("state")) {
    return failure("google_state");
  }

  const upstream = await fetch(`${apiBaseUrl}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      redirect_uri: googleRedirectUri(request),
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!upstream?.ok) {
    return failure("google_failed");
  }

  const pair = (await upstream.json()) as TokenPair;
  await writeSession({
    accessToken: pair.access_token,
    refreshToken: pair.refresh_token,
    expiresIn: pair.expires_in,
    // Đi qua Google là hành động chủ động của người dùng trên máy của họ; nhớ
    // phiên như khi tick "ghi nhớ đăng nhập".
    persist: true,
  });

  const response = NextResponse.redirect(new URL(saved.next, request.url));
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
