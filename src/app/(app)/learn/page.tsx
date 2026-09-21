import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourseLessons, fetchCourses } from "@/features/course/api";
import {
  COURSE_LEVELS,
  LEVEL_LABELS,
  type Course,
  type CourseLevel,
} from "@/features/course/types";
import { LevelRail } from "@/features/learn/components/level-rail";
import {
  UnitTimeline,
  type Unit,
} from "@/features/learn/components/unit-timeline";

export const metadata: Metadata = {
  title: "Lộ trình học",
  description: "Các khoá học tiếng Anh xếp theo bậc CEFR từ A1 đến C2.",
};

/** Lộ trình hiển thị trọn một bậc chứ không phân trang, nên lấy một lần thật rộng. */
const MAX_COURSES = 100;

export default function LearnPage({ searchParams }: PageProps<"/learn">) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          Lộ trình học{" "}
          <span className="text-muted-foreground text-base font-medium">
            · Learning path
          </span>
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Khoá học xếp theo khung CEFR từ A1 tới C2. Chọn bậc để xem các khoá
          bên trong.
        </p>
      </div>

      {/* searchParams là dữ liệu động: Cache Components bắt buộc nó nằm trong Suspense. */}
      <Suspense fallback={<LearnSkeleton />}>
        <LearningPath searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LearningPath({
  searchParams,
}: {
  searchParams: PageProps<"/learn">["searchParams"];
}) {
  const requested = parseLevel((await searchParams).level);
  const published = await fetchCourses({
    status: "published",
    page_size: MAX_COURSES,
  });

  const counts = countByLevel(published.items);
  // Không có bậc nào trên URL thì mở bậc thấp nhất đang có khoá, để trang
  // không mở ra ở một bậc rỗng.
  const active =
    requested ?? COURSE_LEVELS.find((level) => counts[level] > 0) ?? "A1";

  const courses = published.items
    .filter((course) => course.level === active)
    // API trả mới nhất trước; lộ trình thì đi từ khoá cũ nhất. Khoá học chưa có
    // trường thứ tự riêng nên ngày tạo là thứ tự duy nhất đang có.
    .reverse();

  const units: Unit[] = await Promise.all(
    courses.map(async (course) => ({
      course,
      lessons: (await fetchCourseLessons(course.id)).items,
    })),
  );

  return (
    <>
      <LevelRail active={active} counts={counts} />

      {units.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          Bậc {active} · {LEVEL_LABELS[active]} chưa có khoá nào được xuất bản.
        </p>
      ) : (
        <UnitTimeline units={units} />
      )}
    </>
  );
}

function countByLevel(courses: Course[]): Record<CourseLevel, number> {
  const counts = Object.fromEntries(
    COURSE_LEVELS.map((level) => [level, 0]),
  ) as Record<CourseLevel, number>;

  for (const course of courses) {
    counts[course.level] += 1;
  }
  return counts;
}

function parseLevel(raw: string | string[] | undefined): CourseLevel | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return COURSE_LEVELS.find((level) => level === value);
}

function LearnSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-26 flex-none rounded-xl" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
