/**
 * Origin giả chỉ dùng để phân giải đường dẫn tương đối. `.invalid` là TLD được
 * RFC 2606 dành riêng cho mục đích này, nên nó không bao giờ là một site thật.
 */
const RESOLUTION_BASE = "http://lingora.invalid";

/**
 * safePath lọc tham số `next` / `redirect` đến từ URL, chỉ giữ lại đường dẫn
 * nội bộ. Trả về "/" cho mọi thứ khác.
 *
 * Kiểm bằng cách phân giải thật rồi so origin, chứ không kiểm tiền tố chuỗi.
 * Kiểm tiền tố kiểu `startsWith("/") && !startsWith("//")` để lọt ít nhất hai
 * đường, cả hai đều đã thử trong trình duyệt thật:
 *
 *   "/\\evil.example"   → trình duyệt đổi \ thành / rồi đọc ra http://evil.example
 *   "/\t/evil.example"  → tab bị lược bỏ, còn lại //evil.example
 *
 * Cả hai qua được kiểm tiền tố, và đều đưa người vừa đăng nhập sang site khác.
 */
export function safePath(raw: string | string[] | null | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) {
    return "/";
  }

  try {
    const url = new URL(value, RESOLUTION_BASE);
    if (url.origin !== RESOLUTION_BASE) {
      return "/";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    // Chuỗi không phân giải được thì cũng không dùng được.
    return "/";
  }
}
