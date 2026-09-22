import { notFound } from "next/navigation";

import { ApiError } from "./client";

/**
 * 400 được coi như 404 khi id nằm trong đường dẫn: một id sai định dạng không
 * thể trỏ tới bản ghi nào, nên với người vừa dán nhầm URL thì "không hợp lệ"
 * và "không tồn tại" là cùng một chuyện. Không gộp thì họ nhận trang lỗi máy
 * chủ cho một lỗi hoàn toàn của phía họ.
 */
export function isMissing(status: number): boolean {
  return status === 404 || status === 400;
}

/** Dùng khi đang cầm Response thô. */
export function notFoundIfMissing(...statuses: number[]): void {
  if (statuses.some(isMissing)) {
    notFound();
  }
}

/** Dùng trong .catch() của một lời gọi ném ApiError. */
export function handleMissing(error: unknown): never {
  if (error instanceof ApiError && isMissing(error.status)) {
    notFound();
  }
  throw error;
}
