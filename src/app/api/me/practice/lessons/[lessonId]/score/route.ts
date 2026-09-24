import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

type Context = { params: Promise<{ lessonId: string }> };

export async function PUT(request: Request, { params }: Context): Promise<NextResponse> {
  const { lessonId } = await params;
  return forward(
    await serverFetch(`/me/practice/lessons/${encodeURIComponent(lessonId)}/score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
