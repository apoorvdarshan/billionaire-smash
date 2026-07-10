import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@libsql/**/*",
    ],
  },
};

export default nextConfig;
