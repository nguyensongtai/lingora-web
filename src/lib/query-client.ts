import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Server Component đã render sẵn dữ liệu, không refetch ngay khi hydrate.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Cho phép stream cả query đang pending từ server xuống client.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Trên server luôn tạo client mới cho mỗi request; trên browser dùng chung một
 * instance để cache sống qua các lần điều hướng.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
