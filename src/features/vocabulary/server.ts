import "server-only";

import { cache } from "react";

import { serverFetch } from "@/lib/api/server-client";

import { EMPTY_STATS, type VocabularyCard, type VocabularyStats } from "./types";

/** Khách chưa đăng nhập không tới được màn này, nhưng 401 vẫn thành rỗng. */
export const readVocabulary = cache(async function readVocabulary(): Promise<
  VocabularyCard[]
> {
  const response = await serverFetch("/me/vocabulary");
  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`Không đọc được từ vựng (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { items: VocabularyCard[] };
  return body.items;
});

export const readVocabularyStats = cache(
  async function readVocabularyStats(): Promise<VocabularyStats> {
    const response = await serverFetch("/me/vocabulary/stats");
    if (response.status === 401) {
      return EMPTY_STATS;
    }
    if (!response.ok) {
      throw new Error(`Không đọc được thống kê từ vựng (HTTP ${response.status}).`);
    }

    return (await response.json()) as VocabularyStats;
  },
);
