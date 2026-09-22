import { describe, expect, it } from "vitest";

import type { Course } from "@/features/course/types";

import { percent, summariseLevels } from "./levels";
import { EMPTY_PROGRESS, type ProgressSnapshot } from "./types";

function course(id: string, level: Course["level"]): Course {
  return {
    id,
    slug: id,
    title: id,
    description: "",
    level,
    status: "published",
    cover_image_url: null,
    position: 0,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  };
}

function snapshot(
  courses: ProgressSnapshot["courses"],
): ProgressSnapshot {
  return { ...EMPTY_PROGRESS, courses };
}

describe("summariseLevels", () => {
  it("cộng mọi khoá cùng bậc vào một dòng", () => {
    const rows = summariseLevels(
      [course("a", "A1"), course("b", "A1"), course("c", "A2")],
      snapshot([
        { course_id: "a", completed_count: 2, lesson_count: 3 },
        { course_id: "b", completed_count: 1, lesson_count: 4 },
        { course_id: "c", completed_count: 0, lesson_count: 5 },
      ]),
    );

    const a1 = rows.find((row) => row.level === "A1")!;
    expect(a1.done).toBe(3);
    expect(a1.total).toBe(7);
  });

  it("trả về đủ sáu bậc, kể cả bậc chưa có khoá", () => {
    const rows = summariseLevels([course("a", "A1")], snapshot([]));

    expect(rows.map((row) => row.level)).toEqual([
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
    ]);
  });

  /**
   * Khoá chưa có bài nào không xuất hiện trong snapshot. Bỏ qua nó thì mẫu số
   * đúng, nhưng tỉ lệ sẽ nhảy ngay khi người soạn thêm bài đầu tiên — nên nó
   * được cộng vào với 0/0.
   */
  it("khoá vắng mặt trong snapshot không làm hỏng phép cộng", () => {
    const rows = summariseLevels(
      [course("a", "A1"), course("chua-co-bai", "A1")],
      snapshot([{ course_id: "a", completed_count: 1, lesson_count: 2 }]),
    );

    const a1 = rows.find((row) => row.level === "A1")!;
    expect(a1.done).toBe(1);
    expect(a1.total).toBe(2);
  });

  it("không trộn bậc này sang bậc khác", () => {
    const rows = summariseLevels(
      [course("a", "A1"), course("b", "C2")],
      snapshot([
        { course_id: "a", completed_count: 1, lesson_count: 1 },
        { course_id: "b", completed_count: 5, lesson_count: 5 },
      ]),
    );

    expect(rows.find((row) => row.level === "A1")!.done).toBe(1);
    expect(rows.find((row) => row.level === "C2")!.done).toBe(5);
    expect(rows.find((row) => row.level === "B1")!.total).toBe(0);
  });
});

describe("percent", () => {
  it("làm tròn về số nguyên", () => {
    expect(percent({ level: "A1", done: 1, total: 3 })).toBe(33);
    expect(percent({ level: "A1", done: 2, total: 3 })).toBe(67);
  });

  /** Bậc chưa có bài nào: chia cho 0 ra NaN và vạch tiến độ biến mất. */
  it("mẫu số 0 thì ra 0 chứ không phải NaN", () => {
    expect(percent({ level: "A1", done: 0, total: 0 })).toBe(0);
  });
});
