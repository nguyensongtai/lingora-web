import { afterEach, describe, expect, it, vi } from "vitest";

import {
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
  refreshMaxAge,
} from "./cookies";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("refreshMaxAge", () => {
  /**
   * Bỏ tick "ghi nhớ đăng nhập" phải ra cookie phiên — đóng trình duyệt là mất.
   * Nếu chỗ này trả về một con số, lần gia hạn token đầu tiên sẽ âm thầm nâng
   * phiên tạm thành 30 ngày, đúng thứ người dùng vừa từ chối.
   */
  it("không tick thì trả null, tức cookie phiên", () => {
    expect(refreshMaxAge(false)).toBeNull();
  });

  it("có tick thì sống 30 ngày", () => {
    expect(refreshMaxAge(true)).toBe(REFRESH_TOKEN_MAX_AGE);
    expect(REFRESH_TOKEN_MAX_AGE).toBe(60 * 60 * 24 * 30);
  });
});

describe("cookieOptions", () => {
  it("maxAge null thì bỏ hẳn field, không đặt 0", () => {
    const options = cookieOptions(null);

    expect("maxAge" in options).toBe(false);
  });

  it("maxAge có giá trị thì giữ nguyên", () => {
    expect(cookieOptions(900).maxAge).toBe(900);
  });

  it("luôn httpOnly và sameSite lax", () => {
    const options = cookieOptions(900);

    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });

  it("chỉ bật secure ở production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(cookieOptions(900).secure).toBe(true);

    vi.stubEnv("NODE_ENV", "development");
    expect(cookieOptions(900).secure).toBe(false);
  });
});
