import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function GET(): Promise<NextResponse> {
  return forward(await serverFetch("/me/progress"));
}
