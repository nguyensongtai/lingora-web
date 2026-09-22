import type { components } from "@/lib/api/schema";

export type ProgressSnapshot = components["schemas"]["ProgressSnapshot"];
export type CourseProgress = components["schemas"]["CourseProgress"];
export type DayActivity = components["schemas"]["DayActivity"];
export type ProgressHistory = components["schemas"]["ProgressHistory"];

/** Số ngày mặc định của biểu đồ; khớp mặc định của API. */
export const HISTORY_DAYS = 30;

/** Lịch sử rỗng cho khách chưa đăng nhập. */
export const EMPTY_HISTORY: ProgressHistory = {
  days: [],
  total_lessons: 0,
  total_xp: 0,
  active_days: 0,
  current_streak: 0,
  longest_streak: 0,
  xp_per_lesson: 0,
  goal_xp: 0,
};

/** Snapshot rỗng dùng cho khách chưa đăng nhập: giao diện không phải rẽ nhánh. */
export const EMPTY_PROGRESS: ProgressSnapshot = {
  courses: [],
  completed_lesson_ids: [],
  latest_course_id: null,
  today_xp: 0,
  goal_xp: 0,
  xp_per_lesson: 0,
  streak_days: 0,
  week: [],
};

export function completedSetOf(snapshot: ProgressSnapshot): Set<string> {
  return new Set(snapshot.completed_lesson_ids);
}

export function courseProgressOf(
  snapshot: ProgressSnapshot,
  courseId: string,
): CourseProgress | undefined {
  return snapshot.courses.find((course) => course.course_id === courseId);
}
