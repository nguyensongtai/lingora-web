import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/client";

import { changePassword, fieldError, updateProfile } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

function captureFetch() {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal("fetch", (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return Promise.resolve(Response.json({}));
  });
  return calls;
}

describe("updateProfile", () => {
  // PATCH chỉ mang field đã đổi: gửi cả tên cũ lên thì một lần đổi mục tiêu
  // có thể ghi đè tên vừa được sửa ở tab khác.
  it("chỉ gửi những field được truyền", async () => {
    const calls = captureFetch();

    await updateProfile({ dailyGoalXp: 100 });

    expect(calls[0].url).toBe("/api/auth/me");
    expect(calls[0].init.method).toBe("PATCH");
    expect(JSON.parse(calls[0].init.body as string)).toEqual({ daily_goal_xp: 100 });
  });
});

describe("changePassword", () => {
  it("đặt tên field theo API", async () => {
    const calls = captureFetch();

    await changePassword({ currentPassword: "cu", newPassword: "moi" });

    expect(calls[0].init.method).toBe("PUT");
    expect(JSON.parse(calls[0].init.body as string)).toEqual({
      current_password: "cu",
      new_password: "moi",
    });
  });
});

describe("fieldError", () => {
  it("đọc thông báo của đúng field từ details", () => {
    const error = new ApiError(400, {
      code: "validation_error",
      message: "Dữ liệu không hợp lệ.",
      details: { current_password: "không đúng" },
    });

    expect(fieldError(error, "current_password")).toBe("không đúng");
    expect(fieldError(error, "new_password")).toBeUndefined();
    expect(fieldError(new Error("mạng hỏng"), "current_password")).toBeUndefined();
  });
});
