import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  redirects: async () => [
    {
      source: "/admin",
      destination: "/dashboard/admin",
      permanent: true,
    },
  ],
};

export default nextConfig;
