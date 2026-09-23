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
      {/* Màn học chia bài theo bước và gom khối theo dạng, nên thứ tự ở đây
          chỉ còn là thứ tự TRONG từng bước — nói sai điều này thì người soạn
          sẽ xếp khối để dựng một trình tự không bao giờ hiện ra. */}
      <div className="text-muted-foreground mt-1 mb-6 flex flex-col gap-1.5 text-sm">
        <p>
          Người học đi qua bài theo bước: Từ vựng → Hội thoại → Cách dùng → Luyện
          tập. Khối hội thoại vào bước Hội thoại; giải thích và câu mẫu vào bước
          Cách dùng. Thứ tự ở đây là thứ tự bên trong từng bước.
        </p>
        <p>
          Từ vựng và bài luyện lấy từ danh sách từ của bài, không soạn ở đây. Câu
          mẫu trùng nguyên văn câu ví dụ của một từ sẽ bị ẩn, vì người học đã
          thấy nó ở bước Từ vựng. Đổi dạng khối sẽ xoá nội dung đang gõ.
        </p>
      </div>

      <BlockEditor lessonId={lesson.id} initialBlocks={lesson.blocks} />
    </>
  );
}
