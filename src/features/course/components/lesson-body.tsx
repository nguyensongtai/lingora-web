import { PronounceButton } from "@/features/vocabulary/components/pronounce-button";
import { cn } from "@/lib/utils";

import { speakerSides } from "../lesson-steps";
import type { LessonBlock } from "../types";

/**
 * Nội dung bài học. Ba dạng khối render khác hẳn nhau, nên chúng là ba
 * component chứ không phải một component có ba nhánh style.
 */
export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  // Hội thoại xếp hai bên như khung chat: người nói trước bên trái. Nhìn vào là
  // biết ai đang nói mà không phải đọc tên từng lượt.
  const sides = speakerSides(blocks);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => (
        <Block key={block.id ?? index} block={block} side={sides.get(block.speaker)} />
      ))}
    </div>
  );
}

function Block({ block, side }: { block: LessonBlock; side?: "start" | "end" }) {
  switch (block.kind) {
    case "note":
      return <Note body={block.body} />;
    case "dialogue":
      return (
        <Line
          speaker={block.speaker}
          side={side}
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
  side,
  textEn,
  textVi,
}: {
  speaker?: string;
  side?: "start" | "end";
  textEn: string;
  textVi: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-card flex items-start gap-3 border p-4",
        side && "w-[88%]",
        side === "end" && "bg-brand-soft self-end",
      )}
    >
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
