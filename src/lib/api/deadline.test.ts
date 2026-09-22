import { afterEach, describe, expect, it, vi } from "vitest";

import { REQUEST_TIMEOUT_MS, fetchWithDeadline } from "./deadline";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/** Bắt lấy init mà fetchWithDeadline truyền xuống fetch thật. */
function captureFetch() {
  const calls: RequestInit[] = [];
  vi.stubGlobal("fetch", (_input: unknown, init: RequestInit) => {
    calls.push(init);
    return new Promise<Response>(() => {
      // Không bao giờ resolve: test chỉ quan tâm tới signal.
    });
  });
  return calls;
}

describe("fetchWithDeadline", () => {
  it("gắn signal kể cả khi người gọi không truyền", () => {
    const calls = captureFetch();

    void fetchWithDeadline("/courses");

    expect(calls[0].signal).toBeInstanceOf(AbortSignal);
    expect(calls[0].signal?.aborted).toBe(false);
  });

  /**
   * Hạn chờ thật là 10 giây, quá lâu cho một unit test, và fake timer của
   * Vitest không điều khiển được bộ đếm nội bộ của AbortSignal.timeout. Nên
   * test thay hẳn AbortSignal.timeout bằng một signal tự bấm: nó kiểm đúng hai
   * điều cần kiểm — hạn được đặt bằng đúng REQUEST_TIMEOUT_MS, và khi hạn nổ
   * thì signal gửi xuống fetch cũng huỷ theo.
   */
  it("đặt hạn bằng REQUEST_TIMEOUT_MS và huỷ theo khi hạn nổ", () => {
    const deadline = new AbortController();
    const timeout = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(deadline.signal);
    const calls = captureFetch();

    void fetchWithDeadline("/courses");

    expect(timeout).toHaveBeenCalledWith(REQUEST_TIMEOUT_MS);
    expect(calls[0].signal?.aborted).toBe(false);

    deadline.abort();
    expect(calls[0].signal?.aborted).toBe(true);

    timeout.mockRestore();
  });

  /**
   * TanStack Query truyền signal của nó để huỷ query khi component unmount.
   * Ghi đè signal đó bằng hạn chờ là mất luôn việc huỷ, nên hai cái phải gộp.
   */
  it("giữ nguyên hiệu lực signal của người gọi", () => {
    const calls = captureFetch();
    const caller = new AbortController();

    void fetchWithDeadline("/courses", { signal: caller.signal });
    expect(calls[0].signal?.aborted).toBe(false);

    caller.abort();
    expect(calls[0].signal?.aborted).toBe(true);
  });

  it("không đánh rơi các tuỳ chọn khác", () => {
    const calls = captureFetch();

    void fetchWithDeadline("/courses", {
      method: "POST",
      cache: "no-store",
      headers: { Authorization: "Bearer abc" },
    });

    expect(calls[0].method).toBe("POST");
    expect(calls[0].cache).toBe("no-store");
  });

  it("hạn chờ ngắn hơn hạn 30 giây của API", () => {
    expect(REQUEST_TIMEOUT_MS).toBeLessThan(30_000);
  });
});
