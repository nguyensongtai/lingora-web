import { NextResponse } from "next/server";

/**
 * forward chuyển nguyên trạng thái và body của API xuống client, kể cả lỗi —
 * nhờ vậy details theo field của API tới được form mà không phải dịch lại.
 */
export async function forward(upstream: Response): Promise<NextResponse> {
  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const body: unknown = await upstream.json().catch(() => null);
  return NextResponse.json(
    body ?? { code: "internal_error", message: "Không gọi được máy chủ." },
    { status: upstream.status },
  );
}
