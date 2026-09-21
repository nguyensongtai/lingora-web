"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { register } from "../api";
import type { RegisterRequest } from "../types";

import { authKeys } from "./query-keys";

export function useRegister(redirectTo: string) {
  // next đến từ URL nên chỉ còn là chuỗi lúc chạy; page đã lọc để nó luôn là
  // đường dẫn nội bộ trước khi tới đây.
  const destination = redirectTo as Route;
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterRequest) => register(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session(), user);
      router.replace(destination);
      router.refresh();
    },
  });
}
