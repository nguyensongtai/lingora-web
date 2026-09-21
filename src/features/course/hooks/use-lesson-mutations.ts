"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  createLesson,
  deleteLesson,
  reorderLessons,
  updateLesson,
} from "../api";
import type { LessonCreate, LessonUpdate } from "../types";
import { courseKeys } from "./query-keys";

/**
 * Mọi thay đổi bài học đều ảnh hưởng tới danh sách bài của khoá, nên cùng một
 * cách dọn cache: bỏ query lessons của khoá rồi để Server Component đọc lại.
 */
function useLessonInvalidation(courseId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    void queryClient.invalidateQueries({ queryKey: courseKeys.lessons(courseId) });
    router.refresh();
  };
}

export function useCreateLesson(courseId: string) {
  const invalidate = useLessonInvalidation(courseId);

  return useMutation({
    mutationFn: (input: LessonCreate) => createLesson(courseId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateLesson(courseId: string) {
  const invalidate = useLessonInvalidation(courseId);

  return useMutation({
    mutationFn: ({ lessonId, input }: { lessonId: string; input: LessonUpdate }) =>
      updateLesson(lessonId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteLesson(courseId: string) {
  const invalidate = useLessonInvalidation(courseId);

  return useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: invalidate,
  });
}

/** Danh sách gửi lên phải đủ tập bài của khoá; API từ chối nếu thiếu hoặc trùng. */
export function useReorderLessons(courseId: string) {
  const invalidate = useLessonInvalidation(courseId);

  return useMutation({
    mutationFn: (lessonIds: string[]) => reorderLessons(courseId, lessonIds),
    onSuccess: invalidate,
  });
}
