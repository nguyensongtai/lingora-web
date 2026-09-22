import { describe, expect, it } from "vitest";

import { EMPTY_PROGRESS, completedSetOf, courseProgressOf } from "./types";

describe("completedSetOf", () => {
  it("dựng set tra cứu từ danh sách id", () => {
    const set = completedSetOf({
      ...EMPTY_PROGRESS,
      completed_lesson_ids: ["a", "b"],
    });

    expect(set.has("a")).toBe(true);
    expect(set.has("c")).toBe(false);
  });

  it("snapshot rỗng thì ra set rỗng, không lỗi", () => {
    expect(completedSetOf(EMPTY_PROGRESS).size).toBe(0);
  });
});

describe("courseProgressOf", () => {
  const snapshot = {
    ...EMPTY_PROGRESS,
    courses: [{ course_id: "course-1", completed_count: 2, lesson_count: 3 }],
  };

  it("tìm đúng khoá", () => {
    expect(courseProgressOf(snapshot, "course-1")?.completed_count).toBe(2);
  });

  /** Khoá chưa học lần nào không có dòng nào trong snapshot — đó là bình thường. */
  it("khoá chưa có tiến độ thì trả undefined", () => {
    expect(courseProgressOf(snapshot, "course-2")).toBeUndefined();
  });
});

describe("EMPTY_PROGRESS", () => {
  /** Khách chưa đăng nhập dùng snapshot này; mọi số phải là 0 chứ không undefined. */
  it("mọi số đều là 0 để giao diện không phải rẽ nhánh", () => {
    expect(EMPTY_PROGRESS.today_xp).toBe(0);
    expect(EMPTY_PROGRESS.streak_days).toBe(0);
    expect(EMPTY_PROGRESS.courses).toEqual([]);
    expect(EMPTY_PROGRESS.completed_lesson_ids).toEqual([]);
    expect(EMPTY_PROGRESS.latest_course_id).toBeNull();
  });
});
