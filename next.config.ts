import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },

      {
        protocol: 'https',
        hostname: '8px48g3ftc.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
