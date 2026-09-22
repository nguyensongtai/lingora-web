/**
 * Gốc công khai của site, dùng cho metadataBase, robots.txt và sitemap.
 *
 * Phải là URL tuyệt đối: thẻ og:image mà để đường dẫn tương đối thì Zalo hay
 * Facebook không tải được ảnh — chúng đọc thẻ từ máy chủ của chúng, không phải
 * từ trình duyệt người dùng.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);
