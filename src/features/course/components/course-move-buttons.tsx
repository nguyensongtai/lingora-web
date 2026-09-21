"use client";

import { Button } from "@/components/ui/button";
import type { CourseLevel } from "../types";

import { useReorderCourses } from "../hooks/use-course-mutations";

/**
 * Đổi thứ tự khoá trong một bậc bằng hai nút thay vì kéo thả: không thêm thư
 * viện, dùng được bằng bàn phím, và mỗi lần bấm vẫn gửi nguyên mảng nên khớp
 * ràng buộc "đủ tập khoá" của API.
 */
export function CourseMoveButtons({
  level,
  courseIds,
  index,
}: {
  level: CourseLevel;
  courseIds: string[];
  index: number;
}) {
  const reorder = useReorderCourses();

  function move(offset: number) {
    const target = index + offset;
    if (target < 0 || target >= courseIds.length) {
      return;
    }

    const ids = [...courseIds];
    [ids[index], ids[target]] = [ids[target]!, ids[index]!];
    reorder.mutate({ level, courseIds: ids });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Đưa lên trên trong bậc ${level}`}
        disabled={index === 0 || reorder.isPending}
        onClick={() => move(-1)}
      >
        ↑
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Đưa xuống dưới trong bậc ${level}`}
        disabled={index === courseIds.length - 1 || reorder.isPending}
        onClick={() => move(1)}
      >
        ↓
      </Button>
    </>
  );
}
