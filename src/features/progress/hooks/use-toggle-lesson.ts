"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeLesson, uncompleteLesson } from "../api";
import type { ProgressSnapshot } from "../types";

import { progressKeys } from "./query-keys";

type Toggle = { lessonId: string; courseId: string; completed: boolean };

/**
 * Cập nhật lạc quan rồi mới gọi API: người học bấm xong bài thì dấu tích phải
 * hiện ngay, không đợi một vòng mạng. Lỗi thì trả lại đúng snapshot trước đó.
 */
export function useToggleLessonComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, completed }: Toggle) =>
      completed ? completeLesson(lessonId) : uncompleteLesson(lessonId),

    onMutate: async (toggle: Toggle) => {
      await queryClient.cancelQueries({ queryKey: progressKeys.snapshot() });
      const previous = queryClient.getQueryData<ProgressSnapshot>(
        progressKeys.snapshot(),
      );

      if (previous) {
        queryClient.setQueryData(
          progressKeys.snapshot(),
          applyToggle(previous, toggle),
        );
      }
      return { previous };
    },

    onError: (_error, _toggle, context) => {
      if (context?.previous) {
        queryClient.setQueryData(progressKeys.snapshot(), context.previous);
      }
    },

    // Dù thành công hay thất bại cũng đọc lại: số đếm của khoá do server tính.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: progressKeys.snapshot() });
    },
  });
}

function applyToggle(
  snapshot: ProgressSnapshot,
  { lessonId, courseId, completed }: Toggle,
): ProgressSnapshot {
  const already = snapshot.completed_lesson_ids.includes(lessonId);
  if (already === completed) {
    return snapshot;
  }

  return {
    completed_lesson_ids: completed
      ? [lessonId, ...snapshot.completed_lesson_ids]
      : snapshot.completed_lesson_ids.filter((id) => id !== lessonId),
    courses: snapshot.courses.map((course) =>
      course.course_id === courseId
        ? {
            ...course,
            completed_count: course.completed_count + (completed ? 1 : -1),
          }
        : course,
    ),
    latest_course_id: completed ? courseId : snapshot.latest_course_id,
  };
}
