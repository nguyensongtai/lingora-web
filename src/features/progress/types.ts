import type { components } from "@/lib/api/schema";

export type ProgressSnapshot = components["schemas"]["ProgressSnapshot"];
export type CourseProgress = components["schemas"]["CourseProgress"];

/** Snapshot rỗng dùng cho khách chưa đăng nhập: giao diện không phải rẽ nhánh. */
export const EMPTY_PROGRESS: ProgressSnapshot = {
  courses: [],
  completed_lesson_ids: [],
  latest_course_id: null,
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
