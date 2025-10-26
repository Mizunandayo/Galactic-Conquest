import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Disable server-side rendering for specific issues
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Prevent localStorage polyfilling on the server
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'node-localstorage': false,
        'localStorage': false,
      };
      
      // Ignore localStorage access on server
      config.plugins = config.plugins || [];
    }
    
    return config;
  },
  // Explicitly exclude certain modules from server bundles
  serverExternalPackages: ['winston'],
  // Experimental features to help with SSR issues
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
