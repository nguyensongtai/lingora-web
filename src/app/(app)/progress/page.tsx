import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourses } from "@/features/course/api";
import { ActivityChart } from "@/features/progress/components/activity-chart";
import { LevelProgress } from "@/features/progress/components/level-progress";
import { Stat, StatGrid } from "@/features/progress/components/stat-grid";
import { readHistory, readProgress } from "@/features/progress/server";
import { HISTORY_DAYS } from "@/features/progress/types";
import { readCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Tiến độ",
  description: "XP, chuỗi ngày học và tiến độ từng bậc CEFR.",
};

/** Lộ trình hiển thị trọn mọi bậc nên lấy một lần thật rộng. */
const MAX_COURSES = 100;

export default function ProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          Tiến độ{" "}
          <span className="text-muted-foreground text-base font-medium">
            · Progress
          </span>
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Mọi con số dưới đây suy ra từ những bài bạn đã đánh dấu xong.
        </p>
      </div>

      {/* Đọc cookie: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<ProgressSkeleton />}>
        <ProgressReport />
      </Suspense>
    </main>
  );
}

async function ProgressReport() {
  const [history, snapshot, published, user] = await Promise.all([
    readHistory(HISTORY_DAYS),
    readProgress(),
    fetchCourses({ status: "published", page_size: MAX_COURSES }),
    readCurrentUser(),
  ]);

  if (user === null) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        Đăng nhập để xem tiến độ của bạn.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <StatGrid>
        <Stat
          label="Chuỗi hiện tại"
          value={`${history.current_streak} ngày`}
          note={history.current_streak === 0 ? "Học một bài để bắt đầu" : undefined}
        />
        <Stat
          label="Chuỗi dài nhất"
          value={`${history.longest_streak} ngày`}
          note={`trong ${HISTORY_DAYS} ngày qua`}
        />
        <Stat label="Tổng số bài" value={history.total_lessons} note="từ trước tới nay" />
        <Stat label="Tổng XP" value={history.total_xp} note="từ trước tới nay" />
      </StatGrid>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">
            {HISTORY_DAYS} ngày qua
          </h2>
          <span className="text-muted-foreground text-[13px]">
            {history.active_days}/{history.days.length} ngày có học
          </span>
        </div>
        <ActivityChart days={history.days} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Theo bậc CEFR</h2>
        <LevelProgress courses={published.items} snapshot={snapshot} />
      </section>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 app:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-22 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-card" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-card" />
        <Skeleton className="h-16 w-full rounded-card" />
      </div>
    </div>
  );
}
