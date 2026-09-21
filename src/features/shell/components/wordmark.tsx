import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Chỉ dùng ảnh mark cộng chữ đặt bằng Be Vietnam Pro, không dùng file wordmark
 * của design: chữ trong file đó màu trắng trên nền trong suốt nên biến mất
 * trên chính tấm nền sáng mà design đặt nó lên.
 */
export function Wordmark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/brand/lingora-mark.png"
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        priority
      />
      <span
        className="text-brand-ink font-bold tracking-tight"
        style={{ fontSize: size >= 32 ? 18 : 16 }}
      >
        Lingora
      </span>
    </Link>
  );
}
