import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";
const isGithubPages = !isVercel && process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export", basePath: "/tuttogusto", trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
