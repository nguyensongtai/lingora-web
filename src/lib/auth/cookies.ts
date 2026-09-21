/**
 * Hằng số và tuỳ chọn cookie phiên. Tách riêng khỏi session.ts vì proxy
 * chạy ở edge runtime, không import được "server-only" hay next/headers.
 */
export const ACCESS_TOKEN_COOKIE = "lingora_at";
export const REFRESH_TOKEN_COOKIE = "lingora_rt";

/**
 * Đánh dấu người dùng có tick "ghi nhớ đăng nhập" hay không. Cố ý không
 * httpOnly và không chứa gì bí mật: proxy cần đọc nó ở mỗi lần gia hạn để biết
 * nên đặt lại refresh token thành cookie lâu dài hay cookie phiên.
 */
export const PERSIST_COOKIE = "lingora_persist";

export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge?: number;
};

/**
 * maxAge null tạo cookie phiên: trình duyệt đóng là mất. Đó là điều người dùng
 * yêu cầu khi bỏ tick "ghi nhớ đăng nhập trên máy này".
 */
export function cookieOptions(maxAge: number | null): SessionCookieOptions {
  const base = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  } as const;

  return maxAge === null ? base : { ...base, maxAge };
}

export function refreshMaxAge(persist: boolean): number | null {
  return persist ? REFRESH_TOKEN_MAX_AGE : null;
}
