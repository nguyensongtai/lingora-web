import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "AI Tutor" };

export default function TutorPage() {
  return (
    <ScreenPlaceholder
      title="AI Tutor"
      en="Speaking"
      needs="Chính design cũng đánh dấu màn này nằm ngoài phạm vi đợt hiện tại."
    />
  );
}
