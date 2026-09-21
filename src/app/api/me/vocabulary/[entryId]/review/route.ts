import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

type Context = { params: Promise<{ entryId: string }> };

export async function POST(
  request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { entryId } = await params;

  return forward(
    await serverFetch(`/me/vocabulary/${encodeURIComponent(entryId)}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
