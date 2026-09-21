import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { VocabularyScreen } from "@/features/vocabulary/components/vocabulary-screen";
import {
  readVocabulary,
  readVocabularyStats,
} from "@/features/vocabulary/server";

export const metadata: Metadata = {
  title: "Từ vựng",
  description: "Ôn từ vựng theo lịch spaced repetition.",
};

export default function VocabularyPage() {
  return (
    <main className="app:px-8 app:pt-2 app:pb-16 mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-1 pb-24">
      {/* Cả hai lời gọi đều đọc cookie: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<VocabularySkeleton />}>
        <VocabularySection />
      </Suspense>
    </main>
  );
}

async function VocabularySection() {
  const [cards, stats] = await Promise.all([
    readVocabulary(),
    readVocabularyStats(),
  ]);

  return <VocabularyScreen initialCards={cards} initialStats={stats} />;
}

function VocabularySkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="rounded-card h-20 w-full" />
      <div className="grid gap-6 min-[720px]:grid-cols-2">
        <Skeleton className="rounded-card h-72 w-full" />
        <Skeleton className="rounded-card h-72 w-full" />
      </div>
    </div>
  );
}
