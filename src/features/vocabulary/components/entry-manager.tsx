"use client";

import { useState } from "react";

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

import type { EntryInput } from "../api";
import {
  useCreateEntry,
  useDeleteEntry,
  useUpdateEntry,
} from "../hooks/use-entry-mutations";
import type { VocabularyEntry } from "../types";

const EMPTY: EntryInput = {
  word: "",
  ipa: "",
  meaning: "",
  example: "",
  example_vi: "",
};

export function EntryManager({
  lessonId,
  entries,
}: {
  lessonId: string;
  entries: VocabularyEntry[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const create = useCreateEntry(lessonId);
  const update = useUpdateEntry();
  const remove = useDeleteEntry();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Từ vựng
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {entries.length} từ
          </span>
        </h2>

        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Bài này chưa có từ nào.
          </p>
        ) : (
          <ul className="divide-border divide-y rounded-lg border">
            {entries.map((entry, index) =>
              editingId === entry.id ? (
                <li key={entry.id} className="p-4">
                  <EntryForm
                    initial={toInput(entry)}
                    submitLabel="Lưu"
                    isPending={update.isPending}
                    error={update.error}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(input) =>
                      update.mutate(
                        { entryId: entry.id, input },
                        { onSuccess: () => setEditingId(null) },
                      )
                    }
                  />
                </li>
              ) : (
                <li
                  key={entry.id}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <span className="text-muted-foreground w-6 text-right text-sm tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-medium">{entry.word}</span>
                      {entry.ipa ? (
                        <span className="text-muted-foreground text-sm">
                          {entry.ipa}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {entry.meaning}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(entry.id)}
                    >
                      Sửa
                    </Button>
                    <DeleteEntry
                      word={entry.word}
                      isPending={remove.isPending}
                      onConfirm={() => remove.mutate(entry.id)}
                    />
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Thêm từ</h2>
        <div className="rounded-lg border p-4">
          <EntryForm
            key={entries.length}
            initial={EMPTY}
            submitLabel="Thêm từ"
            isPending={create.isPending}
            error={create.error}
            onSubmit={(input) => create.mutate(input)}
          />
        </div>
      </section>
    </div>
  );
}

function EntryForm({
  initial,
  submitLabel,
  isPending,
  error,
  onSubmit,
  onCancel,
}: {
  initial: EntryInput;
  submitLabel: string;
  isPending: boolean;
  error: Error | null;
  onSubmit: (input: EntryInput) => void;
  onCancel?: () => void;
}) {
  const [input, setInput] = useState(initial);
  const fieldErrors = error instanceof ApiError ? error.details : {};

  function set<K extends keyof EntryInput>(key: K, value: string) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(input);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="word" label="Từ" error={fieldErrors.word}>
          <Input
            id="word"
            required
            value={input.word}
            onChange={(event) => set("word", event.target.value)}
            aria-invalid={fieldErrors.word !== undefined}
          />
        </Field>
        <Field id="ipa" label="Phiên âm" error={fieldErrors.ipa}>
          <Input
            id="ipa"
            placeholder="/rɪˈlʌktənt/"
            value={input.ipa}
            onChange={(event) => set("ipa", event.target.value)}
          />
        </Field>
      </div>

      <Field id="meaning" label="Nghĩa tiếng Việt" error={fieldErrors.meaning}>
        <Input
          id="meaning"
          required
          value={input.meaning}
          onChange={(event) => set("meaning", event.target.value)}
          aria-invalid={fieldErrors.meaning !== undefined}
        />
      </Field>

      <Field id="example" label="Câu ví dụ" error={fieldErrors.example}>
        <Input
          id="example"
          value={input.example}
          onChange={(event) => set("example", event.target.value)}
        />
      </Field>

      <Field id="example_vi" label="Dịch câu ví dụ" error={fieldErrors.example_vi}>
        <Input
          id="example_vi"
          value={input.example_vi}
          onChange={(event) => set("example_vi", event.target.value)}
        />
      </Field>

      {error && Object.keys(fieldErrors).length === 0 ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Đang lưu…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}

function DeleteEntry({
  word,
  isPending,
  onConfirm,
}: {
  word: string;
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
          <AlertDialogTitle>Xoá từ “{word}”?</AlertDialogTitle>
          <AlertDialogDescription>
            Từ sẽ biến mất khỏi bài và khỏi lịch ôn của mọi người học.
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

function toInput(entry: VocabularyEntry): EntryInput {
  return {
    word: entry.word,
    ipa: entry.ipa,
    meaning: entry.meaning,
    example: entry.example,
    example_vi: entry.example_vi,
  };
}
