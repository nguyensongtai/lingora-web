import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

/**
 * Màn thông báo dùng chung cho 404 và cho error boundary. Cả hai đều là chỗ
 * người dùng tới lúc đang bực, nên chúng cần một lối đi tiếp chứ không chỉ một
 * câu mô tả.
 */
export function ScreenMessage({
  code,
  title,
  description,
  href,
  linkLabel,
  children,
}: {
  code: string;
  title: string;
  description: string;
  href?: Route;
  linkLabel?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-muted-foreground font-mono text-sm">{code}</p>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-110 leading-relaxed">
        {description}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {children}
        {href ? (
          <Button asChild variant={children ? "outline" : "default"}>
            <Link href={href}>{linkLabel ?? "Về trang chủ"}</Link>
          </Button>
        ) : null}
      </div>
    </main>
  );
}
