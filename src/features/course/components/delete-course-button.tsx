"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useDeleteCourse } from "../hooks/use-course-mutations";

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: {
  courseId: string;
  courseTitle: string;
}) {
  const { mutate, isPending, error } = useDeleteCourse();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          Xoá
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá khoá học?</AlertDialogTitle>
          <AlertDialogDescription>
            Khoá “{courseTitle}” sẽ biến mất khỏi danh sách. Đây là xoá mềm nên
            dữ liệu vẫn còn trong database và khôi phục được bằng SQL.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error.message}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              // Giữ dialog mở tới khi request xong để lỗi còn chỗ hiển thị.
              event.preventDefault();
              mutate(courseId);
            }}
          >
            {isPending ? "Đang xoá…" : "Xoá"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
