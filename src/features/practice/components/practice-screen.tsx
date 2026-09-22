"use client";

import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { checkAnswer, fetchSession } from "../api";
import {
  KIND_LABELS,
  SESSION_SIZE,
  type PracticeQuestion,
  type PracticeResult,
} from "../types";

type Phase =
  | { name: "answering" }
  | { name: "checking" }
  | { name: "checked"; result: PracticeResult }
  | { name: "failed" };

export function PracticeScreen({
  initialQuestions,
}: {
  initialQuestions: PracticeQuestion[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>({ name: "answering" });
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loadingNext, setLoadingNext] = useState(false);

  const question = questions[index];
  const finished = question === undefined;

  async function submit(answer: string) {
    if (phase.name === "checking" || answer.trim() === "") {
      return;
    }
    setPhase({ name: "checking" });

    try {
      const result = await checkAnswer({
        entryId: question.entry_id,
        kind: question.kind,
        answer,
      });
      setPhase({ name: "checked", result });
      setScore((current) =>
        result.correct
          ? { ...current, correct: current.correct + 1 }
          : { ...current, wrong: current.wrong + 1 },
      );
    } catch {
      // Chấm hỏng thì KHÔNG tính điểm và không đi tiếp: đoán bừa là đúng hay
      // sai đều làm hỏng con số người học đang nhìn.
      setPhase({ name: "failed" });
    }
  }

  function next() {
    setTyped("");
    setPhase({ name: "answering" });
    setIndex((current) => current + 1);
  }

  async function restart() {
    setLoadingNext(true);
    try {
      setQuestions(await fetchSession(SESSION_SIZE));
      setIndex(0);
      setTyped("");
      setScore({ correct: 0, wrong: 0 });
      setPhase({ name: "answering" });
    } catch {
      setPhase({ name: "failed" });
    } finally {
      setLoadingNext(false);
    }
  }

  if (questions.length === 0) {
    return <NothingToPractise />;
  }

  if (finished) {
    return (
      <Summary score={score} total={questions.length} onRestart={restart} busy={loadingNext} />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Progress done={index} total={questions.length} score={score} />

      <div className="border-border bg-card rounded-card flex flex-col gap-5 border p-5 app:p-6">
        <span className="text-muted-foreground text-[13px] font-medium">
          {KIND_LABELS[question.kind]} · {question.level}
        </span>

        <Prompt question={question} />

        {question.kind === "fill_blank" ? (
          <FillBlank
            value={typed}
            onChange={setTyped}
            onSubmit={() => void submit(typed)}
            disabled={phase.name !== "answering"}
          />
        ) : (
          <Options
            options={question.options}
            phase={phase}
            onPick={(option) => void submit(option)}
          />
        )}

        <Feedback phase={phase} onRetry={() => void submit(typed)} />
      </div>

      {phase.name === "checked" ? (
        <Button onClick={next} size="lg">
          {index + 1 === questions.length ? "Xem kết quả" : "Câu tiếp theo"}
        </Button>
      ) : null}
    </div>
  );
}

function Prompt({ question }: { question: PracticeQuestion }) {
  if (question.kind === "listen_choose") {
    return <SpeakButton word={question.word} />;
  }

  if (question.kind === "fill_blank") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl leading-relaxed font-semibold">
          {question.prompt}
        </p>
        <p className="text-muted-foreground text-sm">Gợi ý: {question.hint}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-3xl font-bold tracking-tight">{question.prompt}</p>
      <SpeakButton word={question.word} compact />
    </div>
  );
}

/**
 * Đọc bằng speechSynthesis của trình duyệt, giống màn Từ vựng — không cần file
 * âm thanh hay dịch vụ ngoài. Máy không hỗ trợ thì nút không làm gì.
 */
function SpeakButton({ word, compact }: { word: string; compact?: boolean }) {
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label="Nghe lại"
      className={cn(
        "bg-brand-soft text-brand-strong hover:bg-brand grid place-items-center rounded-full transition-colors hover:text-white",
        compact ? "size-9 flex-none" : "size-20 self-center",
      )}
    >
      <Volume2 className={compact ? "size-4" : "size-8"} />
    </button>
  );
}

function Options({
  options,
  phase,
  onPick,
}: {
  options: string[];
  phase: Phase;
  onPick: (option: string) => void;
}) {
  const answered = phase.name === "checked" ? phase.result : null;

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={phase.name !== "answering"}
          onClick={() => onPick(option)}
          className={cn(
            "border-border rounded-xl border px-4 py-3 text-left text-[15px] font-medium transition-colors",
            phase.name === "answering" && "hover:border-brand",
            answered && option === answered.expected
              ? "border-success bg-success-soft text-success"
              : "",
            answered && !answered.correct && option !== answered.expected
              ? "opacity-50"
              : "",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function FillBlank({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex gap-2"
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Gõ từ còn thiếu"
        autoComplete="off"
        autoCapitalize="none"
        // Trình duyệt tự sửa chính tả sẽ chữa hộ người học — mất hết ý nghĩa
        // của việc kiểm tra xem họ có nhớ mặt chữ hay không.
        spellCheck={false}
        aria-label="Từ còn thiếu"
        className="h-11 flex-1"
      />
      <Button type="submit" disabled={disabled || value.trim() === ""}>
        Kiểm tra
      </Button>
    </form>
  );
}

function Feedback({ phase, onRetry }: { phase: Phase; onRetry: () => void }) {
  if (phase.name === "failed") {
    return (
      <div className="bg-danger-soft text-danger flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm">
        <span>Không chấm được câu này. Câu trả lời của bạn chưa được tính.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (phase.name !== "checked") {
    return null;
  }

  const { correct, expected, penalised } = phase.result;

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm",
        correct ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
      )}
    >
      {correct ? (
        <Check className="mt-0.5 size-4 flex-none" strokeWidth={3} />
      ) : (
        <X className="mt-0.5 size-4 flex-none" strokeWidth={3} />
      )}
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold">
          {correct ? "Chính xác" : `Đáp án: ${expected}`}
        </span>
        {penalised ? (
          <span className="opacity-80">Từ này sẽ quay lại hàng đợi ôn sớm hơn.</span>
        ) : null}
      </div>
    </div>
  );
}

function Progress({
  done,
  total,
  score,
}: {
  done: number;
  total: number;
  score: { correct: number; wrong: number };
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground flex items-baseline justify-between text-[13px]">
        <span>
          Câu {done + 1}/{total}
        </span>
        <span className="tabular-nums">
          {score.correct} đúng · {score.wrong} sai
        </span>
      </div>
      <div className="bg-secondary h-1 overflow-hidden rounded-sm">
        <div
          className="bg-brand h-full rounded-sm transition-[width] duration-300"
          style={{ width: `${Math.round((done / total) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function Summary({
  score,
  total,
  onRestart,
  busy,
}: {
  score: { correct: number; wrong: number };
  total: number;
  onRestart: () => void;
  busy: boolean;
}) {
  const answered = score.correct + score.wrong;

  return (
    <div className="border-border bg-card rounded-card flex flex-col items-center gap-4 border px-5 py-10 text-center">
      <p className="text-muted-foreground text-sm">Xong lượt này</p>
      <p className="text-4xl font-bold tracking-tight tabular-nums">
        {score.correct}/{answered || total}
      </p>
      {score.wrong > 0 ? (
        <p className="text-muted-foreground max-w-90 text-sm">
          {score.wrong} từ sai đã quay lại hàng đợi ôn. Sang màn Từ vựng để ôn
          lại chúng.
        </p>
      ) : (
        <p className="text-muted-foreground max-w-90 text-sm">
          Không sai câu nào — lịch ôn của bạn giữ nguyên.
        </p>
      )}
      <Button onClick={onRestart} disabled={busy} size="lg">
        <RotateCcw className="size-4" />
        {busy ? "Đang dựng lượt mới…" : "Luyện lượt nữa"}
      </Button>
    </div>
  );
}

function NothingToPractise() {
  return (
    <div className="border-border bg-card rounded-card flex flex-col items-center gap-3 border px-5 py-12 text-center">
      <p className="font-semibold">Chưa đủ từ để luyện</p>
      <p className="text-muted-foreground max-w-100 text-sm leading-relaxed">
        Câu hỏi được dựng từ chính những từ bạn đã mở khoá. Học xong vài bài nữa
        để có đủ từ — cả đáp án đúng lẫn đáp án nhiễu đều lấy từ vốn từ của bạn.
      </p>
    </div>
  );
}
