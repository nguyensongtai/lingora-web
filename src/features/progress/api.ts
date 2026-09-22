import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import type { ProgressHistory, ProgressSnapshot } from "./types";

/**
 * Tiến độ luôn đi qua Route Handler của Next chứ không gọi thẳng API: access
 * token nằm trong httpOnly cookie và chỉ server đọc được.
 */
async function callMe<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function fetchProgress(): Promise<ProgressSnapshot> {
  return callMe<ProgressSnapshot>("/api/me/progress");
}

export function completeLesson(lessonId: string): Promise<void> {
  return callMe<void>(`/api/me/progress/lessons/${lessonId}`, { method: "PUT" });
}

export function uncompleteLesson(lessonId: string): Promise<void> {
  return callMe<void>(`/api/me/progress/lessons/${lessonId}`, {
    method: "DELETE",
  });
}

export function fetchHistory(days: number): Promise<ProgressHistory> {
  return callMe<ProgressHistory>(`/api/me/progress/history?days=${days}`);
}
