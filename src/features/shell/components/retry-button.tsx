"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

/**
 * Nút thử lại cho error boundary. reset() một mình không đủ khi lỗi đến từ
 * Server Component: router vẫn giữ kết quả hỏng trong cache, nên bấm bao nhiêu
 * lần cũng ra đúng màn lỗi đó. router.refresh() mới là thứ đi hỏi lại server.
 */
export function RetryButton({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(() => {
          router.refresh();
          reset();
        });
      }}
      disabled={pending}
    >
      {pending ? "Đang thử lại…" : "Thử lại"}
    </Button>
  );
}
