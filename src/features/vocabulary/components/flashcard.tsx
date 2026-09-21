"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { useReviewEntry } from "../hooks/use-vocabulary";
import type { VocabularyCard } from "../types";

/**
 * Thẻ ôn nhanh. Mặt trước là từ, chạm để lật sang nghĩa và câu ví dụ; chấm xong
 * thì thẻ tiếp theo tự lên và luôn quay về mặt trước.
 */
export function Flashcard({ queue }: { queue: VocabularyCard[] }) {
  const [flipped, setFlipped] = useState(false);
  const review = useReviewEntry();
  const card = queue[0];

  if (!card) {
    return (
      <div className="border-border bg-card rounded-card flex min-h-60 flex-col items-center justify-center gap-2 border p-6 text-center">
        <p className="text-base font-semibold">Hết từ đến hạn rồi.</p>
        <p className="text-muted-foreground text-sm">
          Học thêm bài mới để mở khoá từ, hoặc quay lại khi tới lịch ôn.
        </p>
      </div>
    );
  }

  function grade(value: "remembered" | "forgot") {
    if (!card) {
      return;
    }
    setFlipped(false);
    review.mutate({ entryId: card.entry.id, grade: value });
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setFlipped((shown) => !shown)}
        aria-expanded={flipped}
        className={cn(
          "rounded-card border-border flex min-h-60 w-full flex-col items-start border p-6 text-left transition-colors",
          flipped ? "bg-brand-soft" : "bg-card",
        )}
      >
        {flipped ? (
          <>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
              Nghĩa
            </p>
            <p className="mt-5 text-[22px] font-bold">{card.entry.meaning}</p>
            {card.entry.example ? (
              <p
                className="mt-3 text-[15px] leading-relaxed"
                // Từ đang ôn được in đậm trong câu ví dụ, như design.
              >
                {highlight(card.entry.example, card.entry.word)}
              </p>
            ) : null}
            {card.entry.example_vi ? (
              <p className="text-muted-foreground mt-1 text-[13px]">
                {card.entry.example_vi}
              </p>
            ) : null}
            <p className="text-muted-foreground mt-auto pt-4 text-[13px]">
              Chạm để lật lại
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
              Từ · {card.level}
            </p>
            <p className="mt-6 text-3xl font-bold tracking-tight">
              {card.entry.word}
            </p>
            {card.entry.ipa ? (
              <p className="text-muted-foreground mt-1.5 text-[15px]">
                {card.entry.ipa}
              </p>
            ) : null}
            <p className="text-muted-foreground mt-auto pt-4 text-[13px]">
              Chạm để xem nghĩa
            </p>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => grade("forgot")}
          disabled={review.isPending}
          className="border-border bg-card hover:bg-secondary h-11 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-60"
        >
          Chưa nhớ
        </button>
        <button
          type="button"
          onClick={() => grade("remembered")}
          disabled={review.isPending}
          className="bg-success h-11 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
        >
          Đã nhớ
        </button>
      </div>

      <p className="text-muted-foreground text-center text-[13px]">
        Còn {queue.length} từ trong lượt này
      </p>
    </div>
  );
}

/** In đậm từ đang ôn trong câu ví dụ, không phân biệt hoa thường. */
function highlight(sentence: string, word: string) {
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (index < 0) {
    return sentence;
  }

  return (
    <>
      {sentence.slice(0, index)}
      <b className="font-bold">{sentence.slice(index, index + word.length)}</b>
      {sentence.slice(index + word.length)}
    </>
  );
}
