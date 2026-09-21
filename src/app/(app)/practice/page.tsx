import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "Luyện tập" };

export default function PracticePage() {
  return (
    <ScreenPlaceholder
      title="Luyện tập"
      en="Practice"
      needs="API chưa có điểm kỹ năng, lịch sử phiên học hay danh sách lỗi gần đây."
    />
  );
}
