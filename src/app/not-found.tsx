import type { Metadata } from "next";

import { ScreenMessage } from "@/features/shell/components/screen-message";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <ScreenMessage
      code="404"
      title="Không tìm thấy trang này"
      description="Đường dẫn có thể đã đổi, hoặc nội dung đã bị gỡ. Thử quay lại lộ trình học."
      href="/"
    />
  );
}
