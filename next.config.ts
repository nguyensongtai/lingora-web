import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: mọi dữ liệu động phải nằm trong Suspense hoặc được đánh dấu "use cache".
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
