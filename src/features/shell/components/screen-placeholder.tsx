import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Màn đã có trong design nhưng chưa có dữ liệu để dựng. Nói thẳng là chưa làm,
 * thay vì bày số liệu mẫu khiến người xem tưởng tính năng đã chạy.
 */
export function ScreenPlaceholder({
  title,
  en,
  needs,
}: {
  title: string;
  en: string;
  needs: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col items-center justify-center gap-4 px-4 pt-1 pb-24 text-center app:px-8 app:pt-2 app:pb-16">
      <h1 className="text-2xl font-bold tracking-tight">
        {title}{" "}
        <span className="text-muted-foreground text-base font-medium">
          · {en}
        </span>
      </h1>
      <p className="text-muted-foreground max-w-100">
        Màn này đã có trong design nhưng chưa dựng được: {needs}
      </p>
      <Button asChild>
        <Link href="/learn">Tới lộ trình học</Link>
      </Button>
    </main>
  );
}
