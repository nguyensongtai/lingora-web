import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function GET(request: Request): Promise<NextResponse> {
  // days đi thẳng xuống API, nơi nó được kẹp về khoảng cho phép. Kiểm lại ở
  // đây là chép một quy tắc ra hai chỗ rồi để chúng trôi khỏi nhau.
  const days = new URL(request.url).searchParams.get("days") ?? "";

  return forward(
    await serverFetch(`/me/progress/history?days=${encodeURIComponent(days)}`),
  );
}
