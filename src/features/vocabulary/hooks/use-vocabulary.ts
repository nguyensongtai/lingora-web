"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchVocabulary, fetchVocabularyStats, reviewEntry } from "../api";
import type {
  Grade,
  VocabularyCard,
  VocabularyState,
  VocabularyStats,
} from "../types";

import { vocabularyKeys } from "./query-keys";

/** Toàn bộ từ đã mở khoá; lọc theo nhóm làm ở phía trước để đổi tab không phải gọi lại. */
export function useVocabulary(initialData: VocabularyCard[]) {
  return useQuery({
    queryKey: vocabularyKeys.list(undefined),
    queryFn: () => fetchVocabulary(),
    initialData,
  });
}

export function useVocabularyStats(initialData: VocabularyStats) {
  return useQuery({
    queryKey: vocabularyKeys.stats(),
    queryFn: () => fetchVocabularyStats(),
    initialData,
  });
}

/**
 * Chấm một thẻ. Không cập nhật lạc quan: lịch tiếp theo do SM-2 phía server
 * tính, đoán trước ở đây là chép lại thuật toán lần thứ hai.
 */
export function useReviewEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, grade }: { entryId: string; grade: Grade }) =>
      reviewEntry(entryId, grade),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vocabularyKeys.all });
    },
  });
}

/** Lọc tại chỗ theo nhóm; server đã gán sẵn state cho từng thẻ. */
export function cardsInState(
  cards: VocabularyCard[],
  state: VocabularyState,
): VocabularyCard[] {
  return cards.filter((card) => card.state === state);
}
