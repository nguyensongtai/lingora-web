import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/server-client";

import { forward } from "../../../forward";

type Context = { params: Promise<{ id: string }> };

/** Sắp xếp lại toàn bộ bài học của khoá. */
export async function PUT(
  request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { id } = await params;

  return forward(
    await serverFetch(`/courses/${encodeURIComponent(id)}/lessons/order`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
