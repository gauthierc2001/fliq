import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Optimize for Railway deployment
    outputFileTracingRoot: '.',
  },
  images: {
    // Allow Twitter avatars and external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/profile_images/**',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        pathname: '/sticky/default_profile_images/**',
      }
    ],
  },
};

export default nextConfig;
