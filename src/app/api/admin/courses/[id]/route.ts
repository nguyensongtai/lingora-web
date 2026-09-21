import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/server-client";

import { forward } from "../forward";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(
  request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { id } = await params;

  return forward(
    await serverFetch(`/courses/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}

export async function DELETE(
  _request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { id } = await params;

  return forward(
    await serverFetch(`/courses/${encodeURIComponent(id)}`, { method: "DELETE" }),
  );
}
