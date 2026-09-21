import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

/** Tạo khoá học. Token được gắn phía server nên client không cần biết tới nó. */
export async function POST(request: Request): Promise<NextResponse> {
  return forward(
    await serverFetch("/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
