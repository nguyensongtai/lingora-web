"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  cardsInState,
  useVocabulary,
  useVocabularyStats,
} from "../hooks/use-vocabulary";
import {
  STATE_LABELS,
  VOCABULARY_STATES,
  estimateMinutes,
  type VocabularyCard,
  type VocabularyState,
  type VocabularyStats,
} from "../types";

import { Flashcard } from "./flashcard";
import { PronounceButton } from "./pronounce-button";

export function VocabularyScreen({
  initialCards,
  initialStats,
}: {
  initialCards: VocabularyCard[];
  initialStats: VocabularyStats;
}) {
  const [tab, setTab] = useState<VocabularyState>("due");
  const { data: cards } = useVocabulary(initialCards);
  const { data: stats } = useVocabularyStats(initialStats);

  const due = cardsInState(cards, "due");
  const visible = cardsInState(cards, tab);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] leading-tight font-bold tracking-tight">
            Từ vựng{" "}
            <span className="text-muted-foreground text-base font-medium">
              · Vocabulary
            </span>
          </h1>
          <p className="text-muted-foreground mt-1.5">
            {due.length === 0
              ? "Không có từ nào đến hạn ôn hôm nay."
              : `${due.length} từ đến hạn ôn hôm nay · khoảng ${estimateMinutes(due.length)} phút`}
          </p>
        </div>
      </div>

      <div className="border-border bg-border grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px overflow-hidden rounded-card border">
        {[
          ["Đã học", stats.learned],
          ["Đến hạn hôm nay", stats.due_today],
          ["Thành thạo", stats.mastered],
          ["Từ mới tuần này", stats.new_this_week],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-card px-5 py-4">
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="mt-0.5 text-[22px] font-bold tracking-tight tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <section className="grid items-start gap-6 min-[720px]:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="bg-secondary flex max-w-full gap-1 self-start overflow-x-auto rounded-lg p-1">
            {VOCABULARY_STATES.map((state) => {
              const count = cardsInState(cards, state).length;
              return (
                <button
                  key={state}
                  type="button"
                  onClick={() => setTab(state)}
                  aria-pressed={tab === state}
                  className={cn(
                    "h-9 rounded-lg px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors",
                    tab === state
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  {STATE_LABELS[state]} · {count}
                </button>
              );
            })}
          </div>

          <div className="border-border bg-card rounded-card border px-2 py-1">
            {visible.length === 0 ? (
              <p className="text-muted-foreground px-2.5 py-6 text-center text-sm">
                Chưa có từ nào trong nhóm này.
              </p>
            ) : (
              <ul>
                {visible.map((card) => (
                  <li
                    key={card.entry.id}
                    className="border-border flex min-h-16 items-center gap-3.5 border-b p-3 last:border-b-0"
                  >
                    <PronounceButton word={card.entry.word} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-base font-semibold">
                          {card.entry.word}
                        </span>
                        {card.entry.ipa ? (
                          <span className="text-muted-foreground text-[13px]">
                            {card.entry.ipa}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground truncate text-[13px]">
                        {card.entry.meaning}
                      </p>
                    </div>
                    <div className="flex flex-none flex-col items-end gap-1">
                      <FamiliarityBar value={card.familiarity} />
                      <span
                        className={cn(
                          "text-[11px] font-semibold",
                          card.review === null
                            ? "text-success"
                            : "text-brand-strong",
                        )}
                      >
                        {card.review === null ? "Mới" : STATE_LABELS[card.state]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-muted-foreground text-[15px] font-semibold">
            Thẻ ôn nhanh · Flashcard
          </h2>
          <Flashcard queue={due} />
        </div>
      </section>
    </>
  );
}

/** Vạch 5 đốt: số đốt sáng là số lần ôn đúng liên tiếp, trần 5. */
function FamiliarityBar({ value }: { value: number }) {
  return (
    <span className="flex gap-0.75" aria-label={`Độ thuộc ${value}/5`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={cn(
            "h-1 w-2.5 rounded-sm",
            index < value ? "bg-brand" : "bg-secondary",
          )}
        />
      ))}
    </span>
  );
}
