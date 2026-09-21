"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logout } from "../api";
import { authKeys } from "./query-keys";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Dọn sạch cache kể cả khi API lỗi: cookie đã bị Route Handler xoá rồi.
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login");
      router.refresh();
    },
  });
}
