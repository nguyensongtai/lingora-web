"use client";

import { useState, type FormEvent } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";

import {
  useCreateLesson,
  useDeleteLesson,
  useReorderLessons,
  useUpdateLesson,
} from "../hooks/use-lesson-mutations";
import type { Lesson } from "../types";

type LessonManagerProps = {
  courseId: string;
  /** Nguồn sự thật là dữ liệu server; router.refresh() sau mỗi thay đổi sẽ cấp lại. */
  lessons: Lesson[];
};

export function LessonManager({ courseId, lessons }: LessonManagerProps) {
  const create = useCreateLesson(courseId);
  const update = useUpdateLesson(courseId);
  const remove = useDeleteLesson(courseId);
  const reorder = useReorderLessons(courseId);

  const [editingId, setEditingId] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    const ids = lessons.map((lesson) => lesson.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) {
      return;
    }
    // API yêu cầu đủ tập bài, nên luôn gửi cả mảng chứ không gửi riêng hai id.
    [ids[index], ids[target]] = [ids[target]!, ids[index]!];
    reorder.mutate(ids);
  }

  const reorderError = reorder.error instanceof ApiError ? reorder.error : undefined;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Bài học
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {lessons.length} bài
          </span>
        </h2>

        {reorderError ? (
          <p className="text-destructive text-sm" role="alert">
            {reorderError.details.lesson_ids ?? reorderError.message}
          </p>
        ) : null}

        {lessons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Khoá này chưa có bài nào. Thêm bài đầu tiên ở dưới.
          </p>
        ) : (
          <ol className="divide-border divide-y rounded-lg border">
            {lessons.map((lesson, index) => (
              <li key={lesson.id} className="px-4 py-3">
                {editingId === lesson.id ? (
                  <EditLessonRow
                    lesson={lesson}
                    isPending={update.isPending}
                    error={update.error instanceof ApiError ? update.error : undefined}
                    onCancel={() => setEditingId(null)}
                    onSave={(input) =>
                      update.mutate(
                        { lessonId: lesson.id, input },
                        { onSuccess: () => setEditingId(null) },
                      )
                    }
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-6 text-right text-sm tabular-nums">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{lesson.title}</p>
                      <p className="text-muted-foreground truncate font-mono text-xs">
                        {lesson.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Lên"
                        disabled={index === 0 || reorder.isPending}
                        onClick={() => move(index, -1)}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Xuống"
                        disabled={index === lessons.length - 1 || reorder.isPending}
                        onClick={() => move(index, 1)}
                      >
                        ↓
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(lesson.id)}>
                        Sửa
                      </Button>
                      <DeleteLesson
                        title={lesson.title}
                        isPending={remove.isPending}
                        onConfirm={() => remove.mutate(lesson.id)}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <NewLessonForm
        isPending={create.isPending}
        error={create.error instanceof ApiError ? create.error : undefined}
        onCreate={(input, reset) => create.mutate(input, { onSuccess: reset })}
      />
    </div>
  );
}

function NewLessonForm({
  isPending,
  error,
  onCreate,
}: {
  isPending: boolean;
  error?: ApiError;
  onCreate: (input: { slug: string; title: string }, reset: () => void) => void;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({ slug: slug.trim(), title: title.trim() }, () => {
      setSlug("");
      setTitle("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4" noValidate>
      <h3 className="font-medium">Thêm bài học</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lesson-title">Tiêu đề</Label>
          <Input
            id="lesson-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={error?.details.title !== undefined}
          />
          {error?.details.title ? (
            <p className="text-destructive text-sm">{error.details.title}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lesson-slug">Slug</Label>
          <Input
            id="lesson-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            aria-invalid={error?.details.slug !== undefined}
          />
          {error?.details.slug ? (
            <p className="text-destructive text-sm">{error.details.slug}</p>
          ) : null}
        </div>
      </div>

      {error && Object.keys(error.details).length === 0 ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang thêm…" : "Thêm bài học"}
      </Button>
      <p className="text-muted-foreground text-xs">Bài mới luôn được thêm vào cuối.</p>
    </form>
  );
}

function EditLessonRow({
  lesson,
  isPending,
  error,
  onSave,
  onCancel,
}: {
  lesson: Lesson;
  isPending: boolean;
  error?: ApiError;
  onSave: (input: { slug: string; title: string }) => void;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState(lesson.slug);
  const [title, setTitle] = useState(lesson.title);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Tiêu đề"
          aria-invalid={error?.details.title !== undefined}
        />
        <Input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          aria-label="Slug"
          aria-invalid={error?.details.slug !== undefined}
        />
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.details.slug ?? error.details.title ?? error.message}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => onSave({ slug: slug.trim(), title: title.trim() })}
        >
          {isPending ? "Đang lưu…" : "Lưu"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </div>
  );
}

function DeleteLesson({
  title,
  isPending,
  onConfirm,
}: {
  title: string;
  isPending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive">
          Xoá
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá bài học?</AlertDialogTitle>
          <AlertDialogDescription>
            Bài “{title}” sẽ biến mất khỏi khoá. Đây là xoá mềm nên dữ liệu vẫn
            còn trong database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onConfirm}>
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
