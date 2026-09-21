"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/client";

import { fetchCurrentUser } from "../api";
import type { User } from "../types";
import { authKeys } from "./query-keys";

/** Tài khoản đang đăng nhập; 401 nghĩa là chưa đăng nhập, không phải lỗi hệ thống. */
export function useSession(initialData?: User) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: fetchCurrentUser,
    initialData,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.isClientError) && failureCount < 2,
  });
}
