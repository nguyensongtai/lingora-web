import Link from "next/link";

import {
  COURSE_LEVELS,
  LEVEL_SUBTITLES,
  type CourseLevel,
} from "@/features/course/types";
import { cn } from "@/lib/utils";

export function LevelRail({
  active,
  counts,
}: {
  active: CourseLevel;
  counts: Record<CourseLevel, number>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {COURSE_LEVELS.map((level) => {
        const count = counts[level];
        const selected = level === active;

        return (
          <Link
            key={level}
            href={{ pathname: "/learn", query: { level } }}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex h-14 min-w-26 flex-none flex-col items-start justify-center gap-0.5 rounded-xl px-3.5 transition-colors",
              selected
                ? "border-brand bg-card border-2"
                : "border-border border hover:bg-card/60",
              count === 0 && !selected && "opacity-60",
            )}
          >
            <span className="text-[15px] font-bold">{level}</span>
            <span className="text-muted-foreground text-[11px] font-medium">
              {LEVEL_SUBTITLES[level]} ·{" "}
              {count === 0 ? "chưa có khoá" : `${count} khoá`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
