// Phase 5 Plan 05-03 Task 2 — build-time __APPLE_TEAM_ID__ substitution probe.
//
// Closes the Phase 4 04-REVIEW.iter1.md IR-07 deferral. The substitution
// helper lives in `next.config.mjs` and runs at `next build` module-load
// time. This test file verifies the helper's contract via 4 node:test
// probes:
//
//   1. Source AASA on disk currently has __APPLE_TEAM_ID__ placeholder
//      (3 occurrences — one per APP_VARIANT appID) — sanity guard so a
//      future commit doesn't silently substitute the source.
//   2. Production build with APPLE_TEAM_ID env replaces all 3 occurrences
//      and writes the substituted value 3 times.
//   3. Production build WITHOUT APPLE_TEAM_ID throws — the CI lint check
//      semantically (per RESEARCH §"Recommended approach" line 1037).
//   4. Dev/preview build (NODE_ENV !== 'production') WITHOUT APPLE_TEAM_ID
//      is a no-op — Vercel preview deploys without the env var don't break.
//
// Same node:test idiom as `aasa.test.js`. Dynamic-imports next.config.mjs
// because node:test runs in a CJS context but the config is ESM .mjs.

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const SOURCE_AASA_PATH = path.join(
  __dirname,
  '..',
  'public',
  '.well-known',
  'apple-app-site-association.json',
);

async function loadSubstitute() {
  const cfg = await import('../next.config.mjs');
  return cfg.substituteAppleTeamIdIfProduction;
}

function copyAasaToTmp() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase5-aasa-'));
  const tmpAasa = path.join(tmpDir, 'apple-app-site-association.json');
  fs.copyFileSync(SOURCE_AASA_PATH, tmpAasa);
  return tmpAasa;
}

test('Substitution Test 1: source AASA on disk currently has __APPLE_TEAM_ID__ placeholder (3 occurrences)', () => {
  const content = fs.readFileSync(SOURCE_AASA_PATH, 'utf8');
  const occurrences = (content.match(/__APPLE_TEAM_ID__/g) || []).length;
  assert.equal(
    occurrences,
    3,
    'expected 3 placeholder occurrences (one per APP_VARIANT appID); the source file MUST stay placeholder-committed — substitution is build-time only',
  );
});

test('Substitution Test 2: production build with APPLE_TEAM_ID env replaces all 3 occurrences', async () => {
  const substitute = await loadSubstitute();
  assert.equal(
    typeof substitute,
    'function',
    'substituteAppleTeamIdIfProduction must be exported from next.config.mjs',
  );
  const tmpAasa = copyAasaToTmp();
  const result = substitute({
    nodeEnv: 'production',
    appleTeamId: 'ABCD123456',
    aasaFilePath: tmpAasa,
  });
  assert.equal(result.substituted, true, 'expected substitution to occur');
  const content = fs.readFileSync(tmpAasa, 'utf8');
  assert.equal(
    (content.match(/__APPLE_TEAM_ID__/g) || []).length,
    0,
    'no placeholder should remain after production substitution',
  );
  assert.equal(
    (content.match(/ABCD123456/g) || []).length,
    3,
    '3 occurrences of substituted Team ID expected (one per APP_VARIANT appID)',
  );
});

test('Substitution Test 3: production build WITHOUT APPLE_TEAM_ID env throws', async () => {
  const substitute = await loadSubstitute();
  assert.throws(
    () => substitute({ nodeEnv: 'production', appleTeamId: undefined }),
    /APPLE_TEAM_ID env var must be set for production builds/,
    'expected production guard to throw when APPLE_TEAM_ID is unset',
  );
});

test('Substitution Test 4: dev build (NODE_ENV !== production) WITHOUT APPLE_TEAM_ID is no-op (placeholder preserved)', async () => {
  const substitute = await loadSubstitute();
  const tmpAasa = copyAasaToTmp();
  const result = substitute({
    nodeEnv: 'development',
    appleTeamId: undefined,
    aasaFilePath: tmpAasa,
  });
  assert.equal(result.substituted, false, 'expected no substitution');
  assert.equal(result.reason, 'no-env-var', 'expected reason=no-env-var');
  const content = fs.readFileSync(tmpAasa, 'utf8');
  assert.equal(
    (content.match(/__APPLE_TEAM_ID__/g) || []).length,
    3,
    'placeholder must remain in dev environment (Vercel preview safety)',
  );
});
