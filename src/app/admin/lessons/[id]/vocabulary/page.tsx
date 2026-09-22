import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchLesson } from "@/features/course/api";
import { EntryManager } from "@/features/vocabulary/components/entry-manager";
import type { VocabularyEntry } from "@/features/vocabulary/types";
import { handleMissing } from "@/lib/api/missing";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverFetch } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Từ vựng của bài",
};

export default function LessonVocabularyPage({
  params,
}: PageProps<"/admin/lessons/[id]/vocabulary">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      {/* requireAdmin đọc cookie: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <VocabularySection params={params} />
      </Suspense>
    </main>
  );
}

async function VocabularySection({
  params,
}: {
  params: PageProps<"/admin/lessons/[id]/vocabulary">["params"];
}) {
  await requireAdmin();
  const { id } = await params;

  const [lesson, entries] = await Promise.all([
    fetchLesson(id).catch(handleMissing),
    readLessonVocabulary(id),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link
          href={`/admin/courses/${lesson.course_id}/lessons`}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Bài học của khoá
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="text-muted-foreground text-sm">
          Từ ở đây vào lịch ôn của người học ngay khi họ đánh dấu xong bài này.
        </p>
      </header>

      <EntryManager lessonId={id} entries={entries} />
    </div>
  );
}

async function readLessonVocabulary(
  lessonId: string,
): Promise<VocabularyEntry[]> {
  const response = await serverFetch(
    `/vocabulary?lesson_id=${encodeURIComponent(lessonId)}`,
  );
  if (!response.ok) {
    throw new Error(`Không đọc được từ vựng (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { items: VocabularyEntry[] };
  return body.items;
}


