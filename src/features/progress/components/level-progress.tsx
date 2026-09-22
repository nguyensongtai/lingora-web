import Link from "next/link";

import { LEVEL_LABELS, type Course } from "@/features/course/types";

import { percent, summariseLevels } from "../levels";
import type { ProgressSnapshot } from "../types";

/**
 * Tiến độ từng bậc CEFR. Gộp ở phía trước chứ không thêm endpoint: API đã trả
 * tiến độ theo khoá, còn bậc là một cột của khoá — phía trước vốn đã có danh
 * sách khoá để vẽ lộ trình.
 */
export function LevelProgress({
  courses,
  snapshot,
}: {
  courses: Course[];
  snapshot: ProgressSnapshot;
}) {
  const rows = summariseLevels(courses, snapshot);
  const started = rows.filter((row) => row.total > 0);

  if (started.length === 0) {
    return (
      <p className="text-muted-foreground border-border bg-card rounded-card border px-4 py-8 text-center text-sm">
        Chưa có khoá học nào được xuất bản.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {started.map((row) => (
        <Link
          key={row.level}
          href={`/learn?level=${row.level}`}
          className="border-border bg-card rounded-card hover:border-brand flex flex-col gap-2 border p-4 transition-colors"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold">
              {row.level}{" "}
              <span className="text-muted-foreground font-normal">
                · {LEVEL_LABELS[row.level]}
              </span>
            </span>
            <span className="text-muted-foreground text-[13px] tabular-nums">
              {row.done}/{row.total} bài
            </span>
          </div>
          <div className="bg-secondary h-1 overflow-hidden rounded-sm">
            <div
              className="bg-brand h-full rounded-sm"
              style={{ width: `${percent(row)}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
