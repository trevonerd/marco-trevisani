import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  turbopack: {
    root
  },
  transpilePackages: ["@marco-trevisani/alien-ui"],
  typedRoutes: true
};

export default nextConfig;
