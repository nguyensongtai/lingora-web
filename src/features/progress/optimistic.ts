import type { ProgressSnapshot } from "./types";

/** Một lần bật/tắt dấu "đã học xong" của một bài. */
export type LessonToggle = {
  lessonId: string;
  courseId: string;
  completed: boolean;
};

/**
 * applyToggle dựng snapshot mà server SẼ trả về, để giao diện đổi ngay thay vì
 * đợi một vòng mạng. Tách khỏi hook vì đây là số học thuần — và vì nó phải
 * khớp đúng cách server tính, nếu lệch thì màn hình nhảy số khi dữ liệu thật về.
 */
export function applyToggle(
  snapshot: ProgressSnapshot,
  { lessonId, courseId, completed }: LessonToggle,
): ProgressSnapshot {
  const already = snapshot.completed_lesson_ids.includes(lessonId);
  if (already === completed) {
    return snapshot;
  }

  const delta = completed ? 1 : -1;
  // Ngày cuối của week luôn là hôm nay, nên XP và chấm hôm nay đổi cùng nhau.
  const week = snapshot.week.map((day, index) =>
    index === snapshot.week.length - 1
      ? {
          ...day,
          completed_lessons: Math.max(0, day.completed_lessons + delta),
        }
      : day,
  );

  return {
    ...snapshot,
    completed_lesson_ids: completed
      ? [lessonId, ...snapshot.completed_lesson_ids]
      : snapshot.completed_lesson_ids.filter((id) => id !== lessonId),
    courses: snapshot.courses.map((course) =>
      course.course_id === courseId
        ? { ...course, completed_count: course.completed_count + delta }
        : course,
    ),
    latest_course_id: completed ? courseId : snapshot.latest_course_id,
    today_xp: Math.max(0, snapshot.today_xp + delta * snapshot.xp_per_lesson),
    week,
  };
}

