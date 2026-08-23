import { readFileSync } from 'node:fs';

const file = (() => {
  try {
    return readFileSync(new URL('../.env', import.meta.url), 'utf8');
  } catch {
    return '';
  }
})();

for (const line of file.split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (!m || process.env[m[1]] !== undefined) continue;
  process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

export const env = {
  dbPath: process.env.CAPYQUAKE_DB_PATH || './data/capyquake.db',
  adminUsername: process.env.CAPYQUAKE_ADMIN_USERNAME || 'admin',
  adminPassword: process.env.CAPYQUAKE_ADMIN_PASSWORD,
  adminCode: process.env.CAPYQUAKE_ADMIN_CODE,
  sessionTtlMs: Number(process.env.CAPYQUAKE_SESSION_TTL_HOURS || 168) * 3600 * 1000
};
