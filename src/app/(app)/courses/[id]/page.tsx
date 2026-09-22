import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourse, fetchCourseLessons } from "@/features/course/api";
import { CourseLessons } from "@/features/course/components/course-lessons";
import { LEVEL_LABELS, STATUS_LABELS } from "@/features/course/types";
import { readProgress } from "@/features/progress/server";
import { handleMissing } from "@/lib/api/missing";
import { readCurrentUser } from "@/lib/auth/current-user";

/**
 * Tiêu đề tab lấy theo đúng khoá: người học hay mở nhiều tab khoá cùng lúc, và
 * sáu tab cùng tên "Khoá học" thì không chọn được tab nào.
 */
export async function generateMetadata({
  params,
}: PageProps<"/courses/[id]">): Promise<Metadata> {
  const { id } = await params;
  const course = await fetchCourse(id).catch(() => null);

  return course
    ? { title: course.title, description: course.description || undefined }
    : { title: "Khoá học" };
}

export default function CourseDetailPage({
  params,
}: PageProps<"/courses/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-6 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
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

  // Bốn lời gọi độc lập nên chạy song song; 404 của khoá hay của bài đều là
  // "khoá học không tồn tại".
  const [course, lessons, progress, user] = await Promise.all([
    fetchCourse(id).catch(handleMissing),
    fetchCourseLessons(id).catch(handleMissing),
    readProgress(),
    readCurrentUser(),
  ]);

  return (
    <>
      <div>
        <Link
          href={`/learn?level=${course.level}`}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Bậc {course.level} · {LEVEL_LABELS[course.level]}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {course.level} · {LEVEL_LABELS[course.level]}
          </Badge>
          {/* Chỉ admin đọc được khoá nháp, nên nhãn này chỉ họ mới thấy. */}
          {course.status === "draft" ? (
            <Badge>{STATUS_LABELS[course.status]}</Badge>
          ) : null}
        </div>

        <h1 className="mt-2 text-[26px] leading-tight font-bold tracking-tight">
          {course.title}
        </h1>
        {course.description ? (
          <p className="text-muted-foreground mt-1.5">{course.description}</p>
        ) : null}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">
          Bài học
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {lessons.items.length} bài
          </span>
        </h2>
        <CourseLessons
          course={course}
          lessons={lessons.items}
          initialProgress={progress}
          canTrack={user !== null}
        />
      </section>
    </>
  );
}

function CourseDetailSkeleton() {
  return (
    <>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </>
  );
}
