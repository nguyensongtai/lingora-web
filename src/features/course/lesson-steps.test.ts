import { describe, expect, it } from "vitest";

import type { VocabularyEntry } from "@/features/vocabulary/types";

import { MIN_PRACTICE_WORDS, buildSteps, speakerSides } from "./lesson-steps";
import type { LessonBlock } from "./types";

function note(body: string): LessonBlock {
  return { kind: "note", body, text_en: "", text_vi: "", speaker: "" };
}

function example(textEn: string): LessonBlock {
  return { kind: "example", body: "", text_en: textEn, text_vi: "", speaker: "" };
}

function line(speaker: string, textEn: string): LessonBlock {
  return { kind: "dialogue", body: "", text_en: textEn, text_vi: "", speaker };
}

function words(count: number): VocabularyEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `w-${index}`,
    lesson_id: "lesson-1",
    word: `word${index}`,
    ipa: "",
    meaning: `nghĩa ${index}`,
    example: "",
    example_vi: "",
    position: index,
    created_at: "2026-09-23T00:00:00Z",
    updated_at: "2026-09-23T00:00:00Z",
  }));
}

describe("buildSteps", () => {
  it("một bài đủ nội dung đi qua bốn bước theo đúng thứ tự", () => {
    const steps = buildSteps({
      vocabulary: words(6),
      blocks: [note("a/an theo âm"), line("Mai", "Hi."), example("An hour."), line("Tom", "Hello.")],
    });

    expect(steps.map((step) => step.key)).toEqual(["vocabulary", "dialogue", "usage", "practice"]);
  });

  it("chia khối theo dạng nhưng giữ thứ tự người soạn trong từng bước", () => {
    const steps = buildSteps({
      vocabulary: [],
      blocks: [note("một"), line("Mai", "Hi."), example("hai"), note("ba"), line("Tom", "Hello.")],
    });

    const dialogue = steps.find((step) => step.key === "dialogue");
    const usage = steps.find((step) => step.key === "usage");
    expect(dialogue?.key === "dialogue" && dialogue.blocks.map((b) => b.text_en)).toEqual(["Hi.", "Hello."]);
    expect(usage?.key === "usage" && usage.blocks.map((b) => b.body || b.text_en)).toEqual([
      "một",
      "hai",
      "ba",
    ]);
  });

  it("bỏ hẳn bước không có gì để hiện", () => {
    const steps = buildSteps({ vocabulary: words(6), blocks: [note("chỉ có ghi chú")] });

    expect(steps.map((step) => step.key)).toEqual(["vocabulary", "usage", "practice"]);
  });

  /**
   * Dưới ngưỡng này API trả phiên rỗng, và bước luyện tập chỉ còn là một câu
   * "chưa đủ từ". Bỏ bước thì người học không bị dẫn tới một ngõ cụt.
   */
  it("không có bước luyện tập khi quá ít từ để dựng câu trắc nghiệm", () => {
    const few = buildSteps({ vocabulary: words(MIN_PRACTICE_WORDS - 1), blocks: [] });
    const enough = buildSteps({ vocabulary: words(MIN_PRACTICE_WORDS), blocks: [] });

    expect(few.map((step) => step.key)).toEqual(["vocabulary"]);
    expect(enough.map((step) => step.key)).toEqual(["vocabulary", "practice"]);
  });

  /**
   * Seed đầu tiên lấy thẳng câu ví dụ của từ làm câu mẫu. Khi từ vựng chưa hiện
   * trên trang bài thì không ai thấy; đặt hai bước cạnh nhau thì bước Cách dùng
   * chỉ còn là bản sao.
   */
  it("bỏ câu mẫu đã hiện ở bước Từ vựng", () => {
    const vocabulary = words(3);
    vocabulary[0].example = "We waited for an hour.";

    const steps = buildSteps({
      vocabulary,
      blocks: [note("a/an theo âm"), example("We  waited for an HOUR."), example("An honest man.")],
    });

    const usage = steps.find((step) => step.key === "usage");
    expect(usage?.key === "usage" && usage.blocks.map((b) => b.body || b.text_en)).toEqual([
      "a/an theo âm",
      "An honest man.",
    ]);
  });

  it("bài rỗng không có bước nào", () => {
    expect(buildSteps({ vocabulary: [], blocks: [] })).toEqual([]);
  });

  it("chú thích đếm đúng thứ nằm trong bước", () => {
    const steps = buildSteps({
      vocabulary: words(6),
      blocks: [note("n"), example("e1"), example("e2"), line("Mai", "Hi.")],
    });

    expect(Object.fromEntries(steps.map((step) => [step.key, step.caption]))).toEqual({
      vocabulary: "6 từ",
      dialogue: "1 lượt",
      usage: "2 câu mẫu",
      practice: "tự kiểm tra",
    });
  });
});

describe("speakerSides", () => {
  it("người nói trước ở bên trái, người sau ở bên phải, theo lần xuất hiện đầu", () => {
    const sides = speakerSides([line("Tom", "a"), line("Mai", "b"), line("Tom", "c")]);

    expect(sides.get("Tom")).toBe("start");
    expect(sides.get("Mai")).toBe("end");
  });
});
