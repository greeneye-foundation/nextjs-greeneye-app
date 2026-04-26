const nextConfig = {
  reactStrictMode: true,

  // Enable compression for better performance
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  i18n: {
    locales: ['en', 'fr', 'es', 'ar', 'zh', 'ja', 'hi'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  images: {
    domains: [
      'scontent.fjai6-1.fna.fbcdn.net',
      'images.unsplash.com', // Added for collection images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Cache headers for static assets
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // BE-07 — Universal Links / App Links (Phase 3 commerce-payments-deep-links).
      // Apple's AASA file is served at /.well-known/apple-app-site-association
      // (NO .json extension visible to clients) but stored on disk as a .json
      // file. Apple requires Content-Type: application/json. Google's
      // assetlinks.json keeps the .json extension but also requires the same
      // Content-Type. Pair this with the rewrites() rule that forwards the
      // extensionless AASA URL to the on-disk .json file.
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },

  // BE-07 — rewrite the extensionless AASA URL to the on-disk JSON file. iOS
  // fetches https://greeneye.foundation/.well-known/apple-app-site-association
  // (no extension) but Next.js's static-file resolver wants the extension on
  // disk. The rewrite serves the JSON content from the extensionless URL.
  async rewrites() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/.well-known/apple-app-site-association.json',
      },
    ];
  },
};

export default nextConfig;
