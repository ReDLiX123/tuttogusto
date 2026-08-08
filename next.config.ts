import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tuttogusto",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
