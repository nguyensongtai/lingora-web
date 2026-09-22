import { PronounceButton } from "@/features/vocabulary/components/pronounce-button";

import type { LessonBlock } from "../types";

/**
 * Nội dung bài học. Ba dạng khối render khác hẳn nhau, nên chúng là ba
 * component chứ không phải một component có ba nhánh style.
 */
export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  if (blocks.length === 0) {
    return (
      <p className="text-muted-foreground border-border bg-card rounded-card border px-4 py-8 text-center text-sm">
        Bài này chưa có nội dung.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => (
        <Block key={block.id ?? index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "note":
      return <Note body={block.body} />;
    case "dialogue":
      return (
        <Line
          speaker={block.speaker}
          textEn={block.text_en}
          textVi={block.text_vi}
        />
      );
    default:
      return <Line textEn={block.text_en} textVi={block.text_vi} />;
  }
}

function Note({ body }: { body: string }) {
  return (
    <p className="text-[15px] leading-relaxed">
      {body}
    </p>
  );
}

/**
 * Một câu mẫu hoặc một lượt thoại. Hai dạng chỉ khác nhau ở chỗ có tên người
 * nói hay không, nên dùng chung một khối để câu tiếng Anh luôn nằm cùng một vị
 * trí — mắt người đọc không phải dò lại ở mỗi khối.
 */
function Line({
  speaker,
  textEn,
  textVi,
}: {
  speaker?: string;
  textEn: string;
  textVi: string;
}) {
  return (
    <div className="border-border bg-card rounded-card flex items-start gap-3 border p-4">
      <div className="min-w-0 flex-1">
        {speaker ? (
          <span className="text-brand-strong mb-0.5 block text-[13px] font-semibold">
            {speaker}
          </span>
        ) : null}
        <p className="text-[15px] leading-relaxed font-semibold">{textEn}</p>
        {textVi ? (
          <p className="text-muted-foreground mt-1 text-sm">{textVi}</p>
        ) : null}
      </div>
      <PronounceButton word={textEn} />
    </div>
  );
}
