import type { Metadata } from "next";

import { ScreenPlaceholder } from "@/features/shell/components/screen-placeholder";

export const metadata: Metadata = { title: "Từ vựng" };

export default function VocabularyPage() {
  return (
    <ScreenPlaceholder
      title="Từ vựng"
      en="Vocabulary"
      needs="API chưa có bảng từ vựng và lịch ôn theo spaced repetition."
    />
  );
}
