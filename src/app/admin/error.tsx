"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ScreenMessage } from "@/features/shell/components/screen-message";

export default function AdminError({
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
      title="Không tải được trang quản trị"
      description="Máy chủ chưa trả lời được yêu cầu vừa rồi. Thử lại, hoặc quay về danh sách khoá học."
      href="/admin"
      linkLabel="Danh sách khoá học"
    >
      <Button onClick={reset}>Thử lại</Button>
    </ScreenMessage>
  );
}
