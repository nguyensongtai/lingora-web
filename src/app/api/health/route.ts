import { NextResponse } from "next/server";

/**
 * Health check cho nền tảng deploy. Cố ý KHÔNG gọi API: web còn sống thì trả
 * 200, kể cả khi API đang hỏng — nếu không, một sự cố của API sẽ khiến nền
 * tảng khởi động lại cả web, và người dùng mất luôn trang lỗi đáng lẽ thấy được.
 */
export function GET(): NextResponse {
  return NextResponse.json({ status: "ok" });
}
