import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function GET(request: Request): Promise<NextResponse> {
  // size đi thẳng xuống API, nơi nó được kẹp về khoảng cho phép.
  const size = new URL(request.url).searchParams.get("size") ?? "";

  return forward(
    await serverFetch(`/me/practice/session?size=${encodeURIComponent(size)}`),
  );
}
