"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { login } from "../api";
import type { LoginRequest } from "../types";
import { authKeys } from "./query-keys";

export function useLogin(redirectTo: string) {
  // next đến từ URL nên chỉ còn là chuỗi lúc chạy; page đã lọc để nó luôn là
  // đường dẫn nội bộ trước khi tới đây.
  const destination = redirectTo as Route;
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session(), user);
      // refresh() để Server Component đọc lại cookie phiên vừa được đặt.
      router.replace(destination);
      router.refresh();
    },
  });
}
