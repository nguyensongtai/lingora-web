import type { VocabularyState } from "../types";

export const vocabularyKeys = {
  all: ["vocabulary"] as const,
  lists: () => [...vocabularyKeys.all, "list"] as const,
  list: (state: VocabularyState | undefined) =>
    [...vocabularyKeys.lists(), state ?? "all"] as const,
  stats: () => [...vocabularyKeys.all, "stats"] as const,
};
