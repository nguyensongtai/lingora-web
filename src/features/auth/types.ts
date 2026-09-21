import type { components } from "@/lib/api/schema";

export type User = components["schemas"]["User"];
export type UserRole = components["schemas"]["UserRole"];
export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];

/** LoginRequest cộng lựa chọn chỉ có ý nghĩa với trình duyệt, không gửi lên API. */
export type LoginInput = LoginRequest & { remember: boolean };

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Quản trị",
  student: "Học viên",
};
