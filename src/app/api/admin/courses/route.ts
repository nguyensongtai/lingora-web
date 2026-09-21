import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/server-client";

import { forward } from "./forward";

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
