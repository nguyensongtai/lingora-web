import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/**
 * Chỉ liệt kê trang khách vào được. Nội dung khoá học nằm sau đăng nhập nên
 * không có gì để lập chỉ mục — đưa vào sitemap thì chỉ dẫn bot tới một vòng
 * chuyển hướng.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/login", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
