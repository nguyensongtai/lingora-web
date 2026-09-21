"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchProgress } from "../api";
import type { ProgressSnapshot } from "../types";

import { progressKeys } from "./query-keys";

/**
 * initialData là snapshot Server Component đã đọc sẵn, nên lần vẽ đầu không có
 * nhấp nháy. Từ đó trở đi TanStack Query giữ nguồn sự thật để các lần đánh dấu
 * hiện ra ngay mà không phải dựng lại cả trang.
 */
export function useProgress(initialData: ProgressSnapshot) {
  return useQuery({
    queryKey: progressKeys.snapshot(),
    queryFn: () => fetchProgress(),
    initialData,
  });
}
