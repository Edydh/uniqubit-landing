

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: ['@sentry/nextjs'],
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Fix cross-origin warnings for development
  allowedDevOrigins: ['192.168.2.102'],
  
  // Handle missing favicon redirects
  async redirects() {
    return [
      {
        source: '/apple-touch-icon.png',
        destination: '/favicon.ico',
        permanent: false,
      },
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/favicon.ico',
        permanent: false,
      },
    ];
  },
  
  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG || "uniqubit",
  project: process.env.SENTRY_PROJECT || "uniqubit",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
  // Optionally add more options here as needed
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
