"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";

import { useCreateCourse, useUpdateCourse } from "../hooks/use-course-mutations";
import {
  COURSE_LEVELS,
  LEVEL_LABELS,
  STATUS_LABELS,
  type Course,
  type CourseLevel,
  type CourseStatus,
} from "../types";

type CourseFormProps = {
  /** Có course nghĩa là đang sửa; không có nghĩa là đang tạo mới. */
  course?: Course;
};

const STATUSES: readonly CourseStatus[] = ["draft", "published"];

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [level, setLevel] = useState<CourseLevel>(course?.level ?? "A1");
  const [status, setStatus] = useState<CourseStatus>(course?.status ?? "draft");
  const [coverImageUrl, setCoverImageUrl] = useState(course?.cover_image_url ?? "");

  const create = useCreateCourse();
  const update = useUpdateCourse(course?.id ?? "");
  const mutation = course ? update : create;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCover = coverImageUrl.trim();
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      description: description.trim(),
      level,
      status,
      // Chuỗi rỗng phải thành null: đó là cách API hiểu "xoá ảnh bìa".
      cover_image_url: trimmedCover === "" ? null : trimmedCover,
    };

    mutation.mutate(payload, {
      onSuccess: () => router.push("/admin"),
    });
  }

  const fieldErrors =
    mutation.error instanceof ApiError ? mutation.error.details : {};
  const generalError =
    mutation.error && Object.keys(fieldErrors).length === 0
      ? mutation.error.message
      : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field id="title" label="Tiêu đề" error={fieldErrors.title}>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={fieldErrors.title !== undefined}
        />
      </Field>

      <Field
        id="slug"
        label="Slug"
        hint="Chữ thường, số và dấu gạch ngang, ví dụ ngu-phap-co-ban."
        error={fieldErrors.slug}
      >
        <Input
          id="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          aria-invalid={fieldErrors.slug !== undefined}
        />
      </Field>

      <Field id="description" label="Mô tả" error={fieldErrors.description}>
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="level" label="Trình độ" error={fieldErrors.level}>
          <Select value={level} onValueChange={(value) => setLevel(value as CourseLevel)}>
            <SelectTrigger id="level" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_LEVELS.map((value) => (
                <SelectItem key={value} value={value}>
                  {value} · {LEVEL_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="status" label="Trạng thái" error={fieldErrors.status}>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as CourseStatus)}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {STATUS_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        id="cover_image_url"
        label="Ảnh bìa"
        hint="Để trống nghĩa là không có ảnh bìa."
        error={fieldErrors.cover_image_url}
      >
        <Input
          id="cover_image_url"
          type="url"
          placeholder="https://…"
          value={coverImageUrl}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          aria-invalid={fieldErrors.cover_image_url !== undefined}
        />
      </Field>

      {generalError ? (
        <p className="text-destructive text-sm" role="alert">
          {generalError}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Đang lưu…" : course ? "Lưu thay đổi" : "Tạo khoá học"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
