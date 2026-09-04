import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.CAPYQUAKE_DB_PATH = join(mkdtempSync(join(tmpdir(), 'cq-test-')), 'test.db');

const { createUser, authenticate, getUserById, giveCoins, setCoins, giveTokens,
  giveXp, setXp, setLevel, levelUp, addItemToInventory, removeItemFromInventory,
  getInventory, getFullAccount, reportMatch, resetPlayer,
  createGlobalMessage, getGlobalMessageById, getActiveMotd, deactivateGlobalMessage, listGlobalMessages,
  listActiveGlobalMessages, reactivateGlobalMessage, resolveMessageDuration,
  createPortalNews, listPortalNews, getPortalNewsBySlug, updatePortalNews,
  createPortalWiki, listPortalWiki, createPortalAchievement, listPortalAchievements,
  dashboardStats, toPublicProfile, setStatsPublic, requestFriend, acceptFriend,
  declineFriend, removeFriend, blockUser, unblockUser, listFriends,
  followUser, unfollowUser, listFollowers, listFollowing } = await import('../server/services.js');
const { listPublicLobbies, bindRooms, getLobby } = await import('../server/lobbies.js');
const { touchOnline, setRoom, clearPresence, presencePayload, _resetPresenceForTests } =
  await import('../server/presence.js');
const { applyXp, xpNeededForLevel } = await import('../server/xplevel.js');
const { ApiError, ROLE_RANK, hasPermission, PERMISSIONS } = await import('../server/validation.js');
const { hashPassword, verifyPassword } = await import('../server/passwords.js');

let owner;
beforeEach(() => {
  if (!owner) {
    owner = createUser({ username: 'owner_t', password: 'SenhaForte!1' });
    const { db } = null ?? {};
    void db;
  }
});

const actorOf = () => ({ ...getUserById(owner.id) });

function player(name) {
  return createUser({ username: name, password: 'SenhaForte!1' });
}

test('hash de senha nunca guarda texto puro e verifica corretamente', () => {
  const h = hashPassword('MinhaSenh@123');
  assert.ok(!h.includes('MinhaSenh@123'));
  assert.equal(h.startsWith('scrypt:'), true);
  assert.equal(verifyPassword('MinhaSenh@123', h), true);
  assert.equal(verifyPassword('errada', h), false);
});

test('registro cria user+profile+capybara e valida username', async () => {
  const u = player('joao_valido');
  const acc = getFullAccount(u.id);
  assert.equal(acc.profile.level, 1);
  assert.equal(acc.profile.coins, 0);
  assert.equal(acc.capybara.name, 'Capy');
  assert.equal(acc.capybara.health, 100);
  assert.throws(() => player('x'), { code: 'INVALID_USERNAME' });
  assert.throws(() => createUser({ username: 'nome com espaço', password: 'SenhaForte!1' }), { code: 'INVALID_USERNAME' });
  assert.throws(() => player('joao_valido'), { code: 'USERNAME_TAKEN' });
  assert.throws(() => createUser({ username: 'curto_ok', password: 'curta' }), { code: 'INVALID_PASSWORD' });
});

test('authenticate valida senha e retorna sem hash', async () => {
  player('maria_auth');
  const u = authenticate('maria_auth', 'SenhaForte!1');
  assert.equal(u.username, 'maria_auth');
  assert.equal(u.password_hash, undefined);
  assert.equal(u.passwordHash, undefined);
  assert.throws(() => authenticate('maria_auth', 'errada'), { code: 'UNAUTHORIZED' });
});

test('give/set coins com transacoes e clamp', async () => {
  const alvo = player('eco1');
  const actor = actorOf();
  giveCoins(actor, alvo.id, 500, 'bonus');
  const r = giveCoins(actor, alvo.id, -200, 'penalidade');
  assert.deepEqual(r, { before: 500, after: 300 });
  const zeroed = giveCoins(actor, alvo.id, -999999, 'estouro');
  assert.equal(zeroed.after, 0);
  assert.throws(() => giveCoins(actor, alvo.id, Number.NaN, 'x'), { code: 'INVALID_AMOUNT' });
  setCoins(actor, alvo.id, 42, 'ajuste');
  assert.equal(getFullAccount(alvo.id).profile.coins, 42);
  giveTokens(actor, alvo.id, 7, 'tk');
  assert.equal(getFullAccount(alvo.id).profile.tokens, 7);
});

test('xp segue formula oficial level*100 com cap 100', () => {
  assert.equal(xpNeededForLevel(1), 100);
  let r = applyXp(1, 0, 250);
  assert.deepEqual({ level: r.level, xp: r.xp }, { level: 2, xp: 150 });
  r = applyXp(99, 9900, 10 ** 9);
  assert.equal(r.level, 100);
  assert.ok(r.xp <= xpNeededForLevel(99));
});

test('giveXp aplica level up real', async () => {
  const alvo = player('xper');
  const actor = actorOf();
  const r = giveXp(actor, alvo.id, 350, 'teste');
  assert.equal(r.leveledUp, true);
  assert.equal(r.level, 3);
  assert.equal(r.xp, 50);
  assert.throws(() => giveXp(actor, alvo.id, Number.NaN), { code: 'INVALID_XP' });
});

test('setXp/setLevel/levelUp validam e persistem', async () => {
  const alvo = player('lvler');
  const actor = actorOf();
  setXp(actor, alvo.id, 150, 'r');
  let p = getFullAccount(alvo.id).profile;
  assert.equal(p.level, 2); assert.equal(p.xp, 50);
  setLevel(actor, alvo.id, 55, 'r');
  p = getFullAccount(alvo.id).profile;
  assert.equal(p.level, 55);
  assert.throws(() => setLevel(actor, alvo.id, 101, 'r'), { code: 'INVALID_LEVEL' });
  levelUp(actor, alvo.id, 3, 'r');
  assert.equal(getFullAccount(alvo.id).profile.level, 58);
});

test('inventario valida item, quantidade e nunca fica negativo', async () => {
  const alvo = player('inv1');
  const actor = actorOf();
  addItemToInventory(actor, alvo.id, 'minigun', 2, 'r');
  addItemToInventory(actor, alvo.id, 'minigun', 3, 'r');
  let inv = getInventory(alvo.id);
  assert.equal(inv[0].quantity, 5);
  assert.throws(() => removeItemFromInventory(actor, alvo.id, 'minigun', 6, 'r'), /Possui apenas 5/);
  const r = removeItemFromInventory(actor, alvo.id, 'minigun', 5, 'r');
  assert.equal(r.remaining, 0);
  assert.equal(getInventory(alvo.id).length, 0);
  assert.throws(() => addItemToInventory(actor, alvo.id, 'item-fantasma', 1, 'r'), { code: 'INVALID_ITEM' });
  assert.throws(() => addItemToInventory(actor, alvo.id, 'minigun', 0, 'r'), { code: 'INVALID_QUANTITY' });
});

test('reportMatch limita ganhos absurdos do cliente', async () => {
  const alvo = player('rep1');
  const r = reportMatch(alvo.id, {
    moneyEarned: 10 ** 15, tokensEarned: 10 ** 12, xpEarned: 10 ** 14,
    kills: 10 ** 9, damageDealt: 10 ** 18, playTimeSeconds: 10 ** 6, won: true
  });
  assert.equal(r.applied.coins, 2e5);
  assert.equal(r.applied.tokens, 1e3);
  assert.equal(r.applied.xp, 25e3);
  assert.equal(r.applied.kills, 5e3);
  const acc = getFullAccount(alvo.id);
  assert.equal(acc.profile.matches, 1);
});

test('reset exige confirmacao por username e zera escopos', async () => {
  const alvo = player('reset1');
  const actor = actorOf();
  giveCoins(actor, alvo.id, 1000, 'r');
  addItemToInventory(actor, alvo.id, 'ak47', 1, 'r');
  giveXp(actor, alvo.id, 1000, 'r');
  assert.throws(() => resetPlayer(actor, alvo.id, ['coins'], 'ERRADO', 'r'), /não corresponde/);
  resetPlayer(actor, alvo.id, ['all'], alvo.username, 'r');
  const acc = getFullAccount(alvo.id);
  assert.equal(acc.profile.coins, 0);
  assert.equal(acc.profile.level, 1);
  assert.equal(acc.inventory.length, 0);
});

test('ROLE_RANK: admin > developer > best_capybara', () => {
  assert.ok(ROLE_RANK.admin > ROLE_RANK.developer);
  assert.ok(ROLE_RANK.developer > ROLE_RANK.best_capybara);
  assert.ok(ROLE_RANK.king > ROLE_RANK.head_admin);
});

test('hasPermission: gates messages.global e portal.* por cargo', () => {
  assert.equal(hasPermission({ role: 'best_capybara' }, 'admin.view'), true);
  assert.equal(hasPermission({ role: 'best_capybara' }, 'messages.global'), false);
  assert.equal(hasPermission({ role: 'best_capybara' }, 'portal.news'), false);
  assert.equal(hasPermission({ role: 'developer' }, 'messages.global'), true);
  assert.equal(hasPermission({ role: 'admin' }, 'portal.wiki'), true);
  assert.equal(hasPermission({ role: 'king' }, 'portal.achievements'), true);
  assert.equal(hasPermission({ role: 'citizen' }, 'admin.view'), false);
  assert.ok(PERMISSIONS.admin.includes('messages.global'));
  assert.ok(PERMISSIONS.admin.includes('portal.news'));
});

test('global_messages: announce, motd único ativo e deactivate', () => {
  const actor = actorOf();
  const a = createGlobalMessage({ kind: 'announce', body: 'Olá arena', actorId: actor.id });
  assert.equal(a.kind, 'announce');
  assert.equal(a.active, true);
  assert.equal(a.status, 'active');
  const m1 = createGlobalMessage({ kind: 'motd', body: 'MOTD 1', actorId: actor.id });
  assert.equal(getActiveMotd()?.body, 'MOTD 1');
  createGlobalMessage({ kind: 'motd', body: 'MOTD 2', actorId: actor.id });
  assert.equal(getActiveMotd()?.body, 'MOTD 2');
  const listed = listGlobalMessages({ kind: 'motd', activeOnly: true });
  assert.equal(listed.length, 1);
  assert.equal(listed[0].body, 'MOTD 2');
  deactivateGlobalMessage(m1.id);
  assert.throws(() => createGlobalMessage({ kind: 'announce', body: '  ' }), { code: 'INVALID_INPUT' });
  assert.throws(() => createGlobalMessage({ kind: 'x', body: 'nope' }), { code: 'INVALID_INPUT' });
  void a;
});

test('global_messages: duration, expiry status, reactivate e listActive', async () => {
  const actor = actorOf();
  const timed = createGlobalMessage({
    kind: 'broadcast',
    body: 'sume em 5s',
    actorId: actor.id,
    durationSeconds: 5
  });
  assert.equal(timed.durationSeconds, 5);
  assert.ok(timed.expiresAt != null);
  assert.ok(timed.expiresAt > Date.now());
  assert.equal(timed.status, 'active');
  assert.ok(listActiveGlobalMessages().some((m) => m.id === timed.id));

  const manual = createGlobalMessage({
    kind: 'announce',
    body: 'fica',
    actorId: actor.id,
    durationSeconds: null
  });
  assert.equal(manual.durationSeconds, null);
  assert.equal(manual.expiresAt, null);
  assert.equal(manual.status, 'active');

  const toExpire = createGlobalMessage({
    kind: 'announce',
    body: 'já era',
    actorId: actor.id,
    durationSeconds: 30
  });
  const { db } = await import('../server/db.js');
  db.prepare('UPDATE global_messages SET expires_at = ? WHERE id = ?').run(Date.now() - 1000, toExpire.id);
  const expired = getGlobalMessageById(toExpire.id);
  assert.equal(expired.status, 'expired');
  assert.equal(expired.active, false);
  assert.equal(listActiveGlobalMessages().some((m) => m.id === expired.id), false);
  assert.notEqual(getActiveMotd()?.body, 'já era');

  const off = deactivateGlobalMessage(manual.id, { actorId: actor.id });
  assert.equal(off.status, 'disabled');
  assert.ok(off.disabledAt != null);

  const again = reactivateGlobalMessage(manual.id, {
    actorId: actor.id,
    durationSeconds: 30
  });
  assert.equal(again.status, 'active');
  assert.equal(again.durationSeconds, 30);
  assert.ok(again.expiresAt > Date.now());
  assert.equal(again.disabledAt, null);

  const dur = resolveMessageDuration({ durationSeconds: 60, publishedAt: 1_000_000 });
  assert.equal(dur.durationSeconds, 60);
  assert.equal(dur.expiresAt, 1_000_000 + 60_000);
  assert.deepEqual(resolveMessageDuration({ durationSeconds: null }), { durationSeconds: null, expiresAt: null });
  assert.throws(() => resolveMessageDuration({ durationSeconds: 0 }), { code: 'INVALID_INPUT' });
});

test('portal news/wiki/achievements CRUD e dashboard counts', () => {
  const actor = actorOf();
  const news = createPortalNews({
    title: 'Patch 1.0', summary: 'resumo', body: 'corpo', published: true, actorId: actor.id
  });
  assert.ok(news.slug);
  assert.equal(getPortalNewsBySlug(news.slug, { publishedOnly: true })?.title, 'Patch 1.0');
  updatePortalNews(news.id, { published: false, actorId: actor.id });
  assert.equal(getPortalNewsBySlug(news.slug, { publishedOnly: true }), null);
  assert.equal(listPortalNews({ publishedOnly: false }).some(n => n.id === news.id), true);

  const wiki = createPortalWiki({
    gameId: 'capyquake', title: 'Guia DB', bodyMd: '# hi', published: true, actorId: actor.id
  });
  assert.equal(listPortalWiki({ gameId: 'capyquake', publishedOnly: true }).some(w => w.id === wiki.id), true);

  const ach = createPortalAchievement({
    gameId: 'capyquake', name: 'DB Win', description: 'from admin', published: true, actorId: actor.id
  });
  assert.equal(listPortalAchievements({ gameId: 'capyquake', publishedOnly: true }).some(x => x.id === ach.id), true);

  const stats = dashboardStats();
  assert.equal(typeof stats.publishedNews, 'number');
  assert.equal(typeof stats.portalWiki, 'number');
  assert.equal(typeof stats.portalAchievements, 'number');
  assert.ok(stats.portalWiki >= 1);
  assert.ok(stats.portalAchievements >= 1);
});

test('perfil público: stats default private, opt-in, sem leak de economia', () => {
  const a = player('pub_a_' + Date.now());
  const b = player('pub_b_' + Date.now());
  giveCoins(actorOf(), a.id, 999, 'test');
  const stranger = toPublicProfile(a.username, b);
  assert.equal(stranger.statsPublic, false);
  assert.equal(stranger.stats, null);
  assert.equal(stranger.capybara, null);
  assert.ok(!('coins' in stranger));
  assert.ok(!JSON.stringify(stranger).includes('999'));
  assert.ok(!JSON.stringify(stranger).includes('password'));

  const selfView = toPublicProfile(a.username, a);
  assert.ok(selfView.stats);
  assert.equal(selfView.stats.level, 1);

  setStatsPublic(a.id, true);
  const open = toPublicProfile(a.username, b);
  assert.equal(open.statsPublic, true);
  assert.ok(open.stats);
  assert.equal(typeof open.stats.kills, 'number');
  assert.ok(open.capybara?.name);
  assert.ok(!JSON.stringify(open).includes('coins'));
  assert.ok(!JSON.stringify(open).includes('tokens'));
});

test('amizades: request/accept/list/unfriend/block', () => {
  const a = player('fr_a_' + Date.now());
  const b = player('fr_b_' + Date.now());
  assert.equal(requestFriend(a.id, b.username).status, 'pending_out');
  assert.throws(() => requestFriend(a.id, b.username), { code: 'CONFLICT' });
  assert.equal(acceptFriend(b.id, a.username).status, 'friends');
  const list = listFriends(a.id);
  assert.equal(list.friends.some(f => f.username === b.username), true);
  removeFriend(a.id, b.username);
  assert.equal(listFriends(a.id).friends.length, 0);
  blockUser(a.id, b.username);
  assert.throws(() => requestFriend(b.id, a.username), { code: 'FORBIDDEN' });
  unblockUser(a.id, b.username);
  assert.throws(() => requestFriend(a.id, a.username), { code: 'INVALID_INPUT' });
});

test('follows: follow/unfollow/lists e bloqueio', () => {
  const a = player('fo_a_' + Date.now());
  const b = player('fo_b_' + Date.now());
  assert.equal(followUser(a.id, b.username).following, true);
  assert.throws(() => followUser(a.id, b.username), { code: 'CONFLICT' });
  assert.throws(() => followUser(a.id, a.username), { code: 'INVALID_INPUT' });
  assert.equal(listFollowing(a.username).users.some(u => u.username === b.username), true);
  assert.equal(listFollowers(b.username).users.some(u => u.username === a.username), true);
  unfollowUser(a.id, b.username);
  assert.equal(listFollowing(a.username).users.length, 0);
  blockUser(b.id, a.username);
  assert.throws(() => followUser(a.id, b.username), { code: 'FORBIDDEN' });
});

test('lobbies efêmeros e presence payload', () => {
  _resetPresenceForTests();
  const rooms = new Map();
  bindRooms(rooms);
  assert.deepEqual(listPublicLobbies(), []);
  rooms.set(1, {
    code: 'ABCD',
    started: false,
    host: 'h',
    players: new Map([['h', { name: 'HostCapy' }]])
  });
  rooms.set(2, {
    code: 'ZZZZ',
    started: true,
    host: null,
    players: new Map()
  });
  const open = listPublicLobbies();
  assert.equal(open.length, 1);
  assert.equal(open[0].code, 'ABCD');
  assert.equal(open[0].hostName, 'HostCapy');
  assert.equal(open[0].maxPlayers, 6);
  assert.equal(getLobby('ABCD')?.playerCount, 1);
  assert.equal(listPublicLobbies({ includeStarted: true }).length, 2);

  touchOnline(42);
  assert.equal(presencePayload(42).status, 'online');
  setRoom(42, 'ABCD', false);
  assert.equal(presencePayload(42, { includeLobbyCode: true }).lobbyCode, 'ABCD');
  assert.equal(presencePayload(42).lobbyCode, undefined);
  clearPresence(42);
  assert.equal(presencePayload(42).status, 'offline');
  bindRooms(new Map());
});
