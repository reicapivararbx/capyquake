import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  _resetRegistryForTests,
  createServer,
  joinByCode,
  joinServer,
  leaveServer,
  closeServer,
  listServers,
  listServersAdmin,
  findByInviteCode,
  normalizeInviteCode,
  generateInviteCode,
  registerRuntimeServer,
  syncRuntime,
  bindRuntimeKey,
  buildPlayHref,
  kickPlayer,
  getServer,
  toPublicServer,
  GAME_IDS,
  GAME_CAPACITY,
} from '../server/servers-registry.js';
import { ApiError } from '../server/validation.js';

beforeEach(() => {
  _resetRegistryForTests();
});

const host = { userId: 1, username: 'host_a', displayName: 'Host A' };
const guest = { userId: 2, username: 'guest_b', displayName: 'Guest B' };
const other = { userId: 3, username: 'other_c', displayName: 'Other C' };
const host2 = { userId: 10, username: 'host_b', displayName: 'Host B' };

function mk(input) {
  return createServer({
    hostUserId: input.hostUserId ?? host.userId,
    hostUsername: input.hostUsername ?? host.username,
    hostDisplayName: input.hostDisplayName ?? host.displayName,
    ...input,
  });
}

test('normalizeInviteCode strips spaces/dashes and uppercases', () => {
  assert.equal(normalizeInviteCode('capy-7k2f'), 'CAPY-7K2F');
  assert.equal(normalizeInviteCode('CAPY 7K2F'), 'CAPY-7K2F');
  assert.equal(normalizeInviteCode('ab12'), 'AB12');
});

test('generateInviteCode uses safe charset without O0Il', () => {
  for (let i = 0; i < 40; i++) {
    const code = generateInviteCode();
    assert.match(code, /^CAPY-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
    assert.doesNotMatch(code, /[OIl0]/);
  }
});

test('create public server appears in listServers; private does not', () => {
  const pub = mk({
    gameId: 'capyquake',
    name: 'Sala Pública',
    visibility: 'public',
  });
  const priv = mk({
    gameId: 'capyrails',
    name: 'Sala Privada',
    visibility: 'private',
    hostUserId: host2.userId,
    hostUsername: host2.username,
    hostDisplayName: host2.displayName,
  });

  assert.equal(pub.server.visibility, 'public');
  assert.ok(priv.inviteCode || priv.server.inviteCode);

  const listed = listServers({});
  const ids = listed.map((s) => s.id);
  assert.ok(ids.includes(pub.server.id));
  assert.ok(!ids.includes(priv.server.id));
});

test('join-by-code finds private server and issues join token', () => {
  const { server, inviteCode } = mk({
    gameId: 'capyrails',
    name: 'Rails Secret',
    visibility: 'private',
  });
  const code = inviteCode || server.inviteCode;
  assert.ok(code);

  const found = findByInviteCode(code);
  assert.equal(found?.id, server.id);

  const joined = joinByCode(code, guest);
  assert.ok(joined.joinToken);
  assert.equal(joined.server.id, server.id);
});

test('join respects capacity', () => {
  const { server } = mk({
    gameId: 'capyquake',
    name: 'Full soon',
    visibility: 'public',
    maxPlayers: 2,
  });
  joinServer(server.id, guest);
  assert.throws(
    () => joinServer(server.id, other),
    (err) => err instanceof ApiError && /lotado|full|SERVER_FULL/i.test(String(err.message) + String(err.code)),
  );
});

test('leave and close remove from public list', () => {
  const { server } = mk({
    gameId: 'capyzen',
    name: 'Zen Temp',
    visibility: 'public',
  });
  joinServer(server.id, guest);
  leaveServer(server.id, guest.userId);
  closeServer(server.id, host.userId, { force: true, reason: 'test' });
  const listed = listServers({});
  assert.ok(!listed.some((s) => s.id === server.id));
  const admin = listServersAdmin({ includeClosed: true });
  const closed = admin.find((s) => s.id === server.id);
  assert.ok(!closed || closed.status === 'closed');
});

test('registerRuntimeServer + syncRuntime for capyquake rooms', () => {
  const result = registerRuntimeServer({
    gameId: 'capyquake',
    name: 'CQ AB12',
    hostUserId: host.userId,
    hostUsername: host.username,
    hostDisplayName: host.displayName,
    visibility: 'public',
    maxPlayers: 6,
    runtimeKey: 'AB12',
    inviteCode: 'AB12',
    playerCount: 1,
    status: 'waiting',
  });
  assert.ok(result.server?.id);
  syncRuntime('AB12', { playerCount: 3, status: 'playing', started: true });
  const s = getServer(result.server.id);
  assert.equal(s.playerCount, 3);
  assert.equal(s.status, 'playing');
});

test('toPublicServer hides inviteCode for non-owners', () => {
  const { server } = mk({
    gameId: 'find-the-markers',
    name: 'FTM hide',
    visibility: 'private',
  });
  const pub = toPublicServer(server, { viewerUserId: guest.userId });
  assert.equal(pub.inviteCode, null);
  const ownerView = toPublicServer(server, {
    viewerUserId: host.userId,
    includeInvite: true,
  });
  assert.ok(ownerView.inviteCode);
});

test('kickPlayer removes target', () => {
  const { server } = mk({
    gameId: 'capyquake',
    name: 'Kick room',
    visibility: 'public',
  });
  joinServer(server.id, guest);
  kickPlayer(server.id, guest.userId, host.userId, {});
  const after = getServer(server.id);
  assert.ok(after.playerCount <= 1);
});

test('GAME_CAPACITY covers all GAME_IDS', () => {
  for (const id of GAME_IDS) {
    assert.ok(GAME_CAPACITY[id], `missing capacity for ${id}`);
    assert.ok(GAME_CAPACITY[id].defaultMaxPlayers >= 1);
  }
});

test('createServer returns host playHref with asHost and joinToken', () => {
  const result = mk({
    gameId: 'capyquake',
    name: 'Host Link',
    visibility: 'public',
  });
  assert.ok(result.joinToken);
  assert.ok(result.playHref);
  assert.match(result.playHref, /serverId=/);
  assert.match(result.playHref, /joinToken=/);
  assert.match(result.playHref, /asHost=1/);
});

test('bindRuntimeKey links portal server to live room code', () => {
  const { server } = mk({
    gameId: 'capyquake',
    name: 'Bind Me',
    visibility: 'public',
  });
  assert.equal(server.runtimeKey, null);
  const pub = bindRuntimeKey(server.id, 'ZX9K', { playerCount: 1, status: 'waiting' });
  assert.ok(pub);
  const after = getServer(server.id);
  assert.equal(after.runtimeKey, 'ZX9K');
  const href = buildPlayHref(after, 'tok');
  assert.match(href, /lobby=ZX9K/);
  assert.doesNotMatch(href, /asHost=/);
});
