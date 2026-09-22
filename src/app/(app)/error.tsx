"use client";

import { useEffect } from "react";

import { RetryButton } from "@/features/shell/components/retry-button";
import { ScreenMessage } from "@/features/shell/components/screen-message";

/**
 * Boundary riêng cho khu vực đã đăng nhập: nó nằm dưới layout nên AppShell vẫn
 * render, người dùng giữ được thanh điều hướng thay vì rơi ra một trang trắng.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ScreenMessage
      code={error.digest ? `Lỗi ${error.digest}` : "Lỗi"}
      title="Màn hình này không tải được"
      description="Máy chủ chưa trả lời được yêu cầu vừa rồi. Thử lại, hoặc chuyển sang mục khác ở thanh bên."
      href="/learn"
      linkLabel="Tới lộ trình học"
    >
      <RetryButton reset={reset} />
    </ScreenMessage>
  );
}
