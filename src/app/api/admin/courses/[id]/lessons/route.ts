import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/server-client";

import { forward } from "../../forward";

type Context = { params: Promise<{ id: string }> };

/** Thêm bài học vào khoá. */
export async function POST(
  request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { id } = await params;

  return forward(
    await serverFetch(`/courses/${encodeURIComponent(id)}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
