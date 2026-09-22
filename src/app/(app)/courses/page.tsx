import type { Metadata } from "next";
import { Suspense } from "react";

import { fetchCourses } from "@/features/course/api";
import { CourseListSkeleton } from "@/features/course/components/course-card-skeleton";
import { CourseGrid } from "@/features/course/components/course-grid";
import { LevelFilter } from "@/features/course/components/level-filter";
import { COURSE_LEVELS, type CourseFilters, type CourseLevel } from "@/features/course/types";

export const metadata: Metadata = {
  title: "Khoá học",
  description: "Danh sách khoá học tiếng Anh theo trình độ CEFR.",
};

const PAGE_SIZE = 12;

export default function CoursesPage({ searchParams }: PageProps<"/courses">) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          Khoá học{" "}
          <span className="text-muted-foreground text-base font-medium">
            · Courses
          </span>
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Chọn khoá phù hợp với trình độ của bạn.
        </p>
      </div>

      {/* searchParams là dữ liệu động: Cache Components bắt buộc nó nằm trong Suspense. */}
      <Suspense fallback={<CourseListSkeleton />}>
        <CoursesSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function CoursesSection({
  searchParams,
}: {
  searchParams: PageProps<"/courses">["searchParams"];
}) {
  const level = parseLevel((await searchParams).level);
  const filters: CourseFilters = {
    status: "published",
    page_size: PAGE_SIZE,
    ...(level ? { level } : {}),
  };

  const page = await fetchCourses(filters);

  return (
    <div className="space-y-8">
      <LevelFilter active={level} />

      {page.items.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          {level
            ? `Chưa có khoá học nào ở trình độ ${level}.`
            : "Chưa có khoá học nào."}
        </p>
      ) : (
        <CourseGrid filters={filters} initialPage={page} />
      )}
    </div>
  );
}

function parseLevel(raw: string | string[] | undefined): CourseLevel | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return COURSE_LEVELS.find((level) => level === value);
}
