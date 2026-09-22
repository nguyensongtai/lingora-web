import { describe, expect, it } from "vitest";

import { isMissing } from "./missing";

describe("isMissing", () => {
  /**
   * 400 được gộp vào 404 vì id sai định dạng trong đường dẫn không thể trỏ tới
   * bản ghi nào. Không gộp thì người dán nhầm URL nhận trang lỗi máy chủ cho
   * một lỗi hoàn toàn của phía họ.
   */
  it("coi 400 và 404 là không tìm thấy", () => {
    expect(isMissing(404)).toBe(true);
    expect(isMissing(400)).toBe(true);
  });

  it("không nuốt lỗi quyền hay lỗi máy chủ", () => {
    expect(isMissing(401)).toBe(false);
    expect(isMissing(403)).toBe(false);
    expect(isMissing(409)).toBe(false);
    expect(isMissing(500)).toBe(false);
    expect(isMissing(503)).toBe(false);
  });

  it("không nuốt phản hồi thành công", () => {
    expect(isMissing(200)).toBe(false);
    expect(isMissing(204)).toBe(false);
  });
});
