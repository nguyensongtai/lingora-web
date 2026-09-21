"use client";

import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

import { useProgress } from "../hooks/use-progress";
import type { ProgressSnapshot } from "../types";

/** Chu vi của vòng tròn r=38, dùng cho stroke-dasharray. */
const RING_LENGTH = 2 * Math.PI * 38;

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

export function TodayCard({
  initialProgress,
}: {
  initialProgress: ProgressSnapshot;
}) {
  const { data } = useProgress(initialProgress);

  const ratio =
    data.goal_xp > 0 ? Math.min(1, data.today_xp / data.goal_xp) : 0;
  const percent = Math.round(ratio * 100);
  const remaining = Math.max(0, data.goal_xp - data.today_xp);
  const lessonsLeft =
    data.xp_per_lesson > 0 ? Math.ceil(remaining / data.xp_per_lesson) : 0;

  return (
    <section className="border-border bg-card rounded-card flex flex-col gap-4 border p-6">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
        Hôm nay · Today
      </p>

      <div className="flex flex-wrap items-center gap-4.5">
        <div className="relative size-22 flex-none">
          <svg viewBox="0 0 88 88" className="size-22 -rotate-90">
            <circle
              cx="44"
              cy="44"
              r="38"
              fill="none"
              strokeWidth="8"
              className="stroke-secondary"
            />
            <circle
              cx="44"
              cy="44"
              r="38"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-brand transition-[stroke-dasharray] duration-500"
              strokeDasharray={`${ratio * RING_LENGTH} ${RING_LENGTH}`}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[15px] font-bold">
            {percent}%
          </span>
        </div>

        <div className="flex min-w-37 flex-1 flex-col gap-2.5">
          <div>
            <p className="text-xl font-bold tracking-tight">
              {data.today_xp} / {data.goal_xp} XP
            </p>
            <p className="text-muted-foreground text-[13px]">
              {remaining === 0
                ? "Đã đạt mục tiêu hôm nay."
                : `Còn ${remaining} XP · ${lessonsLeft} bài học nữa`}
            </p>
          </div>
          {data.streak_days > 0 ? (
            <p className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Flame className="text-brand size-4 fill-current" />
              {data.streak_days} ngày liên tiếp
            </p>
          ) : (
            <p className="text-muted-foreground text-[13px]">
              Học một bài hôm nay để bắt đầu chuỗi ngày.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-1.5">
        {data.week.map((day, index) => {
          const isToday = index === data.week.length - 1;
          const done = day.completed_lessons > 0;

          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-full rounded-sm",
                  done ? "bg-brand" : isToday ? "bg-brand-soft" : "bg-secondary",
                  isToday && "outline-brand -outline-offset-2 outline-2",
                )}
              />
              <span className="text-muted-foreground text-[11px]">
                {labelOf(day.date)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** "2026-09-21" → "T2". Đọc theo UTC để không lệch một ngày vì múi giờ máy. */
function labelOf(date: string): string {
  return WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()] ?? "";
}
