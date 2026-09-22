"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeLesson, uncompleteLesson } from "../api";
import { applyToggle, type LessonToggle } from "../optimistic";
import type { ProgressSnapshot } from "../types";

import { progressKeys } from "./query-keys";

/**
 * Cập nhật lạc quan rồi mới gọi API: người học bấm xong bài thì dấu tích phải
 * hiện ngay, không đợi một vòng mạng. Lỗi thì trả lại đúng snapshot trước đó.
 */
export function useToggleLessonComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, completed }: LessonToggle) =>
      completed ? completeLesson(lessonId) : uncompleteLesson(lessonId),

    onMutate: async (toggle: LessonToggle) => {
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
