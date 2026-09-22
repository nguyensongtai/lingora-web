import { describe, expect, it } from "vitest";

import { safePath } from "./safe-path";

describe("safePath", () => {
  it("giữ nguyên đường dẫn nội bộ kèm query và hash", () => {
    expect(safePath("/learn")).toBe("/learn");
    expect(safePath("/learn?level=A2")).toBe("/learn?level=A2");
    expect(safePath("/courses/abc#bai-1")).toBe("/courses/abc#bai-1");
  });

  it("không có giá trị thì về trang chủ", () => {
    expect(safePath(null)).toBe("/");
    expect(safePath(undefined)).toBe("/");
    expect(safePath("")).toBe("/");
  });

  it("lấy giá trị đầu khi searchParams trả về mảng", () => {
    expect(safePath(["/learn", "/vocabulary"])).toBe("/learn");
  });

  it("chặn URL tuyệt đối sang site khác", () => {
    expect(safePath("https://evil.example/login")).toBe("/");
    expect(safePath("//evil.example")).toBe("/");
  });

  /**
   * Hai ca này là lý do hàm không dùng kiểm tiền tố nữa. Cả hai đã thử trong
   * trình duyệt thật: chúng qua được `startsWith("/") && !startsWith("//")`
   * nhưng vẫn phân giải ra http://evil.example, tức là mở đường đưa người vừa
   * đăng nhập sang site của kẻ tấn công.
   */
  it("chặn dấu chéo ngược — trình duyệt đổi nó thành dấu chéo xuôi", () => {
    expect(safePath("/\\evil.example")).toBe("/");
    expect(safePath("\\\\evil.example")).toBe("/");
  });

  it("chặn ký tự điều khiển bị URL parser lược bỏ", () => {
    expect(safePath("/\t/evil.example")).toBe("/");
    expect(safePath("/\n/evil.example")).toBe("/");
    expect(safePath("/\r/evil.example")).toBe("/");
  });

  it("chặn scheme khác", () => {
    expect(safePath("javascript:alert(1)")).toBe("/");
    expect(safePath("data:text/html,<script>alert(1)</script>")).toBe("/");
  });
});
