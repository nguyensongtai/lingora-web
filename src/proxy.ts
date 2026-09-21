import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  PERSIST_COOKIE,
  REFRESH_TOKEN_COOKIE,
  cookieOptions,
  refreshMaxAge,
} from "@/lib/auth/cookies";

type TokenPair = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/v1";

/**
 * Nhánh bắt buộc phải có phiên. Những đường còn lại trong matcher chỉ ghé qua
 * để gia hạn token nếu có — khách chưa đăng nhập vẫn xem được trang.
 */
const PROTECTED_PREFIXES = [
  "/admin",
  "/api/admin",
  "/learn",
  "/practice",
  "/vocabulary",
  "/progress",
  "/tutor",
  "/courses",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Proxy là nơi duy nhất làm mới được phiên: Server Component không set cookie
 * được, nên access token phải được bảo đảm còn hạn trước khi trang chạy.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return isProtected(request.nextUrl.pathname)
      ? rejectUnauthenticated(request)
      : NextResponse.next();
  }

  const upstream = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  }).catch(() => null);

  if (!upstream?.ok) {
    // Refresh token chết thì phiên coi như hết; xoá cookie để không thử lại mãi.
    const response = isProtected(request.nextUrl.pathname)
      ? rejectUnauthenticated(request)
      : NextResponse.next();
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
  // Gia hạn không được âm thầm biến cookie phiên thành cookie lâu dài, nên
  // lựa chọn "ghi nhớ đăng nhập" phải đọc lại từ cookie đánh dấu.
  const persist = request.cookies.get(PERSIST_COOKIE)?.value === "1";
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    pair.refresh_token,
    cookieOptions(refreshMaxAge(persist)),
  );
  return response;
}

/**
 * Trang thì chuyển hướng sang /login, còn route API thì trả 401 JSON — fetch
 * của client cần một mã lỗi để xử lý, không phải một trang HTML.
 */
function rejectUnauthenticated(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { code: "unauthorized", message: "Phiên đăng nhập đã hết hạn." },
      { status: 401 },
    );
  }

  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Toàn bộ khu vực học nằm sau đăng nhập, đúng như design. Riêng "/" chỉ ghé
  // qua để gia hạn token: trang đó tự chọn giữa giới thiệu và màn hình học.
  matcher: [
    "/",
    "/learn",
    "/practice",
    "/vocabulary",
    "/progress",
    "/tutor",
    "/courses/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/me/:path*",
  ],
};
