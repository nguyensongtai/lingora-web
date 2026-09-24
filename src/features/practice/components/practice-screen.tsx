"use client";

import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { checkAnswer, fetchSession } from "../api";
import {
  KIND_LABELS,
  type PracticeKind,
  type PracticeQuestion,
  type PracticeResult,
  type PracticeScope,
} from "../types";

type Phase =
  | { name: "answering" }
  | { name: "checking" }
  | { name: "checked"; result: PracticeResult }
  | { name: "failed" };

export function PracticeScreen({
  scope,
  initialQuestions,
}: {
  scope: PracticeScope;
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
        scope,
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
      setQuestions(await fetchSession(scope));
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
    return <NothingToPractise scope={scope} />;
  }

  if (finished) {
    return (
      <Summary
        scope={scope}
        score={score}
        total={questions.length}
        onRestart={restart}
        busy={loadingNext}
      />
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

        {TYPED_KINDS.has(question.kind) ? (
          <TypedAnswer
            kind={question.kind}
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

/** Các dạng gõ tay; còn lại là chọn một trong các lựa chọn. */
const TYPED_KINDS: ReadonlySet<PracticeKind> = new Set(["fill_blank", "listen_write", "dictation"]);

function Prompt({ question }: { question: PracticeQuestion }) {
  // Ba dạng nghe đọc question.speak chứ không hiện nó: hiện chữ ra là đưa
  // luôn đáp án.
  if (question.kind === "listen_choose" || question.kind === "listen_write") {
    return <Listen text={question.speak} />;
  }

  if (question.kind === "dictation") {
    return (
      <div className="flex flex-col items-center gap-3">
        <Listen text={question.speak} />
        {question.hint ? (
          <p className="text-muted-foreground text-center text-sm">Nghĩa: {question.hint}</p>
        ) : null}
      </div>
    );
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
function speakAloud(text: string, rate = 1) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/**
 * Nút nghe cho các dạng nghe, kèm nút đọc chậm: chép cả câu ở tốc độ thường là
 * quá sức với người mới, và nghe lại chậm là cách người ta vẫn học chính tả.
 */
function Listen({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <SpeakButton word={text} />
      <button
        type="button"
        onClick={() => speakAloud(text, 0.6)}
        className="text-brand-strong text-sm font-semibold hover:underline"
      >
        Nghe chậm
      </button>
    </div>
  );
}

function SpeakButton({ word, compact }: { word: string; compact?: boolean }) {
  function speak() {
    speakAloud(word);
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

const TYPED_COPY: Partial<Record<PracticeKind, { placeholder: string; label: string }>> = {
  fill_blank: { placeholder: "Gõ từ còn thiếu", label: "Từ còn thiếu" },
  listen_write: { placeholder: "Gõ từ vừa nghe", label: "Từ vừa nghe" },
  dictation: { placeholder: "Gõ lại cả câu vừa nghe", label: "Câu vừa nghe" },
};

function TypedAnswer({
  kind,
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  kind: PracticeKind;
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
      // Cả một câu không vừa ô nhập nằm ngang trên màn điện thoại.
      className={cn("flex gap-2", kind === "dictation" && "flex-col app:flex-row")}
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={TYPED_COPY[kind]?.placeholder}
        autoComplete="off"
        autoCapitalize="none"
        // Trình duyệt tự sửa chính tả sẽ chữa hộ người học — mất hết ý nghĩa
        // của việc kiểm tra xem họ có nhớ mặt chữ hay không.
        spellCheck={false}
        aria-label={TYPED_COPY[kind]?.label}
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
  scope,
  score,
  total,
  onRestart,
  busy,
}: {
  scope: PracticeScope;
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
      <p className="text-muted-foreground max-w-90 text-sm">
        {summaryNote(scope, score.wrong)}
      </p>
      <Button onClick={onRestart} disabled={busy} size="lg">
        <RotateCcw className="size-4" />
        {busy ? "Đang dựng lượt mới…" : "Luyện lượt nữa"}
      </Button>
    </div>
  );
}

/**
 * Câu chốt dưới điểm số. Nói "đã quay lại hàng đợi ôn" ở lượt luyện trong bài
 * là nói sai: lượt đó không đụng tới lịch ôn.
 */
function summaryNote(scope: PracticeScope, wrong: number): string {
  if (scope.kind === "lesson") {
    return wrong > 0
      ? `Còn ${wrong} từ chưa nhớ. Quay lại bước Từ vựng xem lại, rồi luyện lượt nữa.`
      : "Bạn đã nhớ hết từ của bài này.";
  }
  return wrong > 0
    ? `${wrong} từ sai đã quay lại hàng đợi ôn. Sang màn Từ vựng để ôn lại chúng.`
    : "Không sai câu nào — lịch ôn của bạn giữ nguyên.";
}

function NothingToPractise({ scope }: { scope: PracticeScope }) {
  return (
    <div className="border-border bg-card rounded-card flex flex-col items-center gap-3 border px-5 py-12 text-center">
      <p className="font-semibold">Chưa đủ từ để luyện</p>
      <p className="text-muted-foreground max-w-100 text-sm leading-relaxed">
        {scope.kind === "lesson"
          ? "Bài này có quá ít từ để dựng câu trắc nghiệm — cần ít nhất ba từ."
          : "Câu hỏi được dựng từ chính những từ bạn đã mở khoá. Học xong vài bài nữa để có đủ từ — cả đáp án đúng lẫn đáp án nhiễu đều lấy từ vốn từ của bạn."}
      </p>
    </div>
  );
}
