import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add empty turbopack config to silence the Next.js 16 warning
  // Turbopack handles heic2any differently than webpack
  turbopack: {},

  webpack: (config, { isServer }) => {
    // Exclude heic2any from server-side bundle since it uses browser-only APIs
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('heic2any');
    }

    // Ensure proper handling of wasm files used by heic2any
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
