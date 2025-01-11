import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // reactCompiler: true,
    scrollRestoration: true,
    turbo: {
      rules: {
        "*.glsl": {
          as: "*.js",
          loaders: ["ts-shader-loader"],
        },
      },
    },
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      loader: "ts-shader-loader",
      test: /\.glsl/,
    });
    return config;
  },
};

export default nextConfig;
