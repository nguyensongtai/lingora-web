import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Dấu trạng thái của một bài trong danh sách: số thứ tự khi chưa xong, dấu
 * tick khi đã xong.
 *
 * Cố ý KHÔNG bấm được. Nó từng là nút đánh dấu xong, và nằm ngay cạnh một tên
 * bài không bấm được — nên thao tác dễ nhất trên danh sách là tick cả khoá, lấy
 * XP mà chưa mở bài nào. Giờ "Đã xong" chỉ nằm ở bước cuối của bài.
 */
export function LessonStatus({ done, position }: { done: boolean; position: number }) {
  return (
    <span
      aria-label={done ? "Đã xong" : `Bài ${position + 1}`}
      className={cn(
        "grid size-6 flex-none place-items-center rounded-full border-2 text-[11px] font-bold",
        done ? "bg-brand border-transparent text-white" : "border-border text-muted-foreground",
      )}
    >
      {done ? <Check className="size-3.5" strokeWidth={3} /> : position + 1}
    </span>
  );
}
