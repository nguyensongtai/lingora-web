import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function GET(request: Request): Promise<NextResponse> {
  const state = new URL(request.url).searchParams.get("state");
  const query = state ? `?state=${encodeURIComponent(state)}` : "";

  return forward(await serverFetch(`/me/vocabulary${query}`));
}
