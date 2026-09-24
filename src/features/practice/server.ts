import "server-only";

import { cache } from "react";

import { serverFetch } from "@/lib/api/server-client";

import {
  sessionQuery,
  type LessonPracticeScore,
  type PracticeQuestion,
  type PracticeScope,
} from "./types";

/**
 * Phiên đầu tiên đọc sẵn ở server để người học thấy câu hỏi ngay trong HTML
 * đầu tiên. Khách chưa đăng nhập nhận phiên rỗng — màn hình tự nói ra điều đó.
 */
export function readSession(scope: PracticeScope): Promise<PracticeQuestion[]> {
  // cache() so tham số bằng Object.is, nên một object scope mới mỗi lần gọi sẽ
  // không bao giờ trúng. Khoá bằng chuỗi query thì trúng.
  return readSessionByQuery(sessionQuery(scope));
}

const readSessionByQuery = cache(async function readSessionByQuery(
  query: string,
): Promise<PracticeQuestion[]> {
  const response = await serverFetch(`/me/practice/session?${query}`);

  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`Không dựng được phiên luyện tập (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { questions: PracticeQuestion[] };
  return body.questions;
});

/**
 * Điểm luyện tập tốt nhất ở mọi bài. Hỏng thì trả danh sách rỗng: điểm chỉ là
 * thông tin phụ, không đáng làm sập trang bài hay trang khoá.
 */
export const readLessonScores = cache(async function readLessonScores(): Promise<
  LessonPracticeScore[]
> {
  const response = await serverFetch("/me/practice/scores").catch(() => null);
  if (!response?.ok) {
    return [];
  }
  const body = (await response.json()) as { items: LessonPracticeScore[] };
  return body.items;
});
