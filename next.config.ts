import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "specials-images.forbesimg.com",
      },
      {
        protocol: "https",
        hostname: "i.forbesimg.com",
      },
      {
        protocol: "https",
        hostname: "imageio.forbes.com",
      },
    ],
  },
};

export default nextConfig;
