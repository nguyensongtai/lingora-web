import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

type Context = { params: Promise<{ entryId: string }> };

function path(entryId: string): string {
  return `/vocabulary/${encodeURIComponent(entryId)}`;
}

export async function PATCH(
  request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { entryId } = await params;

  return forward(
    await serverFetch(path(entryId), {
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
  const { entryId } = await params;
  return forward(await serverFetch(path(entryId), { method: "DELETE" }));
}
