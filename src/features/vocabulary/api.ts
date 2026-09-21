import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import type {
  Grade,
  VocabularyCard,
  VocabularyEntry,
  VocabularyState,
  VocabularyStats,
  VocabularyReview,
} from "./types";

/** Như mọi thứ của riêng người dùng, đi qua Route Handler chứ không gọi thẳng API. */
async function callMe<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }
  return (await response.json()) as T;
}

export async function fetchVocabulary(
  state?: VocabularyState,
): Promise<VocabularyCard[]> {
  const query = state ? `?state=${state}` : "";
  const body = await callMe<{ items: VocabularyCard[] }>(
    `/api/me/vocabulary${query}`,
  );
  return body.items;
}

export function fetchVocabularyStats(): Promise<VocabularyStats> {
  return callMe<VocabularyStats>("/api/me/vocabulary/stats");
}

export function reviewEntry(
  entryId: string,
  grade: Grade,
): Promise<VocabularyReview> {
  return callMe<VocabularyReview>(`/api/me/vocabulary/${entryId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grade }),
  });
}

/* ---------- thao tác quản trị ---------- */

export type EntryInput = {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  example_vi: string;
};

export function createEntry(
  lessonId: string,
  input: EntryInput,
): Promise<VocabularyEntry> {
  return callMe<VocabularyEntry>("/api/admin/vocabulary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_id: lessonId, ...input }),
  });
}

export function updateEntry(
  entryId: string,
  input: Partial<EntryInput>,
): Promise<VocabularyEntry> {
  return callMe<VocabularyEntry>(`/api/admin/vocabulary/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteEntry(entryId: string): Promise<void> {
  const response = await fetch(`/api/admin/vocabulary/${entryId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }
}
