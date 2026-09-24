"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchLessonScores, recordLessonScore } from "../api";
import type { LessonPracticeScore } from "../types";

import { practiceKeys } from "./query-keys";

/**
 * Điểm luyện tập tốt nhất ở mọi bài. Một query cho cả danh sách bài lẫn bước
 * Luyện tập: xong một lượt thì cả hai chỗ đổi theo.
 */
export function useLessonScores(initialData: LessonPracticeScore[]) {
  return useQuery({
    queryKey: practiceKeys.scores(),
    queryFn: ({ signal }) => fetchLessonScores(signal),
    initialData,
  });
}

/** Ghi kết quả một lượt; server trả lại điểm tốt nhất sau khi ghi. */
export function useRecordLessonScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordLessonScore,
    onSuccess: (saved) => {
      queryClient.setQueryData<LessonPracticeScore[]>(practiceKeys.scores(), (current = []) => [
        saved,
        ...current.filter((score) => score.lesson_id !== saved.lesson_id),
      ]);
    },
  });
}

/** Điểm của một bài; undefined khi chưa luyện lần nào. */
export function scoreOf(
  scores: LessonPracticeScore[],
  lessonId: string,
): LessonPracticeScore | undefined {
  return scores.find((score) => score.lesson_id === lessonId);
}
