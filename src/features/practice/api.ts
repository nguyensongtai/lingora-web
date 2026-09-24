import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import {
  sessionQuery,
  type LessonPracticeScore,
  type PracticeKind,
  type PracticeQuestion,
  type PracticeResult,
  type PracticeScope,
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

export async function fetchSession(scope: PracticeScope): Promise<PracticeQuestion[]> {
  const body = await callMe<{ questions: PracticeQuestion[] }>(
    `/api/me/practice/session?${sessionQuery(scope)}`,
  );
  return body.questions;
}

/**
 * Chấm ở server chứ không so chuỗi ở client: client có sẵn đáp án trong DOM,
 * nên tự chấm thì con số đúng/sai không nói lên điều gì — và server còn phải
 * biết câu sai để đẩy từ về hàng đợi ôn.
 */
export function checkAnswer(input: {
  scope: PracticeScope;
  entryId: string;
  kind: PracticeKind;
  answer: string;
}): Promise<PracticeResult> {
  return callMe<PracticeResult>("/api/me/practice/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entry_id: input.entryId,
      kind: input.kind,
      answer: input.answer,
      // Thiếu lesson_id thì API chấm như ôn tập và phạt câu sai — gửi nhầm
      // phạm vi là đẩy từ của một bài chưa học vào lịch ôn.
      ...(input.scope.kind === "lesson" ? { lesson_id: input.scope.lessonId } : {}),
    }),
  });
}

export async function fetchLessonScores(signal?: AbortSignal): Promise<LessonPracticeScore[]> {
  const body = await callMe<{ items: LessonPracticeScore[] }>("/api/me/practice/scores", { signal });
  return body.items;
}

/**
 * Ghi kết quả một lượt luyện trong bài. Điểm do phía trước đếm — server chấm
 * từng câu nhưng không giữ phiên — và không đổi ra XP.
 */
export function recordLessonScore(input: {
  lessonId: string;
  correct: number;
  total: number;
}): Promise<LessonPracticeScore> {
  return callMe<LessonPracticeScore>(
    `/api/me/practice/lessons/${encodeURIComponent(input.lessonId)}/score`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correct: input.correct, total: input.total }),
    },
  );
}
