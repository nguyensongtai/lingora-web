"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { LessonStepKey } from "../lesson-steps";

export type StepperStep = {
  key: LessonStepKey;
  title: string;
  caption: string;
  panel: ReactNode;
};

/**
 * Đi qua bài từng bước một.
 *
 * Mọi bước đều được render sẵn và chỉ ẩn đi, chứ không mount lại khi chuyển:
 * người học đang luyện tập mà quay về bước Từ vựng tra một từ thì lượt luyện
 * của họ phải còn nguyên khi quay lại.
 *
 * Nhảy tới bước nào cũng được, kể cả bước cuối — "Đã xong" vẫn là người học tự
 * bấm, không gắn với việc đã đi hết các bước (người dùng đã chốt như vậy).
 */
export function LessonStepper({ steps, finish }: { steps: StepperStep[]; finish: ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]));
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Bấm "Tiếp" ở cuối một bước dài thì bước mới hiện ra mà mắt vẫn ở đáy
  // trang. Đưa thanh các bước về tầm nhìn nếu nó đã trôi lên khỏi màn hình, và
  // chuyển focus sang bước mới cho trình đọc màn hình. Bỏ qua lần render đầu:
  // mở trang ra không được tự cuộn đi đâu cả.
  useEffect(() => {
    if (!moved.current) {
      return;
    }
    panelRef.current?.focus({ preventScroll: true });
    if (rootRef.current && rootRef.current.getBoundingClientRect().top < 0) {
      rootRef.current.scrollIntoView({ block: "start" });
    }
  }, [current]);

  function go(index: number) {
    moved.current = true;
    setCurrent(index);
    setVisited((seen) => new Set(seen).add(index));
  }

  const last = steps.length - 1;
  const next = steps[current + 1];
  const previous = steps[current - 1];

  return (
    <div ref={rootRef} className="flex scroll-mt-20 flex-col gap-6">
      <nav aria-label="Các bước của bài">
        <ol className="grid auto-cols-fr grid-flow-col gap-2">
          {steps.map((step, index) => {
            const active = index === current;
            const done = visited.has(index) && !active;
            return (
              <li key={step.key}>
                <button
                  type="button"
                  onClick={() => go(index)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "rounded-card flex w-full flex-col items-start gap-1 border p-2.5 text-left transition-colors app:p-3",
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-border bg-card hover:border-brand",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full text-xs font-bold",
                      active && "bg-brand text-white",
                      done && "bg-success-soft text-success",
                      !active && !done && "bg-secondary text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
                  </span>
                  <span className="w-full truncate text-[13px] font-semibold app:text-sm">
                    {step.title}
                  </span>
                  <span className="text-muted-foreground hidden w-full truncate text-xs app:block">
                    {step.caption}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={panelRef} tabIndex={-1} className="outline-none">
        {steps.map((step, index) => (
          <section
            key={step.key}
            hidden={index !== current}
            aria-label={`Bước ${index + 1}: ${step.title}`}
          >
            <h2 className="mb-4 text-lg font-semibold">
              {index + 1}. {step.title}
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                {step.caption}
              </span>
            </h2>
            {step.panel}
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        {previous ? (
          <Button variant="outline" onClick={() => go(current - 1)}>
            ← {previous.title}
          </Button>
        ) : (
          <span />
        )}
        {next ? <Button onClick={() => go(current + 1)}>Tiếp: {next.title} →</Button> : null}
      </div>

      {current === last ? finish : null}
    </div>
  );
}
