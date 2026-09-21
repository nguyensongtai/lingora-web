import { ApiError, type ApiErrorBody } from "@/lib/api/client";

import type { LoginInput, RegisterRequest, User } from "./types";

/**
 * Client chỉ nói chuyện với Route Handler của Next, không bao giờ gọi thẳng API.
 * Token nằm trong httpOnly cookie do server quản lý nên JS không thấy nó.
 */
async function callBff<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function login(credentials: LoginInput): Promise<User> {
  return callBff<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function register(input: RegisterRequest): Promise<User> {
  return callBff<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<void> {
  return callBff<void>("/api/auth/logout", { method: "POST" });
}

export function fetchCurrentUser(): Promise<User> {
  return callBff<User>("/api/auth/me");
}
