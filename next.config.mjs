// WR-04 (Phase 3 review fix): fail the production build if AASA / assetlinks
// still contain placeholder strings. iOS Safari + Android System WebView
// parse these JSON files for universal-link / app-link verification; any
// __APPLE_TEAM_ID__ or __PROD_SHA256_FINGERPRINT__ token surviving to a
// production build means deep-link verification will silently fail and the
// payment-return path falls back to the static HTML interstitial. The
// guard runs only on production builds — preview/dev builds may legitimately
// ship placeholders while developer-action-items are still in flight.
//
// Documented in app.config.js comments + 03-RESEARCH.md (LINK-02 / LINK-03).
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-await-in-loop
  const { readFileSync } = await import('node:fs');
  const placeholders = [
    '__APPLE_TEAM_ID__',
    '__PROD_SHA256_FINGERPRINT__',
    '__PREVIEW_SHA256_FINGERPRINT__',
    '__DEV_SHA256_FINGERPRINT__',
  ];
  const filesToCheck = [
    './public/.well-known/apple-app-site-association.json',
    './public/.well-known/assetlinks.json',
  ];
  for (const filePath of filesToCheck) {
    let contents;
    try {
      contents = readFileSync(filePath, 'utf8');
    } catch (err) {
      throw new Error(
        `WR-04 build guard: required deep-link manifest is missing at ${filePath}: ${err.message}`,
      );
    }
    for (const token of placeholders) {
      if (contents.includes(token)) {
        throw new Error(
          `WR-04 build guard: production build aborted — ${filePath} still contains placeholder ` +
          `"${token}". Replace with the real value (see app.config.js + 03-RESEARCH.md LINK-02/LINK-03).`,
        );
      }
    }
  }
}

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
