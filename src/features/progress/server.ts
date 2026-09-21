import "server-only";

import { cache } from "react";

import { serverFetch } from "@/lib/api/server-client";

import { EMPTY_PROGRESS, type ProgressSnapshot } from "./types";

/**
 * Khách chưa đăng nhập nhận snapshot rỗng chứ không phải lỗi: mọi màn đều vẽ
 * được khi chưa có tiến độ, nên không có lý do bắt phía trên rẽ nhánh.
 *
 * Bọc cache() vì cả khung app lẫn trang bên trong đều cần snapshot; không có nó
 * thì mỗi lần dựng trang lại gọi API hai lần cho cùng một dữ liệu.
 */
export const readProgress = cache(async function readProgress(): Promise<ProgressSnapshot> {
  const response = await serverFetch("/me/progress");

  if (response.status === 401) {
    return EMPTY_PROGRESS;
  }
  if (!response.ok) {
    throw new Error(`Không đọc được tiến độ học (HTTP ${response.status}).`);
  }

  return (await response.json()) as ProgressSnapshot;
});
