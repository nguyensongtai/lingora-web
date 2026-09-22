import {
  COURSE_LEVELS,
  type Course,
  type CourseLevel,
} from "@/features/course/types";

import type { ProgressSnapshot } from "./types";

export type LevelRow = {
  level: CourseLevel;
  done: number;
  total: number;
};


export function percent(row: LevelRow): number {
  return row.total === 0 ? 0 : Math.round((row.done / row.total) * 100);
}

export function summariseLevels(courses: Course[], snapshot: ProgressSnapshot): LevelRow[] {
  const byCourse = new Map(
    snapshot.courses.map((course) => [course.course_id, course]),
  );

  return COURSE_LEVELS.map((level) => {
    let done = 0;
    let total = 0;

    for (const course of courses) {
      if (course.level !== level) {
        continue;
      }
      const progress = byCourse.get(course.id);
      // Khoá không có trong snapshot nghĩa là chưa có bài nào — mẫu số 0, và
      // nó vẫn phải được cộng vào để tỉ lệ không nhảy khi bài đầu tiên xuất hiện.
      done += progress?.completed_count ?? 0;
      total += progress?.lesson_count ?? 0;
    }

    return { level, done, total };
  });
}
