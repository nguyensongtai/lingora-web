import type { components } from "@/lib/api/schema";

export type User = components["schemas"]["User"];
export type UserRole = components["schemas"]["UserRole"];
export type LoginRequest = components["schemas"]["LoginRequest"];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Quản trị",
  student: "Học viên",
};
