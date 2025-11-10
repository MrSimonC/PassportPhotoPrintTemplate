import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (empty to use defaults)
  turbopack: {},

  // Ensure heic2any is treated as external package that should not be bundled for server
  serverExternalPackages: ['heic2any'],

  webpack: (config, { isServer }) => {
    // Exclude heic2any from server-side bundle since it uses browser-only APIs
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('heic2any');
    } else {
      // Client-side configuration
      // Ensure proper handling of wasm files used by heic2any
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        layers: true,
      };

      // Ensure heic2any can load its dependencies
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

export default nextConfig;
