import type { components } from "@/lib/api/schema";

export type PracticeQuestion = components["schemas"]["PracticeQuestion"];
export type PracticeKind = components["schemas"]["PracticeKind"];
export type PracticeResult = components["schemas"]["PracticeResult"];

/** Số câu mỗi lượt; khớp mặc định của API. */
export const SESSION_SIZE = 10;

/**
 * Luyện gì: ôn vốn từ đã mở khoá, hay luyện từ của một bài.
 *
 * Hai phạm vi khác nhau ở một điểm quan trọng: ôn tập phạt câu sai vào lịch
 * SM-2, còn luyện trong bài thì không — đó là lần gặp đầu chứ chưa phải ôn.
 */
export type PracticeScope = { kind: "review" } | { kind: "lesson"; lessonId: string };

/** Query của GET /me/practice/session cho một phạm vi. */
export function sessionQuery(scope: PracticeScope): string {
  const params = new URLSearchParams(
    scope.kind === "lesson" ? { lesson_id: scope.lessonId } : { size: String(SESSION_SIZE) },
  );
  return params.toString();
}

export const KIND_LABELS: Record<PracticeKind, string> = {
  multiple_choice: "Chọn nghĩa đúng",
  fill_blank: "Điền từ còn thiếu",
  listen_choose: "Nghe và chọn từ",
};
