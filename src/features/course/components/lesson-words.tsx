import { PronounceButton } from "@/features/vocabulary/components/pronounce-button";
import type { VocabularyEntry } from "@/features/vocabulary/types";

/**
 * Bước Từ vựng: gặp từ trước khi nghe chúng trong hội thoại.
 *
 * Câu ví dụ hiện ngay dưới từ vì đó là thứ bước Luyện tập sẽ khoét chỗ trống —
 * người học nên thấy câu đó nguyên vẹn một lần trước khi phải điền vào.
 */
export function LessonWords({ words }: { words: VocabularyEntry[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {words.map((entry) => (
        <li
          key={entry.id}
          className="border-border bg-card rounded-card flex items-start gap-3 border p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[17px] font-bold">{entry.word}</span>
              {entry.ipa ? (
                <span className="text-muted-foreground font-mono text-[13px]">{entry.ipa}</span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[15px]">{entry.meaning}</p>
            {entry.example ? (
              <div className="border-border mt-2.5 border-l-2 pl-3">
                <p className="text-sm font-medium">{entry.example}</p>
                {entry.example_vi ? (
                  <p className="text-muted-foreground mt-0.5 text-sm">{entry.example_vi}</p>
                ) : null}
              </div>
            ) : null}
          </div>
          <PronounceButton word={entry.word} />
        </li>
      ))}
    </ul>
  );
}
