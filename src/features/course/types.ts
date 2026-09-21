import type { components } from "@/lib/api/schema";

export type Course = components["schemas"]["Course"];
export type CourseList = components["schemas"]["CourseList"];
export type CourseLevel = components["schemas"]["CourseLevel"];
export type CourseStatus = components["schemas"]["CourseStatus"];
export type CourseCreate = components["schemas"]["CourseCreate"];
export type CourseUpdate = components["schemas"]["CourseUpdate"];
export type Lesson = components["schemas"]["Lesson"];
export type LessonList = components["schemas"]["LessonList"];
export type LessonCreate = components["schemas"]["LessonCreate"];
export type LessonUpdate = components["schemas"]["LessonUpdate"];

/** Tham số lọc và phân trang của GET /courses. */
export type ListCoursesQuery = {
  status?: CourseStatus;
  level?: CourseLevel;
  page_size?: number;
  cursor?: string;
};

/** Phần lọc của query, dùng làm query key nên không chứa cursor. */
export type CourseFilters = Omit<ListCoursesQuery, "cursor">;

export const COURSE_LEVELS: readonly CourseLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  A1: "Sơ cấp 1",
  A2: "Sơ cấp 2",
  B1: "Trung cấp 1",
  B2: "Trung cấp 2",
  C1: "Cao cấp 1",
  C2: "Cao cấp 2",
};

export const STATUS_LABELS: Record<CourseStatus, string> = {
  draft: "Nháp",
  published: "Đã xuất bản",
};
