import { describe, expect, it } from "vitest";

import { NAV_ITEMS, isActive, navTitle } from "./nav";

const home = NAV_ITEMS.find((item) => item.href === "/")!;
const learn = NAV_ITEMS.find((item) => item.href === "/learn")!;

describe("isActive", () => {
  it("trang chủ chỉ khớp chính xác, không nuốt mọi đường dẫn", () => {
    expect(isActive(home, "/")).toBe(true);
    expect(isActive(home, "/learn")).toBe(false);
    expect(isActive(home, "/vocabulary")).toBe(false);
  });

  it("mục khác khớp cả route con của nó", () => {
    expect(isActive(learn, "/learn")).toBe(true);
    expect(isActive(learn, "/learn/abc")).toBe(true);
  });

  it("không khớp đường dẫn chỉ trùng tiền tố chuỗi", () => {
    expect(isActive(learn, "/learning")).toBe(false);
  });

  /**
   * pathname null là lúc thanh điều hướng đang prerender trên route có param
   * động. Không mục nào được sáng — sáng nhầm rồi đổi lại khi giá trị thật
   * stream xuống thì người dùng thấy đèn nhảy.
   */
  it("chưa biết đường dẫn thì không mục nào sáng", () => {
    for (const item of NAV_ITEMS) {
      expect(isActive(item, null)).toBe(false);
    }
  });
});

describe("navTitle", () => {
  it("lấy nhãn của mục đang mở", () => {
    expect(navTitle("/learn")).toBe("Học");
    expect(navTitle("/")).toBe("Trang chủ");
    expect(navTitle("/vocabulary")).toBe("Từ vựng");
  });

  it("đường dẫn ngoài thanh điều hướng thì dùng tên app", () => {
    expect(navTitle("/courses/abc")).toBe("Lingora");
    expect(navTitle(null)).toBe("Lingora");
  });
});
