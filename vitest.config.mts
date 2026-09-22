import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Cùng alias với tsconfig. Khai tay thay vì thêm một plugin nữa chỉ để
      // đọc lại một dòng cấu hình.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "server-only" là một module chỉ để Next báo lỗi khi bị import từ client.
      // Ngoài Next nó không tồn tại, nên test trỏ nó vào một file rỗng.
      "server-only": fileURLToPath(new URL("./src/test/empty.ts", import.meta.url)),
    },
  },
  test: {
    // Chỉ test logic thuần: chưa có test component nên chưa cần môi trường DOM.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
