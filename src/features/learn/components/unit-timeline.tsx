"use client";

import Link from "next/link";
import { useState } from "react";

import type { Course, Lesson } from "@/features/course/types";
import { cn } from "@/lib/utils";

export type Unit = { course: Course; lessons: Lesson[] };

export function UnitTimeline({ units }: { units: Unit[] }) {
  // Mở sẵn unit đầu tiên: mở hết thì mất hình dạng lộ trình, đóng hết thì
  // người học phải bấm một nhát mới thấy có gì bên trong.
  const [openId, setOpenId] = useState<string | null>(
    units[0]?.course.id ?? null,
  );

  return (
    <div className="flex flex-col">
      {units.map((unit, index) => {
        const open = unit.course.id === openId;
        const last = index === units.length - 1;

        return (
          <div key={unit.course.id} className="grid grid-cols-[40px_minmax(0,1fr)] gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 grid size-8 place-items-center rounded-full border-2 text-[13px] font-bold",
                  open
                    ? "border-brand text-brand bg-card"
                    : "border-transparent bg-secondary text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              {last ? null : <span className="bg-border mt-1.5 w-0.5 flex-1" />}
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
                <span
                  className={cn(
                    "flex-none rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                    unit.lessons.length === 0
                      ? "bg-secondary text-muted-foreground"
                      : "bg-brand-soft text-brand-strong",
                  )}
                >
                  {unit.lessons.length === 0
                    ? "Chưa có bài"
                    : `${unit.lessons.length} bài`}
                </span>
              </button>

              {open ? (
                <div className="border-border bg-card rounded-xl border p-1.5">
                  {unit.lessons.length === 0 ? (
                    <p className="text-muted-foreground px-2.5 py-3 text-sm">
                      Khoá này chưa có bài nào.
                    </p>
                  ) : (
                    <ol>
                      {unit.lessons.map((lesson, position) => (
                        <li
                          key={lesson.id}
                          className="flex min-h-14 items-center gap-3 rounded-lg px-2.5 py-2.5"
                        >
                          <span className="border-border text-muted-foreground grid size-6 flex-none place-items-center rounded-full border-2 text-[11px] font-bold">
                            {position + 1}
                          </span>
                          <span className="min-w-0 flex-1 text-sm font-semibold">
                            {lesson.title}
                          </span>
                        </li>
                      ))}
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
  );
}
