import "server-only";

import { cache } from "react";

import { serverFetch } from "@/lib/api/server-client";

import type { PracticeQuestion } from "./types";

/**
 * Phiên đầu tiên đọc sẵn ở server để người học thấy câu hỏi ngay trong HTML
 * đầu tiên. Khách chưa đăng nhập nhận phiên rỗng — màn hình tự nói ra điều đó.
 */
export const readSession = cache(async function readSession(
  size: number,
): Promise<PracticeQuestion[]> {
  const response = await serverFetch(`/me/practice/session?size=${size}`);

  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`Không dựng được phiên luyện tập (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { questions: PracticeQuestion[] };
  return body.questions;
});
