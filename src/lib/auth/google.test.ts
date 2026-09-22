import { describe, expect, it } from "vitest";

import { decodeState, encodeState } from "./google";

describe("encodeState / decodeState", () => {
  it("đi một vòng thì giữ nguyên giá trị", () => {
    const value = { state: "abc123", next: "/learn?level=A2" };

    expect(decodeState(encodeState(value))).toEqual(value);
  });

  it("không có cookie thì trả null", () => {
    expect(decodeState(undefined)).toBeNull();
    expect(decodeState("")).toBeNull();
  });

  /**
   * Cookie state là lớp chống CSRF của vòng OAuth. Mọi thứ không giải mã được
   * phải thành null để phía gọi bắt đầu lại từ đầu — không được ném lỗi làm
   * hỏng callback, cũng không được trả về một object nửa vời.
   */
  it("cookie hỏng thì trả null chứ không ném lỗi", () => {
    expect(decodeState("khong-phai-base64!!!")).toBeNull();
    expect(decodeState(Buffer.from("khong-phai-json").toString("base64url"))).toBeNull();
  });

  it("thiếu field thì trả null", () => {
    const missingNext = Buffer.from(JSON.stringify({ state: "abc" })).toString("base64url");
    const wrongType = Buffer.from(JSON.stringify({ state: 1, next: "/" })).toString("base64url");

    expect(decodeState(missingNext)).toBeNull();
    expect(decodeState(wrongType)).toBeNull();
  });

  it("JSON hợp lệ nhưng không phải object thì trả null", () => {
    const justAString = Buffer.from(JSON.stringify("xin chao")).toString("base64url");
    const justNull = Buffer.from(JSON.stringify(null)).toString("base64url");

    expect(decodeState(justAString)).toBeNull();
    expect(decodeState(justNull)).toBeNull();
  });
});
