"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createCourse, deleteCourse, updateCourse } from "../api";
import type { CourseCreate, CourseUpdate } from "../types";
import { courseKeys } from "./query-keys";

/**
 * Sau mỗi thay đổi phải làm hai việc: bỏ cache của TanStack cho phần client, và
 * router.refresh() để Server Component (bảng quản trị, trang công khai) đọc lại
 * dữ liệu mới.
 */
function useCourseInvalidation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (courseId?: string) => {
    void queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    if (courseId) {
      void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    }
    router.refresh();
  };
}

export function useCreateCourse() {
  const invalidate = useCourseInvalidation();

  return useMutation({
    mutationFn: (input: CourseCreate) => createCourse(input),
    onSuccess: (course) => invalidate(course.id),
  });
}

export function useUpdateCourse(courseId: string) {
  const invalidate = useCourseInvalidation();

  return useMutation({
    mutationFn: (input: CourseUpdate) => updateCourse(courseId, input),
    onSuccess: () => invalidate(courseId),
  });
}

export function useDeleteCourse() {
  const invalidate = useCourseInvalidation();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: (_result, courseId) => invalidate(courseId),
  });
}
