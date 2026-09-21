import type { components } from "@/lib/api/schema";

export type VocabularyCard = components["schemas"]["VocabularyCard"];
export type VocabularyEntry = components["schemas"]["VocabularyEntry"];
export type VocabularyState = components["schemas"]["VocabularyState"];
export type VocabularyStats = components["schemas"]["VocabularyStats"];
export type VocabularyReview = components["schemas"]["VocabularyReview"];

export type Grade = "remembered" | "forgot";

export const EMPTY_STATS: VocabularyStats = {
  learned: 0,
  due_today: 0,
  mastered: 0,
  new_this_week: 0,
};

export const STATE_LABELS: Record<VocabularyState, string> = {
  due: "Đến hạn",
  learning: "Đang học",
  mastered: "Thành thạo",
};

export const VOCABULARY_STATES: readonly VocabularyState[] = [
  "due",
  "learning",
  "mastered",
];

/** Nhịp đọc trung bình của một lượt ôn, dùng để ước lượng thời gian. */
const SECONDS_PER_CARD = 17;

export function estimateMinutes(cards: number): number {
  return Math.max(1, Math.round((cards * SECONDS_PER_CARD) / 60));
}
