import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchLesson } from "@/features/course/api";
import { BlockEditor } from "@/features/course/components/block-editor";
import { handleMissing } from "@/lib/api/missing";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: "Nội dung bài học",
};

export default function LessonContentPage({
  params,
}: PageProps<"/admin/lessons/[id]/content">) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Editor params={params} />
      </Suspense>
    </main>
  );
}

async function Editor({
  params,
}: {
  params: PageProps<"/admin/lessons/[id]/content">["params"];
}) {
  await requireAdmin();

  const { id } = await params;
  const lesson = await fetchLesson(id).catch(handleMissing);

  return (
    <>
      <Link
        href={`/admin/courses/${lesson.course_id}/lessons`}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← Bài học của khoá
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Thứ tự khối chính là thứ tự hiển thị. Đổi dạng khối sẽ xoá nội dung đang
        gõ, vì mỗi dạng dùng những trường khác nhau.
      </p>

      <BlockEditor lessonId={lesson.id} initialBlocks={lesson.blocks} />
    </>
  );
}
