import { describe, expect, it } from "vitest";

import { BFF_CLIENT_IP_HEADER, BFF_SECRET_HEADER, clientIPHeaders, trustedClientIP } from "./client-ip";

function request(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/auth/login", { method: "POST", headers });
}

describe("trustedClientIP", () => {
  it("không tin header nào khi chưa cấu hình", () => {
    expect(trustedClientIP(new Headers({ "x-forwarded-for": "203.0.113.9" }), undefined)).toBeNull();
  });

  it("lấy giá trị đầu tiên của header được tin", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.1.2.3" });
    expect(trustedClientIP(headers, "X-Forwarded-For")).toBe("203.0.113.9");
    expect(trustedClientIP(new Headers({ "x-forwarded-for": "2001:db8::1" }), "X-Forwarded-For")).toBe(
      "2001:db8::1",
    );
  });

  it("bỏ qua giá trị không phải IP thay vì chuyển tiếp nó", () => {
    expect(trustedClientIP(new Headers({ "x-forwarded-for": "<script>" }), "X-Forwarded-For")).toBeNull();
  });
});

describe("clientIPHeaders", () => {
  const env = { secret: "secret-cua-bff-du-dai-toi-thieu-32-byte", trustedHeader: "X-Forwarded-For" };

  it("gửi IP kèm secret khi đã cấu hình cả hai", () => {
    expect(clientIPHeaders(request({ "x-forwarded-for": "203.0.113.9" }), env)).toEqual({
      [BFF_SECRET_HEADER]: env.secret,
      [BFF_CLIENT_IP_HEADER]: "203.0.113.9",
    });
  });

  // Thiếu một trong hai thì không gửi gì: API tự dùng địa chỉ kết nối, như ở dev.
  it("không gửi gì khi thiếu secret hoặc không biết IP", () => {
    expect(clientIPHeaders(request({ "x-forwarded-for": "203.0.113.9" }), { trustedHeader: "X-Forwarded-For" })).toEqual({});
    expect(clientIPHeaders(request({}), env)).toEqual({});
  });
});
