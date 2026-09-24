import { NextResponse } from "next/server";

import type { ApiErrorBody } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { forward } from "@/lib/api/forward";
import { serverFetch } from "@/lib/api/server-client";

type User = components["schemas"]["User"];

/** Tài khoản đang đăng nhập, cho Client Component hỏi mà không cần thấy token. */
export async function GET(): Promise<NextResponse> {
  const upstream = await serverFetch("/auth/me");

  if (!upstream.ok) {
    const failure = (await upstream.json().catch(() => null)) as ApiErrorBody | null;
    return NextResponse.json(
      failure ?? { code: "unauthorized", message: "Chưa đăng nhập." },
      { status: upstream.status },
    );
  }

  return NextResponse.json((await upstream.json()) as User);
}

/** Sửa tên hiển thị và/hoặc mục tiêu XP. Body đi thẳng xuống API, nơi nó được kiểm. */
export async function PATCH(request: Request): Promise<NextResponse> {
  return forward(
    await serverFetch("/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
