import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Course, Lesson } from "@/features/course/types";
import { LEVEL_LABELS } from "@/features/course/types";

/**
 * Design gọi thẻ này là "Tiếp tục học" và vẽ kèm thanh 3/6 bước. Chưa có bảng
 * tiến độ nên không thể biết người học đang dở ở đâu — thẻ đổi thành điểm bắt
 * đầu của lộ trình, và thanh tiến độ bị bỏ thay vì vẽ một con số bịa.
 */
export function StartCard({
  course,
  lessons,
}: {
  course: Course;
  lessons: Lesson[];
}) {
  const first = lessons[0];

  return (
    <section className="border-border bg-card rounded-card flex flex-col gap-4 border p-6">
      <p className="text-brand-strong text-xs font-semibold tracking-[0.06em] uppercase">
        Bắt đầu từ đây · Start here
      </p>

      <div>
        <p className="text-muted-foreground text-[13px]">
          {course.level} · {LEVEL_LABELS[course.level]} ·{" "}
          {lessons.length === 0 ? "chưa có bài" : `${lessons.length} bài`}
        </p>
        <h2 className="mt-0.5 text-[22px] leading-snug font-bold tracking-tight">
          {course.title}
        </h2>
        {first ? (
          <p className="text-muted-foreground mt-1 text-sm">
            Bài đầu tiên: {first.title}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Link
          href={`/courses/${course.id}`}
          className="bg-brand inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white"
        >
          Mở khoá học
          <ArrowRight className="size-4" />
        </Link>
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
