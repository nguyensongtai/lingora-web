"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import type { Course, Lesson } from "@/features/course/types";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { useToggleLessonComplete } from "@/features/progress/hooks/use-toggle-lesson";
import { completedSetOf, type ProgressSnapshot } from "@/features/progress/types";
import { cn } from "@/lib/utils";

export type Unit = { course: Course; lessons: Lesson[] };

export function UnitTimeline({
  units,
  initialProgress,
  canTrack,
  level,
}: {
  units: Unit[];
  initialProgress: ProgressSnapshot;
  /** false khi chưa đăng nhập: vẫn xem được lộ trình, chỉ không đánh dấu được. */
  canTrack: boolean;
  level: string;
}) {
  // Mở sẵn unit đầu tiên: mở hết thì mất hình dạng lộ trình, đóng hết thì
  // người học phải bấm một nhát mới thấy có gì bên trong.
  const [openId, setOpenId] = useState<string | null>(
    units[0]?.course.id ?? null,
  );

  const { data: progress } = useProgress(initialProgress);
  const completed = useMemo(() => completedSetOf(progress), [progress]);
  const toggle = useToggleLessonComplete();

  const lessonCount = units.reduce((total, unit) => total + unit.lessons.length, 0);
  const doneTotal = units.reduce(
    (total, unit) =>
      total + unit.lessons.filter((lesson) => completed.has(lesson.id)).length,
    0,
  );

  return (
    <div className="flex flex-col gap-8">
      {canTrack && lessonCount > 0 ? (
        <LevelBar done={doneTotal} total={lessonCount} level={level} />
      ) : null}

      <div className="flex flex-col">
      {units.map((unit, index) => {
        const open = unit.course.id === openId;
        const last = index === units.length - 1;
        const doneCount = unit.lessons.filter((lesson) =>
          completed.has(lesson.id),
        ).length;
        const finished = unit.lessons.length > 0 && doneCount === unit.lessons.length;

        return (
          <div key={unit.course.id} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 grid size-8 place-items-center rounded-full border-2 text-[13px] font-bold",
                  finished
                    ? "bg-brand border-transparent text-white"
                    : open
                      ? "border-brand text-brand bg-card"
                      : "bg-secondary text-muted-foreground border-transparent",
                )}
              >
                {finished ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>
              {last ? null : (
                <span
                  className={cn(
                    "mt-1.5 w-0.5 flex-1",
                    finished ? "bg-brand" : "bg-border",
                  )}
                />
              )}
            </div>

            <div className="min-w-0 pb-6">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : unit.course.id)}
                aria-expanded={open}
                className="flex w-full items-start gap-3 py-1.5 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold tracking-tight">
                    {unit.course.title}
                  </span>
                  {unit.course.description ? (
                    <span className="text-muted-foreground mt-0.5 block text-[13px]">
                      {unit.course.description}
                    </span>
                  ) : null}
                </span>
                <UnitBadge
                  total={unit.lessons.length}
                  done={doneCount}
                  showDone={canTrack}
                />
              </button>

              {open ? (
                <div className="border-border bg-card rounded-xl border p-1.5">
                  {unit.lessons.length === 0 ? (
                    <p className="text-muted-foreground px-2.5 py-3 text-sm">
                      Khoá này chưa có bài nào.
                    </p>
                  ) : (
                    <ol>
                      {unit.lessons.map((lesson, position) => {
                        const done = completed.has(lesson.id);
                        return (
                          <li
                            key={lesson.id}
                            className="flex min-h-14 items-center gap-3 rounded-lg px-2.5 py-2.5"
                          >
                            {canTrack ? (
                              <button
                                type="button"
                                aria-pressed={done}
                                aria-label={
                                  done
                                    ? `Bỏ đánh dấu "${lesson.title}"`
                                    : `Đánh dấu đã học xong "${lesson.title}"`
                                }
                                onClick={() =>
                                  toggle.mutate({
                                    lessonId: lesson.id,
                                    courseId: unit.course.id,
                                    completed: !done,
                                  })
                                }
                                className={cn(
                                  "grid size-6 flex-none place-items-center rounded-full border-2 transition-colors",
                                  done
                                    ? "bg-brand border-transparent text-white"
                                    : "border-border hover:border-brand",
                                )}
                              >
                                {done ? (
                                  <Check className="size-3.5" strokeWidth={3} />
                                ) : null}
                              </button>
                            ) : (
                              <span className="border-border text-muted-foreground grid size-6 flex-none place-items-center rounded-full border-2 text-[11px] font-bold">
                                {position + 1}
                              </span>
                            )}
                            <span
                              className={cn(
                                "min-w-0 flex-1 text-sm font-semibold",
                                done && "text-muted-foreground line-through",
                              )}
                            >
                              {lesson.title}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                  <Link
                    href={`/courses/${unit.course.id}`}
                    className="text-brand-strong flex h-10 items-center px-2.5 text-sm font-semibold"
                  >
                    Mở khoá học →
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

/**
 * Vạch tiến độ của cả bậc. Nằm trong cùng component với danh sách bài để hai
 * con số luôn đến từ một snapshot — tách ra là chúng lệch nhau ngay khi có
 * cập nhật lạc quan.
 */
function LevelBar({
  done,
  total,
  level,
}: {
  done: number;
  total: number;
  level: string;
}) {
  const percent = Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground flex items-baseline justify-between text-[13px]">
        <span>
          Bậc {level} · {done}/{total} bài
        </span>
        <span className="font-semibold tabular-nums">{percent}%</span>
      </div>
      <div className="bg-secondary h-1 overflow-hidden rounded-sm">
        <div
          className="bg-brand h-full rounded-sm transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function UnitBadge({
  total,
  done,
  showDone,
}: {
  total: number;
  done: number;
  showDone: boolean;
}) {
  if (total === 0) {
    return (
      <span className="bg-secondary text-muted-foreground flex-none rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap">
        Chưa có bài
      </span>
    );
  }

  const finished = showDone && done === total;
  return (
    <span
      className={cn(
        "flex-none rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        finished
          ? "bg-success-soft text-success"
          : "bg-brand-soft text-brand-strong",
      )}
    >
      {!showDone
        ? `${total} bài`
        : finished
          ? "Hoàn thành"
          : `${done}/${total} bài`}
    </span>
  );
}
