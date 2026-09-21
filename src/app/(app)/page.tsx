import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Lingora</h1>
        <p className="text-muted-foreground text-lg">
          Học tiếng Anh theo lộ trình khoá học và bài học, phân theo trình độ
          CEFR từ A1 đến C2.
        </p>
      </div>

      <div>
        <Button asChild size="lg">
          <Link href="/courses">Xem khoá học</Link>
        </Button>
      </div>
    </main>
  );
}
