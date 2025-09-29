import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/conversations",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: [
    '192.168.1.*',
    // Add other IPs as needed
  ],
};

export default nextConfig;
