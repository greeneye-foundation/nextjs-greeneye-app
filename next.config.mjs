import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Phase 5 Plan 05-03 Task 2 — build-time __APPLE_TEAM_ID__ substitution.
// Closes the Phase 4 04-REVIEW.iter1.md IR-07 deferral (RESEARCH §"Option 1:
// Build-time env-var substitution" lines 991-1009).
//
// Mechanic: at next.config.mjs module-load (which `next build` triggers
// once per build), read process.env.APPLE_TEAM_ID. If the env var is set,
// read public/.well-known/apple-app-site-association.json from disk and
// replaceAll('__APPLE_TEAM_ID__', APPLE_TEAM_ID), writing back. The call
// is idempotent — re-running on an already-substituted file is a no-op
// because replaceAll on a literal that's no longer present matches nothing.
//
// Production guard: when NODE_ENV === 'production' AND APPLE_TEAM_ID is
// unset, the helper throws — CI fails fast and the deploy is blocked
// until the env var is configured (RESEARCH §"Recommended approach"
// line 1037; Test 3 in __tests__/aasa-substitution.test.js verifies).
//
// Dev/preview safety: when neither env var is set, the helper returns
// {substituted: false, reason: 'no-env-var'} — Vercel preview deploys
// without APPLE_TEAM_ID continue to build successfully and the source-
// committed placeholder file stays untouched.
//
// Sequencing within this config: this helper runs BEFORE the WR-04
// placeholder guard below. WR-04 catches OTHER placeholders (Android
// SHA256 fingerprints) that have separate ops paths; APPLE_TEAM_ID is
// substituted in this step so WR-04 sees a clean AASA when it runs in
// production.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function substituteAppleTeamIdIfProduction({
  nodeEnv = process.env.NODE_ENV,
  appleTeamId = process.env.APPLE_TEAM_ID,
  aasaFilePath,
} = {}) {
  const aasaPath = aasaFilePath ?? path.join(
    __dirname,
    'public',
    '.well-known',
    'apple-app-site-association.json',
  );

  if (nodeEnv === 'production' && !appleTeamId) {
    throw new Error(
      'APPLE_TEAM_ID env var must be set for production builds (Phase 5 REL-* IR-07). ' +
      'Source: Apple Developer Portal → Membership (10-character string). ' +
      'Configure in Vercel project env vars (or equivalent deploy environment).',
    );
  }

  if (!appleTeamId) {
    return { substituted: false, reason: 'no-env-var' };
  }

  const original = fs.readFileSync(aasaPath, 'utf8');
  const occurrences = (original.match(/__APPLE_TEAM_ID__/g) || []).length;
  const substituted = original.replaceAll('__APPLE_TEAM_ID__', appleTeamId);
  if (substituted !== original) {
    fs.writeFileSync(aasaPath, substituted);
  }
  return { substituted: substituted !== original, occurrences };
}

// Run the substitution at module-load. `next build` loads this config
// exactly once per build. In test/dev contexts where APPLE_TEAM_ID is
// unset and NODE_ENV !== 'production', this is a documented no-op.
substituteAppleTeamIdIfProduction();

// WR-04 (Phase 3 review fix): fail the production build if AASA / assetlinks
// still contain placeholder strings. iOS Safari + Android System WebView
// parse these JSON files for universal-link / app-link verification; any
// __APPLE_TEAM_ID__ or __PROD_SHA256_FINGERPRINT__ token surviving to a
// production build means deep-link verification will silently fail and the
// payment-return path falls back to the static HTML interstitial. The
// guard runs only on production builds — preview/dev builds may legitimately
// ship placeholders while developer-action-items are still in flight.
//
// Phase 5: by the time this guard runs in production, the
// substituteAppleTeamIdIfProduction() call above has already replaced
// __APPLE_TEAM_ID__ with the real Team ID (or thrown if APPLE_TEAM_ID was
// unset). Other placeholders (Android SHA256 fingerprints) remain as a
// separate ops concern handled per Plan 05-06 closure HUMAN-UAT.
//
// Documented in app.config.js comments + 03-RESEARCH.md (LINK-02 / LINK-03).
if (process.env.NODE_ENV === 'production') {
  // Phase 5 REVIEW iter2 IR-02: dropped redundant `await import('node:fs')`.
  // `fs` is already statically imported at the top of this file; the dynamic
  // import was dead weight (and the eslint-disable for `no-await-in-loop`
  // was a misnomer — there is no loop here).
  const { readFileSync } = fs;
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
