"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { Lesson } from "@/features/course/types";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { completedSetOf, type ProgressSnapshot } from "@/features/progress/types";
import { cn } from "@/lib/utils";

import { LessonStatus } from "./lesson-status";

/**
 * Danh sách bài của một khoá: bấm vào bài nào là mở bài đó. Đánh dấu xong nằm
 * trong bài, không ở đây. Dùng chung query key với /learn và thẻ Hôm nay, nên
 * xong một bài thì vạch tiến độ ở mọi nơi đổi theo cùng lúc.
 */
export function CourseLessons({
  lessons,
  initialProgress,
  canTrack,
}: {
  lessons: Lesson[];
  initialProgress: ProgressSnapshot;
  /** false khi chưa có phiên: không có tiến độ nào để hiện. */
  canTrack: boolean;
}) {
  const { data: progress } = useProgress(initialProgress);
  const completed = useMemo(() => completedSetOf(progress), [progress]);

  const doneCount = lessons.filter((lesson) => completed.has(lesson.id)).length;

  if (lessons.length === 0) {
    return (
      <p className="text-muted-foreground border-border bg-card rounded-xl border px-4 py-8 text-center text-sm">
        Khoá này chưa có bài nào.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {canTrack ? (
        <CourseBar done={doneCount} total={lessons.length} />
      ) : null}

      <ol className="border-border bg-card divide-border divide-y rounded-xl border">
        {lessons.map((lesson, position) => {
          const done = completed.has(lesson.id);
          return (
            <li key={lesson.id}>
              {/* Cả hàng là link: đích bấm to, và bấm vào đâu cũng là mở bài. */}
              <Link
                href={`/lessons/${lesson.id}`}
                className="hover:bg-secondary/60 flex min-h-15 items-center gap-3 px-3 py-3 transition-colors"
              >
                <LessonStatus done={canTrack && done} position={position} />
                <span
                  className={cn(
                    "min-w-0 flex-1 text-sm font-semibold",
                    done && canTrack && "text-muted-foreground",
                  )}
                >
                  {lesson.title}
                </span>
                <span aria-hidden className="text-muted-foreground text-sm">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CourseBar({ done, total }: { done: number; total: number }) {
  const percent = Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground flex items-baseline justify-between text-[13px]">
        <span>
          {done}/{total} bài đã xong
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
