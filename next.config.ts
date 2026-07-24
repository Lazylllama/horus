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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hackclub.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
