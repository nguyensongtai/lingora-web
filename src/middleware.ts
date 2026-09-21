import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
} from "@/lib/auth/cookies";

type TokenPair = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/v1";

/**
 * Middleware là nơi duy nhất làm mới được phiên: Server Component không set
 * cookie được, nên access token phải được bảo đảm còn hạn trước khi trang chạy.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  const upstream = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  }).catch(() => null);

  if (!upstream?.ok) {
    // Refresh token chết thì phiên coi như hết; xoá cookie để không thử lại mãi.
    const response = redirectToLogin(request);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }

  const pair = (await upstream.json()) as TokenPair;
  const response = NextResponse.next();
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    pair.access_token,
    cookieOptions(pair.expires_in),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    pair.refresh_token,
    cookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
  return response;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Chỉ khu vực quản trị mới cần phiên; trang công khai không đụng tới.
  matcher: ["/admin/:path*"],
};
