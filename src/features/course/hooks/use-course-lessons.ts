"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCourseLessons } from "../api";
import type { Lesson } from "../types";
import { courseKeys } from "./query-keys";

/**
 * Bài học của một khoá. API đã sắp xếp theo position nên hook giữ nguyên thứ tự.
 */
export function useCourseLessons(courseId: string, initialData?: Lesson[]) {
  return useQuery({
    queryKey: courseKeys.lessons(courseId),
    queryFn: async ({ signal }) => (await fetchCourseLessons(courseId, signal)).items,
    initialData,
    enabled: courseId !== "",
  });
}
