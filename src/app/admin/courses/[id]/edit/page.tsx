import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isMissing } from "@/lib/api/missing";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/features/course/components/course-form";
import type { Course } from "@/features/course/types";
import { serverFetch } from "@/lib/api/server-client";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Sửa khoá học",
};

export default function EditCoursePage({
  params,
}: PageProps<"/admin/courses/[id]/edit">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Sửa khoá học</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EditForm params={params} />
      </Suspense>
    </main>
  );
}

async function EditForm({
  params,
}: {
  params: PageProps<"/admin/courses/[id]/edit">["params"];
}) {
  await requireAdmin();

  const { id } = await params;
  const response = await serverFetch(`/courses/${encodeURIComponent(id)}`);

  if (isMissing(response.status)) {
    notFound();
  }
  if (!response.ok) {
    throw new Error(`Không tải được khoá học (HTTP ${response.status}).`);
  }

  return <CourseForm course={(await response.json()) as Course} />;
}
