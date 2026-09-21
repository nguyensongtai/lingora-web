import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "Lộ trình học" };

export default function LearnPage() {
  return (
    <ScreenPlaceholder
      title="Lộ trình học"
      en="Learning path"
      needs="đang dựng ở commit sau."
    />
  );
}
