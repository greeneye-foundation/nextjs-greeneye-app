# Well-Known Files for Universal Links / App Links

Hosted at https://greeneye.foundation/.well-known/

These files implement BE-07 (Phase 3 commerce-payments-deep-links) — Apple
Universal Links + Android App Links for the `rn-greeneye/` mobile app. They
let iOS / Android intercept `https://greeneye.foundation/payment/return*`
URLs and route them to the Greeneye app instead of Safari / Chrome.

## Files

- **`apple-app-site-association.json`** — AASA in Apple's components format
  (post-iOS 13). Lists 3 `appIDs` (one per APP_VARIANT: dev, preview, prod)
  with the path-prefix component matching `/payment/return*`.

- **`assetlinks.json`** — Android Digital Asset Links statements. Array of
  3 entries (one per APP_VARIANT package_name) granting
  `delegate_permission/common.handle_all_urls`.

## Routing notes

- Apple requires the file at `https://greeneye.foundation/.well-known/apple-app-site-association`
  with **NO `.json` extension** in the URL, but Content-Type
  `application/json`. `next.config.mjs` rewrites
  `/.well-known/apple-app-site-association` → this file's path
  (`/.well-known/apple-app-site-association.json`) and forces the JSON
  Content-Type via the `headers()` config.

- Android accepts `assetlinks.json` at the literal path
  `/.well-known/assetlinks.json` with Content-Type `application/json`.

## Before deploying to production

1. **Apple Team ID** — Replace `__APPLE_TEAM_ID__` (3 occurrences) in
   `apple-app-site-association.json` with the Apple Team ID from
   https://developer.apple.com/account/#/membership (10-character string).

2. **Android SHA-256 fingerprints** — From the rn-greeneye sub-repo run
   `eas credentials -p android --json` for each APP_VARIANT and copy the
   `keystore.sha256` value into the matching placeholder:
   - `__DEV_SHA256_FINGERPRINT__` ← dev keystore (foundation.greeneye.dev)
   - `__PREVIEW_SHA256_FINGERPRINT__` ← preview keystore (foundation.greeneye.preview)
   - `__PROD_SHA256_FINGERPRINT__` ← production keystore (foundation.greeneye)

   The production keystore may not exist until the first prod EAS build —
   in that case leave `__PROD_SHA256_FINGERPRINT__` as a placeholder and
   Phase 5 REL-* will substitute it before App Store / Play submission.

   Format note: Google Digital Asset Links accepts the colon-separated
   uppercase-hex form (`AB:CD:EF:...`) directly — that's what
   `eas credentials --json` emits.

## After deploying

Verify the AASA file is served correctly:

```bash
# 200 + content-type application/json (no .json extension visible)
curl -i https://greeneye.foundation/.well-known/apple-app-site-association

# Apple's CDN re-validation — Apple caches AASA aggressively
curl https://app-site-association.cdn-apple.com/a/v1/greeneye.foundation
```

Verify assetlinks.json:

```bash
curl -i https://greeneye.foundation/.well-known/assetlinks.json

# Google Digital Asset Links validator (browser):
# https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https%3A%2F%2Fgreeneye.foundation&relation=delegate_permission%2Fcommon.handle_all_urls
```

Both should return 3 statements (one per APP_VARIANT). If a fingerprint
placeholder was left in (e.g. prod), Google's validator will return that
specific entry as failed — the other two should still pass.

## Why this lives here, not in BE

The mobile app's universal-link domain is `greeneye.foundation` (the
public web hostname), not `api.greeneye.foundation`. AASA + assetlinks
must be served from the EXACT domain referenced in the app's
`associatedDomains` config — that's the Next.js web app, not the
Express BE.
