import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = mkdtempSync(join(tmpdir(), 'cq-api-'));
const ADMIN_PASS = 'AdminPassTeste!9';
const ADMIN_CODE = 'codigo-teste-42';

/** Ephemeral free port — fixed ports collide with other local services (501). */
function freePort() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.unref();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      s.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

function client(base) {
  let cookie = '';
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
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
  const PORT = await freePort();
  const BASE = `http://127.0.0.1:${PORT}`;
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

  const anon = client(BASE);
  const playerC = client(BASE);
  const adminC = client(BASE);

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
  assert.equal((await adminC('/api/admin/me')).data.user.role, 'king');

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
  assert.equal((await adminC(`/api/admin/users/1/role`, { method: 'POST', body: { role: 'king' } })).status, 403);

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
  const c2 = client(BASE);
  await c2('/api/auth/register', { method: 'POST', body: { username: 'diego', password: 'SenhaForte!1', confirmPassword: 'SenhaForte!1' } });
  assert.equal((await c2('/api/users/me')).status, 200);
  await c2('/api/auth/logout', { method: 'POST' });
  assert.equal((await c2('/api/users/me')).status, 401);

  // --- rate limit ---
  let last;
  const spam = client(BASE);
  for (let i = 0; i < 18; i++) {
    last = await spam('/api/auth/login', { method: 'POST', body: { username: 'carla', password: 'x' + i } });
  }
  assert.equal(last.status, 429);
  assert.equal(last.data.error.code, 'RATE_LIMITED');

  // --- portal público + admin messages/content ---
  assert.equal((await anon('/api/portal/news')).status, 200);
  assert.equal((await anon('/api/portal/wiki')).status, 200);
  assert.equal((await anon('/api/portal/achievements')).status, 200);
  assert.equal((await anon('/api/portal/motd')).status, 200);
  assert.equal((await playerC('/api/admin/messages')).status, 403);
  assert.equal((await playerC('/api/admin/portal/news')).status, 403);

  const msg = await adminC('/api/admin/messages', {
    method: 'POST', body: { kind: 'motd', body: 'MOTD via API test' }
  });
  assert.equal(msg.status, 201);
  assert.equal((await anon('/api/portal/motd')).data.motd?.body, 'MOTD via API test');

  const activeEmpty = await anon('/api/portal/messages/active');
  assert.equal(activeEmpty.status, 200);
  assert.ok(Array.isArray(activeEmpty.data.messages));
  assert.equal(typeof activeEmpty.data.serverTime, 'number');

  const { WebSocket } = await import('ws');
  const wsEvents = [];
  const ws = await new Promise((resolve, reject) => {
    const sock = new WebSocket(`ws://127.0.0.1:${PORT}/ws`);
    const t = setTimeout(() => reject(new Error('ws connect timeout')), 5000);
    sock.on('open', () => { clearTimeout(t); resolve(sock); });
    sock.on('error', reject);
    sock.on('message', (raw) => {
      try { wsEvents.push(JSON.parse(String(raw))); } catch { /* ignore */ }
    });
  });
  await new Promise((r) => setTimeout(r, 150));
  assert.ok(wsEvents.some((e) => e.type === 'global_messages_snapshot'));

  const bc = await adminC('/api/admin/messages', {
    method: 'POST',
    body: { kind: 'broadcast', body: 'LIVE 5s verify', durationSeconds: 5 }
  });
  assert.equal(bc.status, 201);
  assert.equal(bc.data.message.durationSeconds, 5);
  assert.ok(bc.data.message.expiresAt > Date.now());
  assert.equal(bc.data.message.status, 'active');

  await new Promise((r) => setTimeout(r, 200));
  assert.ok(wsEvents.some((e) => e.type === 'global_message_created' && e.data?.message === 'LIVE 5s verify'));

  const activeNow = await anon('/api/portal/messages/active');
  assert.equal(activeNow.status, 200);
  assert.ok(activeNow.data.messages.some((m) => m.id === bc.data.message.id && m.status === 'active'));

  await new Promise((r) => setTimeout(r, 5500));
  const activeLater = await anon('/api/portal/messages/active');
  assert.equal(activeLater.data.messages.some((m) => m.id === bc.data.message.id), false);

  const hist = await adminC('/api/admin/messages?limit=40');
  const expiredRow = hist.data.messages.find((m) => m.id === bc.data.message.id);
  assert.ok(expiredRow);
  assert.equal(expiredRow.status, 'expired');

  const off = await adminC(`/api/admin/messages/${bc.data.message.id}`, {
    method: 'POST', body: { action: 'deactivate' }
  });
  assert.equal(off.status, 200);

  const onAgain = await adminC(`/api/admin/messages/${bc.data.message.id}`, {
    method: 'POST', body: { action: 'reactivate', durationSeconds: 30 }
  });
  assert.equal(onAgain.status, 200);
  assert.equal(onAgain.data.message.status, 'active');
  assert.equal(onAgain.data.message.durationSeconds, 30);
  await new Promise((r) => setTimeout(r, 150));
  assert.ok(wsEvents.some((e) => e.type === 'global_message_created' && e.data?.id === bc.data.message.id));

  ws.close();

  const newsPost = await adminC('/api/admin/portal/news', {
    method: 'POST',
    body: { title: 'API News', summary: 's', body: 'b', published: true }
  });
  assert.equal(newsPost.status, 201);
  const pubNews = await anon('/api/portal/news');
  assert.ok(pubNews.data.news.some(n => n.title === 'API News'));
  const bySlug = await anon('/api/portal/news/' + encodeURIComponent(newsPost.data.news.slug));
  assert.equal(bySlug.status, 200);
  assert.equal(bySlug.data.news.title, 'API News');

  assert.equal((await adminC('/api/admin/portal/wiki', {
    method: 'POST',
    body: { gameId: 'capyquake', title: 'Wiki API', bodyMd: '# x', published: true }
  })).status, 201);
  assert.equal((await adminC('/api/admin/portal/achievements', {
    method: 'POST',
    body: { gameId: 'capyquake', name: 'Ach API', published: true }
  })).status, 201);
  assert.ok((await anon('/api/portal/wiki?gameId=capyquake')).data.articles.length >= 1);
  assert.ok((await anon('/api/portal/achievements?gameId=capyquake')).data.achievements.length >= 1);

  const dash = await adminC('/api/admin/dashboard');
  assert.equal(dash.status, 200);
  assert.equal(typeof dash.data.stats.publishedNews, 'number');
  assert.ok(dash.data.stats.publishedNews >= 1);

  // --- social / public profile / lobbies ---
  // Fresh client: `anon` still holds carla's register cookie and is not a guest.
  const guest = client(BASE);
  assert.equal((await guest('/api/friends')).status, 401);
  assert.equal((await guest('/api/friends/request', { method: 'POST', body: { username: 'carla' } })).status, 401);
  assert.equal((await guest('/api/lobbies')).status, 200);
  assert.ok(Array.isArray((await guest('/api/lobbies')).data.lobbies));
  assert.equal((await guest('/api/lobbies')).data.lobbies.length, 0);

  const pub = await guest('/api/users/carla');
  assert.equal(pub.status, 200);
  assert.equal(pub.data.profile.username, 'carla');
  assert.equal(pub.data.profile.stats, null);
  assert.ok(!JSON.stringify(pub.data).includes('password'));
  assert.ok(!('coins' in (pub.data.profile || {})));
  assert.ok(!JSON.stringify(pub.data.profile).includes('"coins"'));

  const priv = await playerC('/api/users/me/privacy', { method: 'PATCH', body: { statsPublic: true } });
  assert.equal(priv.status, 200);
  assert.equal(priv.data.statsPublic, true);
  const pub2 = await guest('/api/users/carla');
  assert.ok(pub2.data.profile.stats);
  assert.ok(!JSON.stringify(pub2.data.profile).includes('"coins"'));

  const c3 = client(BASE);
  await c3('/api/auth/register', {
    method: 'POST',
    body: { username: 'elena', password: 'SenhaForte!1', confirmPassword: 'SenhaForte!1' }
  });
  assert.equal((await playerC('/api/friends/request', { method: 'POST', body: { username: 'elena' } })).status, 200);
  assert.equal((await c3('/api/friends/accept', { method: 'POST', body: { username: 'carla' } })).status, 200);
  const fl = await playerC('/api/friends');
  assert.ok(fl.data.friends.some(f => f.username === 'elena'));
  assert.equal((await playerC('/api/follow/elena', { method: 'POST' })).status, 200);
  assert.ok((await anon('/api/users/elena/followers')).data.users.some(u => u.username === 'carla'));

  const search = await playerC('/api/users/search?q=ele');
  assert.equal(search.status, 200);
  assert.ok(search.data.users.every(u => !('coins' in u) && !('password_hash' in u)));
});
