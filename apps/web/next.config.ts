import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/tiza" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/tiza/" : "",
  env: {
    GITHUB_REPO: process.env.GITHUB_REPO || "nkurunziza-saddy/tiza",
  },
};

export default nextConfig;
