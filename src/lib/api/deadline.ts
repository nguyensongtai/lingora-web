/**
 * Hạn chờ cho mọi lời gọi tới lingora-api. Không có nó, một API treo (chứ không
 * phải chết) khiến trang đứng ở skeleton vĩnh viễn — người dùng không biết là
 * hỏng hay chỉ chậm, và không có gì để thử lại.
 *
 * 10 giây là chọn theo phía người dùng chứ không theo phía máy chủ: API đã tự
 * cắt ở 30 giây, nhưng chờ 30 giây trước một màn hình trống thì thà báo lỗi.
 *
 * File này cố ý không phụ thuộc gì: proxy chạy ở Edge runtime cũng dùng chung.
 */
export const REQUEST_TIMEOUT_MS = 10_000;

/**
 * fetchWithDeadline gộp hạn chờ với signal của người gọi thay vì ghi đè nó:
 * TanStack Query dùng signal đó để huỷ query khi component unmount, mất nó là
 * mất luôn việc huỷ.
 */
export function fetchWithDeadline(
  input: Request | string | URL,
  init?: RequestInit,
): Promise<Response> {
  const deadline = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, deadline])
    : deadline;

  return fetch(input, { ...init, signal });
}
