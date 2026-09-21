"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createEntry, deleteEntry, updateEntry, type EntryInput } from "../api";

/**
 * Danh sách từ của bài do Server Component dựng, nên sau mỗi lần ghi chỉ cần
 * router.refresh() — không có bản sao nào ở client để phải đồng bộ.
 */
export function useCreateEntry(lessonId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: EntryInput) => createEntry(lessonId, input),
    onSuccess: () => router.refresh(),
  });
}

export function useUpdateEntry() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      entryId,
      input,
    }: {
      entryId: string;
      input: Partial<EntryInput>;
    }) => updateEntry(entryId, input),
    onSuccess: () => router.refresh(),
  });
}

export function useDeleteEntry() {
  const router = useRouter();

  return useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    onSuccess: () => router.refresh(),
  });
}
