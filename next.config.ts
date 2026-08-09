import type { NextConfig } from "next";

const isGithubPages = process.env.BUILD_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export", basePath: "/tuttogusto", trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
