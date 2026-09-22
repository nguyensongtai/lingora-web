import createClient from "openapi-fetch";

import { fetchWithDeadline } from "./deadline";

import type { components, paths } from "./schema";

/** Body lỗi thống nhất của API, sinh từ openapi.yaml. */
export type ApiErrorBody = components["schemas"]["Error"];

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/v1";

export const apiClient = createClient<paths>({
  baseUrl: apiBaseUrl,
  fetch: fetchWithDeadline,
});

/**
 * ApiError giữ nguyên code và details của API để UI chọn được thông báo, thay
 * vì chỉ có một chuỗi message.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorBody["code"] | "unknown";
  readonly details: Record<string, string>;

  constructor(status: number, body: ApiErrorBody | undefined) {
    super(body?.message ?? "Không gọi được máy chủ.");
    this.name = "ApiError";
    this.status = status;
    this.code = body?.code ?? "unknown";
    this.details = body?.details ?? {};
  }

  /** Lỗi 4xx do dữ liệu người dùng nhập thì không nên thử lại. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

type ApiResult<T> = {
  data?: T;
  error?: ApiErrorBody;
  response: Response;
};

/**
 * unwrap biến kết quả hai nhánh của openapi-fetch thành giá trị hoặc throw,
 * để TanStack Query nhận đúng trạng thái error.
 */
export function unwrap<T>({ data, error, response }: ApiResult<T>): T {
  if (error !== undefined || !response.ok) {
    throw new ApiError(response.status, error);
  }
  if (data === undefined) {
    throw new ApiError(response.status, undefined);
  }
  return data;
}
