import type { components } from "@/lib/api/schema";

export type PracticeQuestion = components["schemas"]["PracticeQuestion"];
export type PracticeKind = components["schemas"]["PracticeKind"];
export type PracticeResult = components["schemas"]["PracticeResult"];

/** Số câu mỗi lượt; khớp mặc định của API. */
export const SESSION_SIZE = 10;

export const KIND_LABELS: Record<PracticeKind, string> = {
  multiple_choice: "Chọn nghĩa đúng",
  fill_blank: "Điền từ còn thiếu",
  listen_choose: "Nghe và chọn từ",
};
