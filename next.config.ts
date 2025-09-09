import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com', pathname: '/profile_images/**' },
      { protocol: 'https', hostname: 'abs.twimg.com', pathname: '/sticky/default_profile_images/**' },
    ],
  },
};

export default nextConfig;
