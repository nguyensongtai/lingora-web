"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ScreenMessage } from "@/features/shell/components/screen-message";

/**
 * Error boundary của toàn app. Next chỉ đưa xuống đây `digest` — thông điệp
 * thật nằm trong log của server — nên trang này nói được điều gì đã hỏng ở mức
 * chung, kèm mã để đối chiếu log, và không đoán thêm.
 */
export default function ErrorScreen({
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
      title="Trang này không tải được"
      description="Máy chủ chưa trả lời được yêu cầu vừa rồi. Thử lại một lần; nếu vẫn vậy thì quay lại sau ít phút."
      href="/"
      linkLabel="Về trang chủ"
    >
      <Button onClick={reset}>Thử lại</Button>
    </ScreenMessage>
  );
}
