import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  PERSIST_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
  refreshMaxAge,
} from "./cookies";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  /** Số giây còn hiệu lực của access token. */
  expiresIn: number;
  /** false thì phiên chỉ sống tới khi đóng trình duyệt. */
  persist: boolean;
};

export async function readAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function readRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
}

/** Chỉ gọi được trong Route Handler hoặc Server Action. */
export async function writeSession(tokens: SessionTokens): Promise<void> {
  const store = await cookies();
  store.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    cookieOptions(tokens.expiresIn),
  );
  store.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    cookieOptions(refreshMaxAge(tokens.persist)),
  );
  store.set(PERSIST_COOKIE, tokens.persist ? "1" : "0", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(tokens.persist ? { maxAge: REFRESH_TOKEN_MAX_AGE } : {}),
  });
}

/** Chỉ gọi được trong Route Handler hoặc Server Action. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  store.delete(PERSIST_COOKIE);
}

/** true khi còn refresh token, tức là còn khả năng khôi phục phiên. */
export async function hasSession(): Promise<boolean> {
  return (await readRefreshToken()) !== undefined;
}
