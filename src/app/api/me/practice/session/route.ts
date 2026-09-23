import { NextResponse } from "next/server";

import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

export async function GET(request: Request): Promise<NextResponse> {
  // Chỉ chuyển tiếp đúng hai tham số API hiểu. size được kẹp ở API; lesson_id
  // sai định dạng thì API trả 400, không cần kiểm lại ở đây.
  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams();
  for (const name of ["size", "lesson_id"]) {
    const value = incoming.get(name);
    if (value !== null) {
      query.set(name, value);
    }
  }

  return forward(await serverFetch(`/me/practice/session?${query.toString()}`));
}
