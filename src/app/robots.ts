import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/**
 * Chỉ trang giới thiệu và trang đăng nhập là công khai; phần còn lại nằm sau
 * đăng nhập và chỉ trả về chuyển hướng cho bot.
 *
 * Chặn ở đây không phải là biện pháp bảo mật — robots.txt là yêu cầu lịch sự,
 * không phải hàng rào. Quyền đã được proxy và API canh. Cái này chỉ để kết quả
 * tìm kiếm không đầy những trang /login?next=…
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api/",
        "/learn",
        "/practice",
        "/progress",
        "/tutor",
        "/vocabulary",
        "/courses",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
