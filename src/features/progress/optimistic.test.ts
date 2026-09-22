import { describe, expect, it } from "vitest";

import { applyToggle } from "./optimistic";
import type { ProgressSnapshot } from "./types";

function snapshot(overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return {
    courses: [
      { course_id: "course-1", completed_count: 1, lesson_count: 3 },
      { course_id: "course-2", completed_count: 0, lesson_count: 2 },
    ],
    completed_lesson_ids: ["lesson-1"],
    latest_course_id: "course-1",
    today_xp: 20,
    goal_xp: 50,
    xp_per_lesson: 20,
    streak_days: 1,
    week: [
      { date: "2026-09-16", completed_lessons: 0 },
      { date: "2026-09-17", completed_lessons: 0 },
      { date: "2026-09-18", completed_lessons: 0 },
      { date: "2026-09-19", completed_lessons: 0 },
      { date: "2026-09-20", completed_lessons: 0 },
      { date: "2026-09-21", completed_lessons: 0 },
      { date: "2026-09-22", completed_lessons: 1 },
    ],
    ...overrides,
  };
}

describe("applyToggle · đánh dấu xong", () => {
  const next = applyToggle(snapshot(), {
    lessonId: "lesson-2",
    courseId: "course-1",
    completed: true,
  });

  it("thêm bài vào danh sách đã xong", () => {
    expect(next.completed_lesson_ids).toContain("lesson-2");
  });

  it("cộng XP theo đúng xp_per_lesson của server, không tự nhân", () => {
    expect(next.today_xp).toBe(40);
  });

  it("chỉ cộng cho khoá được bấm", () => {
    expect(next.courses[0].completed_count).toBe(2);
    expect(next.courses[1].completed_count).toBe(0);
  });

  /** Ngày cuối của week luôn là hôm nay, nên XP và chấm hôm nay đổi cùng nhau. */
  it("cộng vào ngày cuối của tuần, không đụng ngày trước", () => {
    expect(next.week[6].completed_lessons).toBe(2);
    expect(next.week[5].completed_lessons).toBe(0);
  });

  it("khoá vừa học thành khoá gần nhất", () => {
    expect(next.latest_course_id).toBe("course-1");
  });
});

describe("applyToggle · bỏ đánh dấu", () => {
  const next = applyToggle(snapshot(), {
    lessonId: "lesson-1",
    courseId: "course-1",
    completed: false,
  });

  it("bỏ bài khỏi danh sách và trừ XP", () => {
    expect(next.completed_lesson_ids).not.toContain("lesson-1");
    expect(next.today_xp).toBe(0);
    expect(next.courses[0].completed_count).toBe(0);
  });

  /** Bỏ đánh dấu không nói lên khoá nào là gần nhất, nên giữ nguyên. */
  it("không đổi khoá gần nhất", () => {
    expect(next.latest_course_id).toBe("course-1");
  });
});

describe("applyToggle · các ca biên", () => {
  it("bấm lại đúng trạng thái đang có thì không đổi gì", () => {
    const before = snapshot();

    const next = applyToggle(before, {
      lessonId: "lesson-1",
      courseId: "course-1",
      completed: true,
    });

    expect(next).toBe(before);
  });

  /**
   * Snapshot có thể đã cũ hơn thực tế, nên phép trừ phải có sàn — XP âm hay
   * số bài âm sẽ hiện thẳng lên màn hình dưới dạng vạch tiến độ ngược.
   */
  it("không để XP hay chấm ngày tụt xuống âm", () => {
    const stale = snapshot({ today_xp: 0, week: [{ date: "2026-09-22", completed_lessons: 0 }] });

    const next = applyToggle(stale, {
      lessonId: "lesson-1",
      courseId: "course-1",
      completed: false,
    });

    expect(next.today_xp).toBe(0);
    expect(next.week[0].completed_lessons).toBe(0);
  });

  it("không sửa snapshot cũ tại chỗ", () => {
    const before = snapshot();

    applyToggle(before, {
      lessonId: "lesson-2",
      courseId: "course-1",
      completed: true,
    });

    expect(before.completed_lesson_ids).toEqual(["lesson-1"]);
    expect(before.today_xp).toBe(20);
    expect(before.courses[0].completed_count).toBe(1);
  });
});
