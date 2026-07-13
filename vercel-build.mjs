// Vercel build step for pop-pyramid.
// Reproduces the two build-time steps that GitHub Actions (deploy.yml) used to do:
//   1) write runtime-env.json from environment variables (config injection)
//   2) fetch data/trend_kosis.json from KOSIS OpenAPI using a server-side key
// All values come from Vercel Project → Settings → Environment Variables.
// Nothing secret is written into the site: only the public config keys and the
// resulting trend JSON are emitted. The real KOSIS_API_KEY stays server-side.

import { writeFileSync, mkdirSync } from 'node:fs';

const CONFIG_KEYS = [
  'KOSIS_TREND_PROXY',
  'KOSIS_TREND_USER_STATS_ID',
  'KOSIS_PUBLIC_API_KEY',
  'CAPTCHA_PROVIDER',
  'CAPTCHA_SITE_KEY',
  'CAPTCHA_VERIFY_ENDPOINT',
  'TURNSTILE_SITE_KEY',
  'RECAPTCHA_SITE_KEY',
];

// 1) runtime-env.json — only non-empty values, mirrors the old GH Action
const cfg = {};
for (const key of CONFIG_KEYS) {
  const val = (process.env[key] || '').trim();
  if (val) cfg[key] = val;
}
writeFileSync('runtime-env.json', JSON.stringify(cfg), 'utf-8');
console.log('runtime-env.json written with keys:', Object.keys(cfg).join(', ') || '(none)');

// 2) data/trend_kosis.json — optional build-time KOSIS cache
const apiKey = (process.env.KOSIS_API_KEY || '').trim();
const userStatsId = (process.env.KOSIS_TREND_USER_STATS_ID || '').trim();
if (!apiKey || !userStatsId) {
  console.log('KOSIS trend cache skipped: missing KOSIS_API_KEY or KOSIS_TREND_USER_STATS_ID');
  process.exit(0);
}

const params = new URLSearchParams({
  method: 'getList',
  apiKey,
  format: 'json',
  jsonVD: 'Y',
  userStatsId,
  prdSe: 'Y',
  startPrdDe: '1925',
  endPrdDe: '2070',
});
const url = 'https://kosis.kr/openapi/statisticsData.do?' + params.toString();

try {
  const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const payload = await resp.json();
  mkdirSync('data', { recursive: true });
  writeFileSync('data/trend_kosis.json', JSON.stringify(payload), 'utf-8');
  console.log('KOSIS trend cache written');
} catch (e) {
  // Non-fatal: the site falls back to bundled data if the cache is absent.
  console.log('KOSIS trend cache fetch failed (non-fatal):', e && e.message);
}
