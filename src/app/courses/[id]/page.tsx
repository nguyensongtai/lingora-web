import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourse, fetchCourseLessons } from "@/features/course/api";
import { LessonList } from "@/features/course/components/lesson-list";
import { LEVEL_LABELS, STATUS_LABELS } from "@/features/course/types";
import { ApiError } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "Khoá học",
};

export default function CourseDetailPage({ params }: PageProps<"/courses/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/courses"
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← Tất cả khoá học
      </Link>

      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetail params={params} />
      </Suspense>
    </main>
  );
}

async function CourseDetail({
  params,
}: {
  params: PageProps<"/courses/[id]">["params"];
}) {
  const { id } = await params;

  // Hai lời gọi độc lập nên chạy song song; 404 của bất kỳ cái nào cũng là
  // "khoá học không tồn tại".
  const [course, lessons] = await Promise.all([
    fetchCourse(id).catch(handleNotFound),
    fetchCourseLessons(id).catch(handleNotFound),
  ]);

  return (
    <article className="mt-6 space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {course.level} · {LEVEL_LABELS[course.level]}
          </Badge>
          <Badge variant={course.status === "published" ? "outline" : "default"}>
            {STATUS_LABELS[course.status]}
          </Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
        {course.description ? (
          <p className="text-muted-foreground">{course.description}</p>
        ) : null}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Bài học
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {lessons.items.length} bài
          </span>
        </h2>
        <LessonList lessons={lessons.items} />
      </section>
    </article>
  );
}

/** 404 của API thành trang not-found của Next; lỗi khác vẫn nổi lên error boundary. */
function handleNotFound(error: unknown): never {
  if (error instanceof ApiError && error.status === 404) {
    notFound();
  }
  throw error;
}

function CourseDetailSkeleton() {
  return (
    <div className="mt-6 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
