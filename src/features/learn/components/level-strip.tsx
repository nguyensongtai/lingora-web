import Link from "next/link";

import {
  COURSE_LEVELS,
  LEVEL_SUBTITLES,
  type CourseLevel,
} from "@/features/course/types";
import { cn } from "@/lib/utils";

/**
 * Design vẽ dải này theo phần trăm hoàn thành từng unit. Chưa có tiến độ, nên
 * dải hiển thị thứ đang đo được: mỗi bậc có bao nhiêu khoá đã xuất bản.
 */
export function LevelStrip({ counts }: { counts: Record<CourseLevel, number> }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] font-bold tracking-tight">
          Khung CEFR{" "}
          <span className="text-muted-foreground text-sm font-medium">
            · A1 → C2
          </span>
        </h2>
        <Link
          href="/learn"
          className="text-brand-strong py-2 text-sm font-semibold"
        >
          Xem lộ trình →
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {COURSE_LEVELS.map((level) => {
          const count = counts[level];
          return (
            <Link
              key={level}
              href={{ pathname: "/learn", query: { level } }}
              className="flex flex-col gap-1.5"
            >
              <span
                className={cn(
                  "block h-2 rounded",
                  count > 0 ? "bg-brand" : "bg-secondary",
                )}
              />
              <span
                className={cn(
                  "block text-center text-[11px] font-medium",
                  count > 0 ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {level}
              </span>
              <span className="text-muted-foreground max-app:hidden block text-center text-[11px]">
                {LEVEL_SUBTITLES[level]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
