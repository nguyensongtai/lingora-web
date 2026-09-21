import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function PUT(request: Request): Promise<NextResponse> {
  return forward(
    await serverFetch("/courses/order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
