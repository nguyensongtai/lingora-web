import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "Tiến độ" };

export default function ProgressPage() {
  return (
    <ScreenPlaceholder
      title="Tiến độ"
      en="Progress"
      needs="API chưa ghi nhận tiến độ học, XP hay streak của người dùng."
    />
  );
}
