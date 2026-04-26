// Static probe — Phase 3 Plan 03-02 (BE-07 universal links + app links).
//
// This test does NOT spin up a Next.js server. It reads the on-disk static
// files (AASA + assetlinks.json + payment/return.html) and the next.config.mjs
// source, then asserts structural correctness. The HUMAN-UAT step in the plan
// covers the deployed-server verification (curl the live URL, run Apple's CDN
// validator, etc).
//
// Uses node:test (Node's native test runner) to avoid pulling jest into the
// nextjs-greeneye-app sub-repo just for these probes — the existing repo has
// zero test infrastructure. The repo's "test" script (added by Plan 03-02)
// runs `node --test __tests__/`.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const aasaPath = path.join(repoRoot, 'public', '.well-known', 'apple-app-site-association.json');
const assetlinksPath = path.join(repoRoot, 'public', '.well-known', 'assetlinks.json');
const nextConfigPath = path.join(repoRoot, 'next.config.mjs');
const fallbackHtmlPath = path.join(repoRoot, 'public', 'payment', 'return.html');

// --- AASA -------------------------------------------------------------------

test('AASA — file parses as valid JSON', () => {
  const raw = fs.readFileSync(aasaPath, 'utf8');
  const aasa = JSON.parse(raw);
  assert.ok(aasa.applinks, 'expected root .applinks key');
});

test("AASA — applinks.apps is an empty array (Apple's required form)", () => {
  const aasa = JSON.parse(fs.readFileSync(aasaPath, 'utf8'));
  assert.deepEqual(aasa.applinks.apps, []);
});

test('AASA — details[0].appIDs covers all 3 APP_VARIANT bundle IDs', () => {
  const aasa = JSON.parse(fs.readFileSync(aasaPath, 'utf8'));
  const appIDs = aasa.applinks.details[0].appIDs;
  assert.equal(appIDs.length, 3, 'expected 3 appIDs (dev/preview/prod)');
  // Each entry: <TEAMID>.foundation.greeneye[.preview|.dev]
  // TEAMID is a placeholder string until developer substitutes, so we accept
  // any non-empty TEAMID-like prefix followed by the bundle id.
  const re = /^[A-Z0-9_]+\.foundation\.greeneye(\.preview|\.dev)?$/;
  appIDs.forEach((id) => {
    assert.match(id, re, `appID ${id} did not match expected shape`);
  });
  // Ensure we cover all 3 variants by suffix.
  const suffixes = appIDs.map((id) => {
    const m = id.match(/foundation\.greeneye(\.preview|\.dev)?$/);
    return m ? (m[1] || '') : null;
  });
  assert.ok(suffixes.includes(''), 'expected production (no suffix)');
  assert.ok(suffixes.includes('.preview'), 'expected preview variant');
  assert.ok(suffixes.includes('.dev'), 'expected dev variant');
});

test('AASA — components[0]["/"] === "/payment/return*"', () => {
  const aasa = JSON.parse(fs.readFileSync(aasaPath, 'utf8'));
  const components = aasa.applinks.details[0].components;
  assert.ok(Array.isArray(components) && components.length > 0, 'expected non-empty components');
  assert.equal(components[0]['/'], '/payment/return*');
});

// --- assetlinks.json --------------------------------------------------------

test('assetlinks — top-level is an array of length 3', () => {
  const links = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));
  assert.equal(Array.isArray(links), true, 'expected top-level array');
  assert.equal(links.length, 3, 'expected one entry per APP_VARIANT');
});

test('assetlinks — every entry has the standard relation + android_app namespace', () => {
  const links = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));
  links.forEach((l, i) => {
    assert.deepEqual(
      l.relation,
      ['delegate_permission/common.handle_all_urls'],
      `entry ${i} relation mismatch`,
    );
    assert.equal(l.target.namespace, 'android_app', `entry ${i} namespace mismatch`);
  });
});

test('assetlinks — package_names cover all 3 APP_VARIANTs', () => {
  const links = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));
  const pkgs = new Set(links.map((l) => l.target.package_name));
  assert.ok(pkgs.has('foundation.greeneye'), 'missing prod package');
  assert.ok(pkgs.has('foundation.greeneye.preview'), 'missing preview package');
  assert.ok(pkgs.has('foundation.greeneye.dev'), 'missing dev package');
});

test('assetlinks — every entry has a non-empty sha256_cert_fingerprints array', () => {
  const links = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));
  links.forEach((l, i) => {
    assert.ok(
      Array.isArray(l.target.sha256_cert_fingerprints),
      `entry ${i} fingerprints not array`,
    );
    assert.ok(
      l.target.sha256_cert_fingerprints.length > 0,
      `entry ${i} fingerprints empty`,
    );
    // Placeholder strings are acceptable at this stage; HUMAN-UAT replaces.
    l.target.sha256_cert_fingerprints.forEach((fp) => {
      assert.equal(typeof fp, 'string');
      assert.ok(fp.length > 0, 'fingerprint string is empty');
    });
  });
});

// --- next.config.mjs --------------------------------------------------------

test('next.config.mjs — rewrites the extensionless AASA URL', () => {
  const cfg = fs.readFileSync(nextConfigPath, 'utf8');
  assert.ok(
    cfg.includes('/.well-known/apple-app-site-association'),
    'config missing AASA source path',
  );
  assert.ok(
    cfg.includes('/.well-known/apple-app-site-association.json'),
    'config missing AASA destination path',
  );
});

test('next.config.mjs — sets Content-Type: application/json on /.well-known/*', () => {
  const cfg = fs.readFileSync(nextConfigPath, 'utf8');
  assert.ok(cfg.includes("'/.well-known/:path*'"), 'config missing /.well-known/:path* source');
  assert.ok(cfg.includes("'application/json'"), 'config missing application/json content-type');
});

// --- Static fallback --------------------------------------------------------

test('payment/return.html — fallback page exists with branding + store links', () => {
  const html = fs.readFileSync(fallbackHtmlPath, 'utf8');
  assert.ok(html.includes('Greeneye'), 'missing Greeneye branding');
  assert.ok(html.includes('apps.apple.com'), 'missing App Store link');
  assert.ok(html.includes('play.google.com'), 'missing Play Store link');
});

test('payment/return.html — reads orderId + status from URL query params', () => {
  const html = fs.readFileSync(fallbackHtmlPath, 'utf8');
  assert.ok(
    html.includes('URLSearchParams'),
    'fallback page must parse the query string at runtime',
  );
  assert.ok(html.includes("get('orderId')"), 'fallback page must read orderId param');
  assert.ok(html.includes("get('status')"), 'fallback page must read status param');
});
