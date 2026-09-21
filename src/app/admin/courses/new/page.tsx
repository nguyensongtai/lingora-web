import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/features/course/components/course-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Thêm khoá học",
};

export default function NewCoursePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Thêm khoá học</h1>
      {/* requireAdmin đọc cookie: dữ liệu động phải nằm trong Suspense. */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <NewCourseSection />
      </Suspense>
    </main>
  );
}

async function NewCourseSection() {
  await requireAdmin();
  return <CourseForm />;
}
