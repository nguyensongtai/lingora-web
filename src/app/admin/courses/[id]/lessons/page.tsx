import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isMissing } from "@/lib/api/missing";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LessonManager } from "@/features/course/components/lesson-manager";
import type { Course, LessonList } from "@/features/course/types";
import { serverFetch } from "@/lib/api/server-client";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Bài học",
};

export default function ManageLessonsPage({
  params,
}: PageProps<"/admin/courses/[id]/lessons">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← Tất cả khoá học
      </Link>

      <Suspense fallback={<Skeleton className="mt-6 h-96 w-full" />}>
        <LessonSection params={params} />
      </Suspense>
    </main>
  );
}

async function LessonSection({
  params,
}: {
  params: PageProps<"/admin/courses/[id]/lessons">["params"];
}) {
  await requireAdmin();

  const { id } = await params;
  const [courseResponse, lessonsResponse] = await Promise.all([
    serverFetch(`/courses/${encodeURIComponent(id)}`),
    serverFetch(`/courses/${encodeURIComponent(id)}/lessons`),
  ]);

  if (isMissing(courseResponse.status) || isMissing(lessonsResponse.status)) {
    notFound();
  }
  if (!courseResponse.ok || !lessonsResponse.ok) {
    throw new Error("Không tải được dữ liệu khoá học.");
  }

  const course = (await courseResponse.json()) as Course;
  const lessons = (await lessonsResponse.json()) as LessonList;

  return (
    <div className="mt-6 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
      <LessonManager courseId={course.id} lessons={lessons.items} />
    </div>
  );
}
