import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Course, Lesson } from "@/features/course/types";
import { LEVEL_LABELS } from "@/features/course/types";

/**
 * Một thẻ cho hai trạng thái: "Bắt đầu từ đây" khi chưa học gì trong khoá, và
 * "Tiếp tục học" khi đã có bài xong — lúc đó nextLesson là bài chưa xong đầu
 * tiên, thứ người học thực sự cần bấm vào.
 */
export function StartCard({
  course,
  lessons,
  doneCount,
  nextLesson,
}: {
  course: Course;
  lessons: Lesson[];
  doneCount: number;
  nextLesson: Lesson | undefined;
}) {
  const started = doneCount > 0;
  const percent =
    lessons.length === 0 ? 0 : Math.round((doneCount / lessons.length) * 100);

  return (
    <section className="border-border bg-card rounded-card flex flex-col gap-4 border p-6">
      <p className="text-brand-strong text-xs font-semibold tracking-[0.06em] uppercase">
        {started ? "Tiếp tục học · Continue" : "Bắt đầu từ đây · Start here"}
      </p>

      <div>
        <p className="text-muted-foreground text-[13px]">
          {course.level} · {LEVEL_LABELS[course.level]} ·{" "}
          {lessons.length === 0 ? "chưa có bài" : `${lessons.length} bài`}
        </p>
        <h2 className="mt-0.5 text-[22px] leading-snug font-bold tracking-tight">
          {course.title}
        </h2>
        {nextLesson ? (
          <p className="text-muted-foreground mt-1 text-sm">
            {started ? "Bài tiếp theo" : "Bài đầu tiên"}: {nextLesson.title}
          </p>
        ) : lessons.length > 0 ? (
          <p className="text-success mt-1 text-sm font-semibold">
            Đã xong cả {lessons.length} bài của khoá này.
          </p>
        ) : null}
      </div>

      {started ? (
        <div className="flex items-center gap-3">
          <div className="bg-secondary h-1.5 flex-1 overflow-hidden rounded-sm">
            <div
              className="bg-brand h-full rounded-sm"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-muted-foreground text-[13px] tabular-nums">
            {doneCount}/{lessons.length} bài
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2.5">
        {/* Nút chính đưa thẳng vào bài: thẻ đã nói tên bài tiếp theo, bắt
            người học mở khoá rồi tìm lại đúng bài đó là một lần bấm thừa ở
            chính nút quan trọng nhất của app. Khoá đã xong hết thì mới mở khoá. */}
        <Link
          href={nextLesson ? `/lessons/${nextLesson.id}` : `/courses/${course.id}`}
          className="bg-brand inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white"
        >
          {nextLesson ? (started ? "Học tiếp" : "Bắt đầu học") : "Xem lại khoá học"}
          <ArrowRight className="size-4" />
        </Link>
        {nextLesson ? (
          <Link
            href={`/courses/${course.id}`}
            className="hover:bg-secondary inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors"
          >
            Mở khoá học
          </Link>
        ) : null}
        <Link
          href={{ pathname: "/learn", query: { level: course.level } }}
          className="hover:bg-secondary inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors"
        >
          Xem cả bậc {course.level}
        </Link>
      </div>
    </section>
  );
}
