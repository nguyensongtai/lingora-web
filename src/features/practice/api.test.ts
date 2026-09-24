import { afterEach, describe, expect, it, vi } from "vitest";

import { checkAnswer, fetchSession, recordLessonScore } from "./api";
import { SESSION_SIZE, sessionQuery } from "./types";

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Ghi lại mọi request gửi đi và trả về đúng một body JSON. */
function captureFetch(body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal("fetch", (url: string, init: RequestInit = {}) => {
    calls.push({ url, init });
    return Promise.resolve(Response.json(body));
  });
  return calls;
}

describe("sessionQuery", () => {
  it("ôn tập hỏi theo cỡ lượt", () => {
    expect(sessionQuery({ kind: "review" })).toBe(`size=${SESSION_SIZE}`);
  });

  it("luyện trong bài chỉ gửi lesson_id — API tự hỏi hết từ của bài", () => {
    expect(sessionQuery({ kind: "lesson", lessonId: "lesson-1" })).toBe("lesson_id=lesson-1");
  });
});

describe("fetchSession", () => {
  it("đi qua Route Handler với đúng phạm vi", async () => {
    const calls = captureFetch({ questions: [] });

    await fetchSession({ kind: "lesson", lessonId: "lesson-1" });

    expect(calls[0].url).toBe("/api/me/practice/session?lesson_id=lesson-1");
  });
});

describe("checkAnswer", () => {
  const result = { correct: false, expected: "xin chào", penalised: false };

  it("gửi lesson_id khi chấm câu của một bài", async () => {
    const calls = captureFetch(result);

    await checkAnswer({
      scope: { kind: "lesson", lessonId: "lesson-1" },
      entryId: "e-1",
      kind: "multiple_choice",
      answer: "tạm biệt",
    });

    expect(JSON.parse(calls[0].init.body as string)).toEqual({
      entry_id: "e-1",
      kind: "multiple_choice",
      answer: "tạm biệt",
      lesson_id: "lesson-1",
    });
  });

  // Có lesson_id thì API không phạt câu sai. Lượt ôn tập mà lọt field này
  // vào thì lịch ôn mất tác dụng mà không ai nhận ra.
  it("không gửi lesson_id ở lượt ôn tập", async () => {
    const calls = captureFetch(result);

    await checkAnswer({
      scope: { kind: "review" },
      entryId: "e-1",
      kind: "fill_blank",
      answer: "hello",
    });

    expect(JSON.parse(calls[0].init.body as string)).not.toHaveProperty("lesson_id");
  });
});

describe("recordLessonScore", () => {
  it("PUT điểm của đúng bài, chỉ gửi correct và total", async () => {
    const calls = captureFetch({ lesson_id: "l-1", best_correct: 5, total: 6, attempts: 1 });

    const saved = await recordLessonScore({ lessonId: "l-1", correct: 5, total: 6 });

    expect(calls[0].url).toBe("/api/me/practice/lessons/l-1/score");
    expect(calls[0].init.method).toBe("PUT");
    expect(JSON.parse(calls[0].init.body as string)).toEqual({ correct: 5, total: 6 });
    expect(saved.best_correct).toBe(5);
  });
});
