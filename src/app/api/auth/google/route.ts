import { NextResponse } from "next/server";

import { safePath } from "@/lib/safe-path";

import {
  GOOGLE_AUTHORIZE_URL,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
  encodeState,
  googleClientId,
  googleEnabled,
  googleRedirectUri,
} from "@/lib/auth/google";

/**
 * Bắt đầu vòng OAuth: sinh state, cất vào cookie rồi đẩy người dùng sang
 * Google. State nằm trong cookie httpOnly nên trang khác không đọc hay đặt hộ
 * được — đó là chỗ chặn CSRF của luồng này.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!googleEnabled()) {
    return NextResponse.redirect(new URL("/login?error=google_off", request.url));
  }

  const next = safePath(new URL(request.url).searchParams.get("next"));
  const state = crypto.randomUUID();

  const authorize = new URL(GOOGLE_AUTHORIZE_URL);
  authorize.searchParams.set("client_id", googleClientId());
  authorize.searchParams.set("redirect_uri", googleRedirectUri(request));
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "openid email profile");
  authorize.searchParams.set("state", state);
  // Người dùng có nhiều tài khoản Google thì được chọn, thay vì bị đăng nhập
  // bằng cái Google nhớ sẵn.
  authorize.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorize);
  response.cookies.set(OAUTH_STATE_COOKIE, encodeState({ state, next }), {
    httpOnly: true,
    // lax chứ không phải strict: cookie phải sống sót qua cú chuyển hướng
    // Google trả người dùng về.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OAUTH_STATE_MAX_AGE,
  });
  return response;
}
