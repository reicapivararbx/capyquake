import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = mkdtempSync(join(tmpdir(), 'cq-api-'));

const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}`;
const ADMIN_PASS = 'AdminPassTeste!9';
const ADMIN_CODE = 'codigo-teste-42';

function client() {
  let cookie = '';
  const call = async (path, opts = {}) => {
    const res = await fetch(BASE + path, {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...(opts.headers || {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      redirect: 'manual'
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };
  return call;
}

test('seguranca e integracao HTTP do CapiQuake', async (t) => {
  const child = spawn('node', [join(root, 'server/index.js')], {
    env: {
      ...process.env,
      PORT: String(PORT),
      CAPYQUAKE_DB_PATH: join(dataDir, 'api.db'),
      CAPYQUAKE_ADMIN_USERNAME: 'admin',
      CAPYQUAKE_ADMIN_PASSWORD: ADMIN_PASS,
      CAPYQUAKE_ADMIN_CODE: ADMIN_CODE
    },
    stdio: 'ignore'
  });
  t.after(() => child.kill());

  for (let i = 0; i < 50 && !await fetch(BASE + '/').then(() => true).catch(() => false); i++) {
    await new Promise(r => setTimeout(r, 200));
  }

  const anon = client();
  const playerC = client();
  const adminC = client();

  // --- registro e login ---
  const reg = await anon('/api/auth/register', {
    method: 'POST',
    body: { username: 'carla', password: 'SenhaForte!1', confirmPassword: 'SenhaForte!1' }
  });
  assert.equal(reg.status, 201);
  assert.equal((await playerC('/api/auth/login', { method: 'POST', body: { username: 'carla', password: 'SenhaForte!1' } })).status, 200);
  const me = await playerC('/api/users/me');
  assert.equal(me.data.user.username, 'carla');
  assert.ok(!JSON.stringify(me.data).includes('password'));
  assert.equal(me.data.capybara.health, 100);

  // --- validacoes de registro ---
  assert.equal(
    (await anon('/api/auth/register', { method: 'POST', body: { username: 'outro', password: 'curta', confirmPassword: 'curta' } })).status,
    400
  );
  assert.equal(
    (await anon('/api/auth/register', { method: 'POST', body: { username: 'carla', password: 'SenhaForte!1', confirmPassword: 'SenhaForte!1' } })).data.error.code,
    'USERNAME_TAKEN'
  );
  assert.equal(
    (await anon('/api/auth/register', { method: 'POST', body: { username: 'quarta', password: 'SenhaForte!1', confirmPassword: 'diferente' } })).data.error.code,
    'INVALID_PASSWORD'
  );

  // --- player NAO acessa admin ---
  assert.equal((await playerC('/api/admin/dashboard')).status, 403);
  assert.equal((await playerC('/api/admin/users/1/give-coins', { method: 'POST', body: { amount: 100 } })).status, 403);

  // --- admin por codigo ---
  assert.equal((await adminC('/api/admin/code', { method: 'POST', body: { code: 'errado' } })).status, 403);
  assert.equal((await adminC('/api/admin/code', { method: 'POST', body: { code: ADMIN_CODE } })).status, 200);
  assert.equal((await adminC('/api/admin/me')).data.user.role, 'owner');

  // --- senha de admin errada falha generica ---
  assert.equal((await anon('/api/auth/login', { method: 'POST', body: { username: 'admin', password: 'x' } })).status, 401);

  // --- game tools reais ---
  const users = await adminC('/api/admin/users?q=carla');
  const id = users.data.users.find(u => u.username === 'carla').id;

  const badNeg = await adminC(`/api/admin/users/${id}/give-coins`, { method: 'POST', body: { amount: -(10 ** 16) } });
  assert.equal(badNeg.status, 400);
  assert.equal(badNeg.data.error.code, 'INVALID_AMOUNT');
  const badStr = await adminC(`/api/admin/users/${id}/give-coins`, { method: 'POST', body: { amount: 'muito' } });
  assert.equal(badStr.status, 400);

  const first = await adminC(`/api/admin/users/${id}/give-coins`, {
    method: 'POST', headers: { 'Idempotency-Key': 'op-3' }, body: { amount: 250 }
  });
  const replay = await adminC(`/api/admin/users/${id}/give-coins`, {
    method: 'POST', headers: { 'Idempotency-Key': 'op-3' }, body: { amount: 250 }
  });
  assert.deepEqual(first.data.balance, replay.data.balance);
  assert.equal(first.data.balance.after, 250);

  const xp = await adminC(`/api/admin/users/${id}/give-xp`, { method: 'POST', body: { amount: 5000 } });
  assert.equal(xp.data.progress.leveledUp, true);
  assert.ok(xp.data.progress.level > 1);

  assert.equal((await adminC(`/api/admin/users/${id}/give-item`, { method: 'POST', body: { itemId: 'minigun', quantity: 2 } })).status, 200);
  assert.equal((await adminC(`/api/admin/users/${id}/give-item`, { method: 'POST', body: { itemId: 'fantasma-inexistente', quantity: 1 } })).status, 400);

  const detail = await adminC(`/api/admin/users/${id}`);
  assert.equal(detail.data.inventory[0].itemId, 'minigun');

  // --- moderacao ---
  assert.equal((await adminC(`/api/admin/users/${id}/ban`, { method: 'POST', body: { reason: 'teste' } })).status, 200);
  assert.equal((await anon('/api/auth/login', { method: 'POST', body: { username: 'carla', password: 'SenhaForte!1' } })).data.error.code, 'ACCOUNT_BANNED');
  assert.equal((await adminC(`/api/admin/users/${id}/unban`, { method: 'POST', body: {} })).status, 200);

  // --- role protections ---
  assert.equal((await adminC(`/api/admin/users/1/role`, { method: 'POST', body: { role: 'owner' } })).status, 403);

  // --- reset com confirmacao ---
  assert.equal(
    (await adminC(`/api/admin/users/${id}/reset`, { method: 'POST', body: { scopes: ['coins'], confirmUsername: 'errado' } })).status,
    400
  );
  const resetOk = await adminC(`/api/admin/users/${id}/reset`, {
    method: 'POST', body: { scopes: ['coins'], confirmUsername: 'carla', reason: 'teste' }
  });
  assert.equal(resetOk.status, 200);

  // --- logs registrados ---
  const logs = await adminC('/api/admin/logs?limit=20');
  const actions = logs.data.logs.map(l => l.action);
  assert.ok(actions.includes('GIVE_COINS'));
  assert.ok(actions.includes('BAN'));
  assert.ok(actions.includes('RESET_PLAYER'));

  // --- sessao invalida ---
  assert.equal((await fetch(BASE + '/api/users/me', { headers: { Cookie: 'cq_session=invalido' } })).status, 401);

  // --- logout revoga ---
  const c2 = client();
  await c2('/api/auth/register', { method: 'POST', body: { username: 'diego', password: 'SenhaForte!1', confirmPassword: 'SenhaForte!1' } });
  assert.equal((await c2('/api/users/me')).status, 200);
  await c2('/api/auth/logout', { method: 'POST' });
  assert.equal((await c2('/api/users/me')).status, 401);

  // --- rate limit ---
  let last;
  const spam = client();
  for (let i = 0; i < 18; i++) {
    last = await spam('/api/auth/login', { method: 'POST', body: { username: 'carla', password: 'x' + i } });
  }
  assert.equal(last.status, 429);
  assert.equal(last.data.error.code, 'RATE_LIMITED');
});
