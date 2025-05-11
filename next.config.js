/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add development proxy for API requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tmdb-embed-oe1swuome-nuileds-projects.vercel.app/:path*',
      },
    ];
  },
  // Disable webpack cache and configure output for WebContainer environment
  webpack: (config, { dev, isServer }) => {
    // Disable cache in development
    if (dev) {
      config.cache = false;
    }
    
    // Ensure cache directory is within project
    if (!isServer) {
      config.output = {
        ...config.output,
        globalObject: 'self',
      };
    }
    
    return config;
  },
  // Ensure temporary directories are within project
  experimental: {
    outputFileTracingRoot: '.',
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
};

module.exports = nextConfig;