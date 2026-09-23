"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useProgress } from "@/features/progress/hooks/use-progress";
import { useToggleLessonComplete } from "@/features/progress/hooks/use-toggle-lesson";
import { completedSetOf, type ProgressSnapshot } from "@/features/progress/types";
import { cn } from "@/lib/utils";

import type { Lesson, LessonDetail } from "../types";

/**
 * Nút đánh dấu xong và lối đi tiếp. Nằm ở bước cuối của bài vì đó là lúc người
 * học thật sự xong — nút ở đầu bài chỉ mời người ta bấm trước khi đọc.
 */
export function LessonFooter({
  lesson,
  courseId,
  siblings,
  initialProgress,
  canTrack,
}: {
  lesson: LessonDetail;
  courseId: string;
  siblings: Lesson[];
  initialProgress: ProgressSnapshot;
  canTrack: boolean;
}) {
  const { data: progress } = useProgress(initialProgress);
  const completed = useMemo(() => completedSetOf(progress), [progress]);
  const toggle = useToggleLessonComplete();

  const done = completed.has(lesson.id);
  const ordered = [...siblings].sort((a, b) => a.position - b.position);
  const next = ordered[ordered.findIndex((item) => item.id === lesson.id) + 1];

  return (
    <div className="border-border mt-2 flex flex-col gap-4 border-t pt-6">
      {canTrack ? (
        <Button
          size="lg"
          variant={done ? "outline" : "default"}
          onClick={() =>
            toggle.mutate({ lessonId: lesson.id, courseId, completed: !done })
          }
        >
          <Check className={cn("size-4", done && "text-success")} strokeWidth={3} />
          {done ? "Đã xong — bấm để bỏ đánh dấu" : "Đánh dấu đã học xong"}
        </Button>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Đăng nhập để lưu tiến độ của bạn.
        </p>
      )}

      {next ? (
        <Link
          href={`/lessons/${next.id}`}
          className="border-border hover:border-brand rounded-card flex items-center justify-between gap-3 border p-4 transition-colors"
        >
          <span className="min-w-0">
            <span className="text-muted-foreground block text-[13px]">
              Bài tiếp theo
            </span>
            <span className="block font-semibold">{next.title}</span>
          </span>
          <span className="text-brand-strong flex-none text-sm font-semibold">→</span>
        </Link>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Đây là bài cuối của khoá.
        </p>
      )}
    </div>
  );
}
