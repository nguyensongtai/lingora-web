import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import type { DailyGoal, User } from "./types";

async function callBff<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }
  return (await response.json()) as T;
}

export function updateProfile(input: {
  displayName?: string;
  dailyGoalXp?: DailyGoal;
}): Promise<User> {
  return callBff<User>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify({
      ...(input.displayName !== undefined ? { display_name: input.displayName } : {}),
      ...(input.dailyGoalXp !== undefined ? { daily_goal_xp: input.dailyGoalXp } : {}),
    }),
  });
}

export function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<User> {
  return callBff<User>("/api/auth/me/password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: input.currentPassword,
      new_password: input.newPassword,
    }),
  });
}

/** Thông báo cho một field từ details của API, nếu có. */
export function fieldError(error: unknown, field: string): string | undefined {
  return error instanceof ApiError ? error.details[field] : undefined;
}
