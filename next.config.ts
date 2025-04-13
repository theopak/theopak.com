import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // reactCompiler: true,
    scrollRestoration: true,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  turbopack: {
    rules: {
      '*.glsl': {
        as: '*.js',
        loaders: ['ts-shader-loader'],
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      loader: 'ts-shader-loader',
      test: /\.glsl/,
    });
    return config;
  },
};

export default nextConfig;
