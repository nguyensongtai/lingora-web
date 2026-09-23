import type { VocabularyEntry } from "@/features/vocabulary/types";

import type { LessonBlock, LessonDetail } from "./types";

/**
 * Số từ tối thiểu để API dựng được câu trắc nghiệm (MinOptions ở gói practice).
 * Ít hơn thì bước luyện tập chỉ có một thông báo "chưa đủ từ", nên bỏ hẳn bước.
 */
export const MIN_PRACTICE_WORDS = 3;

/**
 * Một bước của bài học, theo khuôn Babbel/Busuu: gặp từ → nghe chúng trong hội
 * thoại → hiểu cách dùng → tự luyện.
 *
 * Bước sinh ra từ dữ liệu chứ không lưu: từ vựng đã thuộc về bài, còn khối nội
 * dung chia theo dạng — hội thoại vào bước Hội thoại, ghi chú và câu mẫu vào
 * bước Cách dùng. Không có cột nào phải giữ đồng bộ, và người soạn không phải
 * chọn bước cho từng khối.
 */
export type LessonStep =
  | { key: "vocabulary"; title: string; caption: string; words: VocabularyEntry[] }
  | { key: "dialogue"; title: string; caption: string; blocks: LessonBlock[] }
  | { key: "usage"; title: string; caption: string; blocks: LessonBlock[] }
  | { key: "practice"; title: string; caption: string };

export type LessonStepKey = LessonStep["key"];

/**
 * Dựng các bước cho một bài. Bước nào không có gì để hiện thì bỏ, thay vì hiện
 * một bước rỗng — bước rỗng chính là cảm giác "bài này thiếu gì đó".
 *
 * Bước ③ tên là "Cách dùng" chứ không phải "Ngữ pháp": một nửa số bài là bài
 * từ vựng hay sắc thái nghĩa, gọi phần giải thích của chúng là ngữ pháp thì sai.
 */
export function buildSteps(lesson: Pick<LessonDetail, "blocks" | "vocabulary">): LessonStep[] {
  const steps: LessonStep[] = [];
  const words = lesson.vocabulary;
  const dialogue = lesson.blocks.filter((block) => block.kind === "dialogue");
  // Câu mẫu trùng nguyên văn câu ví dụ của một từ thì đã hiện ở bước Từ vựng;
  // hiện lại ở đây chỉ làm bước Cách dùng thành bản sao của bước đầu.
  const shown = new Set(words.map((entry) => normaliseSentence(entry.example)).filter(Boolean));
  // Giữ đúng thứ tự người soạn: ghi chú thường dẫn vào câu mẫu ngay sau nó.
  const usage = lesson.blocks.filter(
    (block) =>
      block.kind === "note" ||
      (block.kind === "example" && !shown.has(normaliseSentence(block.text_en))),
  );

  if (words.length > 0) {
    steps.push({ key: "vocabulary", title: "Từ vựng", caption: `${words.length} từ`, words });
  }
  if (dialogue.length > 0) {
    steps.push({
      key: "dialogue",
      title: "Hội thoại",
      caption: `${dialogue.length} lượt`,
      blocks: dialogue,
    });
  }
  if (usage.length > 0) {
    const examples = usage.filter((block) => block.kind === "example").length;
    steps.push({
      key: "usage",
      title: "Cách dùng",
      caption: examples > 0 ? `${examples} câu mẫu` : "ghi chú",
      blocks: usage,
    });
  }
  if (words.length >= MIN_PRACTICE_WORDS) {
    steps.push({ key: "practice", title: "Luyện tập", caption: "tự kiểm tra" });
  }
  return steps;
}

function normaliseSentence(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Thứ tự người nói xuất hiện lần đầu. Dùng để xếp lượt thoại hai bên trái phải:
 * người nói trước ở bên trái, như một khung chat.
 */
export function speakerSides(blocks: LessonBlock[]): Map<string, "start" | "end"> {
  const sides = new Map<string, "start" | "end">();
  for (const block of blocks) {
    if (block.kind === "dialogue" && !sides.has(block.speaker)) {
      sides.set(block.speaker, sides.size % 2 === 0 ? "start" : "end");
    }
  }
  return sides;
}
