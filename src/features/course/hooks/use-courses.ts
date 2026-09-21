"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchCourses } from "../api";
import type { CourseFilters, CourseList } from "../types";
import { courseKeys } from "./query-keys";

type UseCoursesOptions = {
  /**
   * Trang đầu do Server Component lấy sẵn. Truyền vào để lần render đầu không
   * phải fetch lại trên client.
   */
  initialPage?: CourseList;
};

/**
 * Danh sách khoá học phân trang keyset. Con trỏ là chuỗi mờ của API nên hook
 * chỉ chuyển tiếp nguyên văn, không tự dựng.
 */
export function useCourses(
  filters: CourseFilters = {},
  { initialPage }: UseCoursesOptions = {},
) {
  return useInfiniteQuery({
    queryKey: courseKeys.list(filters),
    queryFn: ({ pageParam, signal }) =>
      fetchCourses({ ...filters, cursor: pageParam ?? undefined }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: CourseList) => lastPage.next_cursor,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [null] }
      : undefined,
  });
}
