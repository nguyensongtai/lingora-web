import type { CourseFilters } from "../types";

/**
 * Query key factory: mọi key của domain course đều bắt nguồn từ đây, nên
 * invalidate theo nhánh (tất cả / danh sách / một khoá) luôn đúng.
 */
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (courseId: string) => [...courseKeys.details(), courseId] as const,
  bySlug: (slug: string) => [...courseKeys.all, "slug", slug] as const,
  lessons: (courseId: string) =>
    [...courseKeys.detail(courseId), "lessons"] as const,
} as const;
