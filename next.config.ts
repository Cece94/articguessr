import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.artic.edu',
        port: '',
        pathname: '/iiif/**',
      },
    ],
  },
};

export default nextConfig;
