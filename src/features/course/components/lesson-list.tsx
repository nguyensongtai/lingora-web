import type { Lesson } from "../types";

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  if (lessons.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Khoá học này chưa có bài nào.
      </p>
    );
  }

  return (
    <ol className="divide-border divide-y rounded-lg border">
      {lessons.map((lesson, index) => (
        <li key={lesson.id} className="flex items-center gap-4 px-4 py-3">
          <span className="text-muted-foreground w-6 text-right text-sm tabular-nums">
            {index + 1}
          </span>
          <span className="text-sm font-medium">{lesson.title}</span>
        </li>
      ))}
    </ol>
  );
}
