"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import type { Course, Lesson } from "@/features/course/types";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { useToggleLessonComplete } from "@/features/progress/hooks/use-toggle-lesson";
import { completedSetOf, type ProgressSnapshot } from "@/features/progress/types";
import { cn } from "@/lib/utils";

/**
 * Danh sách bài của một khoá, kèm nút đánh dấu đã xong. Dùng chung query key
 * với /learn và thẻ Hôm nay, nên bấm ở đây thì XP và vạch tiến độ ở những chỗ
 * kia đổi theo cùng lúc.
 */
export function CourseLessons({
  course,
  lessons,
  initialProgress,
  canTrack,
}: {
  course: Course;
  lessons: Lesson[];
  initialProgress: ProgressSnapshot;
  /** false khi chưa đăng nhập: vẫn xem được danh sách, chỉ không đánh dấu được. */
  canTrack: boolean;
}) {
  const { data: progress } = useProgress(initialProgress);
  const completed = useMemo(() => completedSetOf(progress), [progress]);
  const toggle = useToggleLessonComplete();

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
            <li
              key={lesson.id}
              className="flex min-h-15 items-center gap-3 px-3 py-3"
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
                      courseId: course.id,
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
                  {done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </button>
              ) : (
                <span className="border-border text-muted-foreground grid size-6 flex-none place-items-center rounded-full border-2 text-[11px] font-bold">
                  {position + 1}
                </span>
              )}

              {/* Tên bài là link: trước đây nó chỉ là chữ cạnh ô tick, nên
                  không có đường nào vào nội dung bài. */}
              <Link
                href={`/lessons/${lesson.id}`}
                className={cn(
                  "hover:text-brand-strong min-w-0 flex-1 text-sm font-semibold transition-colors",
                  done && "text-muted-foreground line-through",
                )}
              >
                {lesson.title}
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
