import "server-only";

import { serverFetch } from "@/lib/api/server-client";

import { EMPTY_PROGRESS, type ProgressSnapshot } from "./types";

/**
 * Khách chưa đăng nhập nhận snapshot rỗng chứ không phải lỗi: mọi màn đều vẽ
 * được khi chưa có tiến độ, nên không có lý do bắt phía trên rẽ nhánh.
 */
export async function readProgress(): Promise<ProgressSnapshot> {
  const response = await serverFetch("/me/progress");

  if (response.status === 401) {
    return EMPTY_PROGRESS;
  }
  if (!response.ok) {
    throw new Error(`Không đọc được tiến độ học (HTTP ${response.status}).`);
  }

  return (await response.json()) as ProgressSnapshot;
}
