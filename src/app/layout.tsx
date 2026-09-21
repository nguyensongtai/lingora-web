import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";

import { ThemeScript } from "@/features/shell/components/theme-script";

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
  title: {
    default: "Lingora",
    template: "%s · Lingora",
  },
  description: "Học tiếng Anh theo lộ trình khóa học và bài học.",
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
