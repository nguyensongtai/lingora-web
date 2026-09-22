import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";

import { ThemeScript } from "@/features/shell/components/theme-script";
import { siteUrl } from "@/lib/site";

import { Providers } from "./providers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase biến mọi đường dẫn ảnh tương đối thành URL tuyệt đối. Thiếu
  // nó thì og:image trỏ vào "/opengraph-image" và mạng xã hội không tải được.
  metadataBase: siteUrl,
  title: {
    default: "Lingora",
    template: "%s · Lingora",
  },
  description:
    "Học tiếng Anh theo lộ trình CEFR từ A1 đến C2. Mỗi ngày 10 phút, luôn biết mình đang ở đâu và học gì tiếp.",
  openGraph: {
    type: "website",
    siteName: "Lingora",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: ThemeScript gắn class "dark" trước khi React
    // hydrate, nên markup server và client lệch nhau một class là chuyện bình thường.
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
