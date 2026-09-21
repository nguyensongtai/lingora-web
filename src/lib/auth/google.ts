import "server-only";

/**
 * Cookie giữ state chống CSRF của vòng OAuth, kèm đường dẫn muốn quay lại. Đời
 * ngắn vì nó chỉ phải sống qua đúng một lần chuyển hướng sang Google và về.
 */
export const OAUTH_STATE_COOKIE = "lingora_oauth_state";
export const OAUTH_STATE_MAX_AGE = 10 * 60;

export const GOOGLE_AUTHORIZE_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";

/** Bỏ trống thì nút Google không hiện và cả hai route đều trả về trang lỗi. */
export function googleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID ?? "";
}

export function googleEnabled(): boolean {
  return googleClientId() !== "";
}

/**
 * redirect_uri phải giống hệt ở cả hai lần gọi Google, nên nó được dựng từ
 * origin của chính request thay vì một biến môi trường dễ lệch.
 */
export function googleRedirectUri(request: Request): string {
  return new URL("/api/auth/google/callback", request.url).toString();
}

export type OAuthState = { state: string; next: string };

export function encodeState(value: OAuthState): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function decodeState(raw: string | undefined): OAuthState | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    );
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as OAuthState).state === "string" &&
      typeof (parsed as OAuthState).next === "string"
    ) {
      return parsed as OAuthState;
    }
  } catch {
    // Cookie hỏng thì coi như không có; phía gọi sẽ bắt đầu lại từ đầu.
  }
  return null;
}

/** Chỉ nhận đường dẫn nội bộ, như mọi chỗ khác xử lý tham số next. */
export function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}
