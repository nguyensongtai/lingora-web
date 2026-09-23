import type { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PracticeScreen } from "@/features/practice/components/practice-screen";
import { readSession } from "@/features/practice/server";

export const metadata: Metadata = {
  title: "Luyện tập",
  description: "Luyện lại vốn từ đã học bằng trắc nghiệm, điền từ và nghe.",
};

export default function PracticePage() {
  return (
    <main className="mx-auto flex w-full max-w-160 flex-1 flex-col gap-6 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          Luyện tập{" "}
          <span className="text-muted-foreground text-base font-medium">
            · Practice
          </span>
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Câu hỏi dựng từ chính những từ bạn đã mở khoá. Trả lời sai thì từ đó
          quay lại hàng đợi ôn sớm hơn; trả lời đúng không đổi lịch ôn.
        </p>
      </div>

      {/* Đọc cookie: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<PracticeSkeleton />}>
        <Session />
      </Suspense>
    </main>
  );
}

async function Session() {
  const questions = await readSession({ kind: "review" });

  return <PracticeScreen scope={{ kind: "review" }} initialQuestions={questions} />;
}

function PracticeSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-72 w-full rounded-card" />
    </div>
  );
}
