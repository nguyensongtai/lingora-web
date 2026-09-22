import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "Tiến độ" };

export default function ProgressPage() {
  return (
    <ScreenPlaceholder
      title="Tiến độ"
      en="Progress"
      needs="API mới có XP, streak và hoạt động 7 ngày — đủ cho thẻ Hôm nay ở trang chủ, chưa đủ cho biểu đồ dài ngày và điểm sáu kỹ năng của màn này."
    />
  );
}
