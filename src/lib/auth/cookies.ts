/**
 * Hằng số và tuỳ chọn cookie phiên. Tách riêng khỏi session.ts vì proxy
 * chạy ở edge runtime, không import được "server-only" hay next/headers.
 */
export const ACCESS_TOKEN_COOKIE = "lingora_at";
export const REFRESH_TOKEN_COOKIE = "lingora_rt";

export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
};

export function cookieOptions(maxAge: number): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
