import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bsmash.app" }],
        destination: "https://bsmash.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
