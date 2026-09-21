import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

type Context = { params: Promise<{ lessonId: string }> };

function path(lessonId: string): string {
  return `/me/progress/lessons/${encodeURIComponent(lessonId)}`;
}

export async function PUT(
  _request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { lessonId } = await params;
  return forward(await serverFetch(path(lessonId), { method: "PUT" }));
}

export async function DELETE(
  _request: Request,
  { params }: Context,
): Promise<NextResponse> {
  const { lessonId } = await params;
  return forward(await serverFetch(path(lessonId), { method: "DELETE" }));
}
