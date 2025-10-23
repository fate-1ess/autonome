import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
     {
      protocol: 'https',
      hostname: 'nof1.ai',
     },
    ],
   },
	typedRoutes: true,
};

export default nextConfig;

