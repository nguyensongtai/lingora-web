import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteCourseButton } from "@/features/course/components/delete-course-button";
import { LEVEL_LABELS, STATUS_LABELS, type CourseList } from "@/features/course/types";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverFetch } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Quản trị khoá học",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Khoá học</h1>
        <Button asChild>
          <Link href="/admin/courses/new">Thêm khoá học</Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <CourseTable />
      </Suspense>
    </main>
  );
}

async function CourseTable() {
  // Chốt quyền chạy trước khi đọc dữ liệu, kể cả khi layout đã kiểm một lần.
  await requireAdmin();

  const response = await serverFetch("/courses?page_size=100");
  if (!response.ok) {
    throw new Error(`Không tải được danh sách khoá học (HTTP ${response.status}).`);
  }
  const page = (await response.json()) as CourseList;

  if (page.items.length === 0) {
    return (
      <p className="text-muted-foreground">
        Chưa có khoá học nào. Bấm “Thêm khoá học” để tạo khoá đầu tiên.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Tiêu đề</th>
            <th className="px-4 py-3 font-medium">Trình độ</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 text-right font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {page.items.map((course) => (
            <tr key={course.id}>
              <td className="px-4 py-3">
                <Link href={`/courses/${course.id}`} className="hover:underline">
                  {course.title}
                </Link>
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {course.level} · {LEVEL_LABELS[course.level]}
              </td>
              <td className="px-4 py-3">
                <Badge variant={course.status === "published" ? "secondary" : "outline"}>
                  {STATUS_LABELS[course.status]}
                </Badge>
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                {course.slug}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/courses/${course.id}/lessons`}>Bài học</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/courses/${course.id}/edit`}>Sửa</Link>
                </Button>
                <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
