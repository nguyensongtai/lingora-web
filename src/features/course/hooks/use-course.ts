"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCourse } from "../api";
import type { Course } from "../types";
import { courseKeys } from "./query-keys";

export function useCourse(courseId: string, initialData?: Course) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: ({ signal }) => fetchCourse(courseId, signal),
    initialData,
    enabled: courseId !== "",
  });
}
