import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bản build tự chứa (.next/standalone) cho Docker image: chỉ kéo theo đúng
  // những gói server cần, không cả node_modules.
  output: "standalone",
  // Cache Components: mọi dữ liệu động phải nằm trong Suspense hoặc được đánh dấu "use cache".
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
