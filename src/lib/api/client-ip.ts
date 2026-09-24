import "server-only";

/**
 * Header BFF gửi kèm để API biết ai thật sự đang đăng nhập. Không có nó, API
 * chỉ thấy IP của máy chủ web, và mọi người dùng chung một hạn mức đăng nhập
 * theo IP của cả site. API chỉ tin IP này khi secret khớp BFF_SHARED_SECRET
 * của nó.
 */
export const BFF_SECRET_HEADER = "X-Lingora-Bff";
export const BFF_CLIENT_IP_HEADER = "X-Lingora-Client-Ip";

const IPV4 = /^(\d{1,3})(\.\d{1,3}){3}$/;
const IPV6 = /^[0-9a-f:]+$/i;

/**
 * IP người dùng theo header mà proxy phía trước TỰ ĐẶT (TRUSTED_PROXY_HEADER).
 * null khi chưa cấu hình, hoặc header không chứa một IP — không đoán.
 */
export function trustedClientIP(
  headers: Headers,
  trustedHeader: string | undefined = process.env.TRUSTED_PROXY_HEADER,
): string | null {
  if (!trustedHeader) {
    return null;
  }
  const first = (headers.get(trustedHeader) ?? "").split(",")[0]?.trim() ?? "";
  return IPV4.test(first) || (first.includes(":") && IPV6.test(first)) ? first : null;
}

/** Hai header cho những lời gọi API có hạn mức theo IP; rỗng khi chưa cấu hình. */
export function clientIPHeaders(
  request: Request,
  env: { secret?: string; trustedHeader?: string } = {
    secret: process.env.BFF_SHARED_SECRET,
    trustedHeader: process.env.TRUSTED_PROXY_HEADER,
  },
): Record<string, string> {
  const ip = trustedClientIP(request.headers, env.trustedHeader);
  if (!env.secret || !ip) {
    return {};
  }
  return { [BFF_SECRET_HEADER]: env.secret, [BFF_CLIENT_IP_HEADER]: ip };
}
