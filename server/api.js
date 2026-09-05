import { db } from './db.js';
import { env } from './env.js';
import { verifyPassword } from './passwords.js';
import { hit } from './ratelimit.js';
import {
  createUser, authenticate, resolveSession, revokeSession, createSession,
  createAdminCodeSession, getUserById, findByUsername, getFullAccount, reportMatch, updateCapybara, getCapybara,
  giveCoins, setCoins, giveTokens, setTokens, giveXp, setXp, setLevel, levelUp,
  addItemToInventory, removeItemFromInventory, getInventory, maxStats, heal,
  banUser, suspendUser, unbanUser, changeRole, resetPlayer, logAdminAction,
  listLogs, listTransactions, searchUsers, dashboardStats, countUsers, getItemsCatalog,
  changeOwnPassword, adminSetPassword, revokeTargetSessions,
  createGlobalMessage, listGlobalMessages, listActiveGlobalMessages, getGlobalMessageById, getActiveMotd,
  deactivateGlobalMessage, reactivateGlobalMessage, updateGlobalMessage, deleteGlobalMessage,
  toPublicGlobalMessage,
  listPortalNews, getPortalNewsBySlug, getPortalNewsById, createPortalNews, updatePortalNews, deletePortalNews,
  listPortalWiki, getPortalWikiById, getPortalWikiArticle, createPortalWiki, updatePortalWiki, deletePortalWiki,
  listPortalAchievements, getPortalAchievementById, createPortalAchievement, updatePortalAchievement, deletePortalAchievement,
  toPublicProfile, setStatsPublic, listFriends, requestFriend, acceptFriend, declineFriend,
  removeFriend, blockUser, unblockUser, followUser, unfollowUser,
  listFollowers, listFollowing, listMyFollowers, listMyFollowing, searchUsersPublic,
  unlockAchievement, listUserAchievements, listMyAchievements, setFeaturedAchievements
} from './services.js';
import { listPublicLobbies, getLobby } from './lobbies.js';
import {
  assertGameId,
  bindRuntimeKey,
  closeServer,
  createServer,
  findByRuntimeKey,
  getServer,
  issueJoinToken,
  joinByCode,
  joinServer,
  kickPlayer,
  leaveServer,
  listGameCapacity,
  listPlayers,
  listServers,
  listServersAdmin,
  registerRuntimeServer,
  syncRuntime,
  toPublicServer,
  touchHeartbeatByRuntime,
  updateServer,
} from './servers-registry.js';
import {
  ApiError, ROLE_RANK, ROLES, ROLE_LABELS, ADMIN_VIEW_ROLES,
  VIEW_PERMS, PERMISSIONS, hasPermission, getAvailablePermissions
} from './validation.js';

export { PERMISSIONS, hasPermission, getAvailablePermissions };

function requireAuth(req) {
  if (!req.user) throw new ApiError('UNAUTHORIZED', 'Sessão necessária.', 401);
  return req.user;
}

function requirePerm(req, perm) {
  const user = requireAuth(req);
  if (!hasPermission(user, perm)) {
    throw new ApiError('INSUFFICIENT_PERMISSION', 'Permissão insuficiente.', 403);
  }
  return user;
}

function requireRuntimeBridge(req) {
  const secret = env.runtimeBridgeSecret;
  const header = String(req.headers['x-runtime-bridge-secret'] || req.headers['x-capy-runtime-secret'] || '');
  if (!secret || !header || header !== secret) {
    throw new ApiError('FORBIDDEN', 'Runtime bridge não autorizado.', 403);
  }
}

// ---------- idempotency ----------
const idempotencyCache = new Map();
function withIdempotency(req, key, fn) {
  if (!key) return fn();
  const cacheKey = `${req.user.id}:${req.pathname}:${key}`;
  if (idempotencyCache.has(cacheKey)) return idempotencyCache.get(cacheKey);
  const result = fn();
  idempotencyCache.set(cacheKey, result);
  if (idempotencyCache.size > 5000) idempotencyCache.clear();
  return result;
}

// ---------- helpers ----------

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function attachSession(req) {
  const token = parseCookies(req).cq_session;
  if (token) req.user = resolveSession(token);
  req.sessionToken = token || null;
}

export function sessionCookieHeader(req, token, expiresAt) {
  const host = String(req.headers.host || '').toLowerCase().split(':')[0];
  const isProdDomain = host === 'm.zanona.com.br' ||
    (req.headers['x-forwarded-proto'] === 'https' && (host.endsWith('.m.zanona.com.br') || host.endsWith('.zanona.com.br')));
  const parts = [`cq_session=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax',
    `Max-Age=${Math.floor((expiresAt - Date.now()) / 1000)}`];
  // Cookie compartilhado entre m.zanona.com.br e admin.m.zanona.com.br.
  if (host.endsWith('zanona.com.br')) parts.push('Domain=.m.zanona.com.br');
  if (isProdDomain) parts.push('Secure');
  return parts.join('; ');
}

function clearCookieHeader() {
  return 'cq_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function clientIp(req) {
  return req.socket.remoteAddress || 'unknown';
}

async function readJsonBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new ApiError('INVALID_INPUT', 'Body muito grande.', 413);
  }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new ApiError('INVALID_INPUT', 'JSON inválido.'); }
}

function intParam(v, def) {
  const n = Number.parseInt(v, 10);
  return Number.isSafeInteger(n) ? n : def;
}

let globalMessageBroadcaster = null;

export function setGlobalMessageBroadcaster(fn) {
  globalMessageBroadcaster = typeof fn === 'function' ? fn : null;
}

function emitGlobalMessageEvent(event, message) {
  if (!globalMessageBroadcaster) return;
  try {
    globalMessageBroadcaster(event, message);
  } catch (err) {
    console.error('[api] global message broadcast failed:', err);
  }
}

function parseDurationInput(b) {
  if (b.untilDisabled === true || b.duration === 'manual' || b.duration === 'until_disabled'
      || b.durationSeconds === null || b.durationSeconds === -1) {
    return { durationSeconds: null };
  }
  if (b.durationSeconds !== undefined && b.durationSeconds !== null && b.durationSeconds !== '') {
    return { durationSeconds: Number(b.durationSeconds) };
  }
  if (b.duration != null && b.duration !== '' && b.duration !== 'custom') {
    const n = Number(b.duration);
    if (Number.isFinite(n)) return { durationSeconds: n };
  }
  if (b.expiresAt != null && b.expiresAt !== '') {
    return { expiresAt: Number(b.expiresAt) };
  }
  return {};
}

// ---------- seed do admin ----------

import { hashPassword } from './passwords.js';
export function ensureAdminSeed() {
  if (!env.adminPassword || !env.adminCode) {
    console.warn('[auth] CAPYQUAKE_ADMIN_PASSWORD/CODE ausentes no .env — login de admin desativado.');
    return;
  }
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(env.adminUsername);
  if (!existing) {
    const t = Date.now();
    db.prepare(
      `INSERT INTO users (username, display_name, password_hash, role, status, created_at, updated_at)
       VALUES (?, ?, ?, 'king', 'active', ?, ?)`
    ).run(env.adminUsername, 'Administrator', hashPassword(env.adminPassword), t, t);
    const id = Number(db.prepare('SELECT id FROM users WHERE username=?').get(env.adminUsername).id);
    db.prepare('INSERT INTO game_profiles (user_id, created_at, updated_at) VALUES (?, ?, ?)').run(id, t, t);
    console.log(`[auth] conta administrativa '${env.adminUsername}' criada.`);
  } else if (existing.role !== 'king' || !verifyPassword(env.adminPassword, existing.password_hash)) {
    db.prepare("UPDATE users SET role='king', password_hash=?, updated_at=? WHERE id=?")
      .run(hashPassword(env.adminPassword), Date.now(), existing.id);
    console.log('[auth] credenciais da conta administrativa sincronizadas com o ambiente.');
  }
}

const EASTER_EGG_USER = 'eggmaster';

// ---------- admin chat (in-memory) ----------
const adminChatMessages = [];
const ADMIN_CHAT_MAX = 200;

const EASTER_EGG_PASS = 'CapyEggs2025!';
export function ensureEasterEggSeed() {
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(EASTER_EGG_USER);
  if (!existing) {
    const t = Date.now();
    db.prepare(
      `INSERT INTO users (username, display_name, password_hash, role, status, created_at, updated_at)
       VALUES (?, ?, ?, 'developer', 'active', ?, ?)`
    ).run(EASTER_EGG_USER, 'Easter Egg Master', hashPassword(EASTER_EGG_PASS), t, t);
    const id = Number(db.prepare('SELECT id FROM users WHERE username=?').get(EASTER_EGG_USER).id);
    db.prepare('INSERT INTO game_profiles (user_id, created_at, updated_at) VALUES (?, ?, ?)').run(id, t, t);
    console.log(`[auth] conta easter-egg '${EASTER_EGG_USER}' (developer) criada.`);
  } else if (existing.role !== 'developer') {
    db.prepare("UPDATE users SET role='developer', updated_at=? WHERE id=?")
      .run(Date.now(), existing.id);
  }
}

// ---------- dispatcher ----------

export async function handleApi(req, res, pathname, query) {
  try {
    attachSession(req);
    const method = req.method.toUpperCase();

    // ---- public auth ----
    if (pathname === '/api/auth/register' && method === 'POST') {
      const regWait = hit(`reg:${clientIp(req)}`, 10, 600000);
      if (regWait) return rateLimited(res, regWait);
      const body = await readJsonBody(req);
      if (String(body.confirmPassword ?? '') !== String(body.password ?? '')) {
        throw new ApiError('INVALID_PASSWORD', 'Senhas não conferem.');
      }
      const user = createUser({ username: body.username, password: body.password, displayName: body.displayName });
      const s = createSession(user.id);
      res.setHeader('Set-Cookie', sessionCookieHeader(req, s.token, s.expiresAt));
      return json(res, 201, { success: true, user });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const wait = hit(`login:${clientIp(req)}`, 15, 300000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      const user = authenticate(body.username, body.password);
      const s = createSession(user.id);
      res.setHeader('Set-Cookie', sessionCookieHeader(req, s.token, s.expiresAt));
      return json(res, 200, { success: true, user });
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      if (req.sessionToken && req.user) {
        revokeSession(req.sessionToken);
        if (req.user.role !== 'player') {
          logAdminAction(req.user.id, req.user.id, 'ADMIN_LOGOUT', {}, true);
        }
      }
      res.setHeader('Set-Cookie', clearCookieHeader());
      return json(res, 200, { success: true });
    }

    if (pathname === '/api/users/me' && method === 'GET') {
      const user = requireAuth(req);
      return json(res, 200, { success: true, ...getFullAccount(user.id), permissions: PERMISSIONS[user.role] });
    }

    if (pathname === '/api/users/me/privacy' && method === 'PATCH') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      if (typeof body.statsPublic !== 'boolean') {
        throw new ApiError('INVALID_INPUT', 'statsPublic (boolean) obrigatório.', 400);
      }
      const updated = setStatsPublic(user.id, body.statsPublic);
      return json(res, 200, { success: true, user: updated, statsPublic: !!updated.statsPublic });
    }

    if (pathname === '/api/users/search' && method === 'GET') {
      const user = requireAuth(req);
      const wait = hit(`usearch:${user.id}`, 30, 60000);
      if (wait) return rateLimited(res, wait);
      const result = searchUsersPublic(user.id, {
        q: query.get('q') || '',
        limit: intParam(query.get('limit'), 20)
      });
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/lobbies' && method === 'GET') {
      const lobbies = listPublicLobbies({
        includeStarted: query.get('includeStarted') === '1'
      });
      return json(res, 200, { success: true, lobbies });
    }

    const lobbyCodeMatch = pathname.match(/^\/api\/lobbies\/([A-Za-z0-9]{2,8})$/);
    if (lobbyCodeMatch && method === 'GET') {
      const lobby = getLobby(lobbyCodeMatch[1]);
      if (!lobby) throw new ApiError('NOT_FOUND', 'Lobby não encontrado.', 404);
      return json(res, 200, { success: true, lobby });
    }

    if (pathname === '/api/servers/meta' && method === 'GET') {
      return json(res, 200, { success: true, games: listGameCapacity() });
    }

    if (pathname === '/api/servers' && method === 'GET') {
      const mine = query.get('mine') === '1' || query.get('mine') === 'true';
      const viewer = mine ? requireAuth(req) : (req.user || null);
      const hasSlotsRaw = query.get('hasSlots');
      const servers = listServers({
        gameId: query.get('gameId') || undefined,
        hasSlots: hasSlotsRaw === '1' || hasSlotsRaw === 'true',
        mineUserId: mine && viewer ? viewer.id : undefined,
        q: query.get('q') || undefined,
        status: query.get('status') || undefined,
        limit: intParam(query.get('limit'), 100),
      });
      return json(res, 200, { success: true, servers });
    }

    if (pathname === '/api/servers' && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`srv-create:${user.id}`, 8, 300000);
      if (wait) return rateLimited(res, wait);
      if (user.status === 'banned' || user.status === 'suspended') {
        throw new ApiError('FORBIDDEN', 'Conta suspensa ou banida.', 403);
      }
      const body = await readJsonBody(req);
      assertGameId(body.gameId);
      const result = createServer({
        gameId: body.gameId,
        name: body.name,
        hostUserId: user.id,
        hostUsername: user.username,
        hostDisplayName: user.displayName || user.username,
        visibility: body.visibility === 'private' ? 'private' : 'public',
        maxPlayers: body.maxPlayers,
        meta: body.meta && typeof body.meta === 'object' ? body.meta : undefined,
      });
      return json(res, 201, {
        success: true,
        server: result.public,
        inviteCode: result.inviteCode,
        hostSessionId: result.hostSessionId,
        joinToken: result.joinToken || null,
        expiresAt: result.expiresAt || null,
        playHref: result.playHref || result.public.playHref || null,
      });
    }

    if (pathname === '/api/servers/join-by-code' && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`srv-join-code:${user.id}`, 20, 60000);
      if (wait) return rateLimited(res, wait);
      if (user.status === 'banned' || user.status === 'suspended') {
        throw new ApiError('FORBIDDEN', 'Conta suspensa ou banida.', 403);
      }
      const body = await readJsonBody(req);
      const code = String(body.code || body.inviteCode || '').trim();
      if (!code) throw new ApiError('INVALID_INPUT', 'Código obrigatório.', 400);
      const result = joinByCode(code, {
        userId: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
      });
      return json(res, 200, {
        success: true,
        serverId: result.server.id,
        gameId: result.gameId,
        joinToken: result.joinToken,
        expiresAt: result.expiresAt,
        playHref: result.playHref,
        server: result.server,
      });
    }

    const serverIdMatch = pathname.match(/^\/api\/servers\/([^/]+)$/);
    if (serverIdMatch && method === 'GET') {
      const server = getServer(serverIdMatch[1]);
      if (!server || server.status === 'closed') {
        throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
      }
      if (server.visibility === 'private') {
        const user = req.user;
        const isHost = user && user.id === server.hostUserId;
        const isMember = user && listPlayers(server.id).some((p) => p.userId === user.id);
        const isStaff = user && hasPermission(user, 'servers.view');
        if (!isHost && !isMember && !isStaff) {
          throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
        }
      }
      const viewerId = req.user?.id ?? null;
      return json(res, 200, {
        success: true,
        server: toPublicServer(server, {
          includeInvite: viewerId != null && viewerId === server.hostUserId,
          viewerUserId: viewerId,
        }),
        players: listPlayers(server.id),
      });
    }

    if (serverIdMatch && method === 'PATCH') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const force = hasPermission(user, 'servers.manage');
      const result = updateServer(
        serverIdMatch[1],
        user.id,
        {
          name: body.name,
          visibility: body.visibility,
          maxPlayers: body.maxPlayers,
        },
        { force },
      );
      return json(res, 200, {
        success: true,
        server: result.server,
        inviteCode: result.inviteCode,
      });
    }

    const serverJoinMatch = pathname.match(/^\/api\/servers\/([^/]+)\/join$/);
    if (serverJoinMatch && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`srv-join:${user.id}`, 30, 60000);
      if (wait) return rateLimited(res, wait);
      if (user.status === 'banned' || user.status === 'suspended') {
        throw new ApiError('FORBIDDEN', 'Conta suspensa ou banida.', 403);
      }
      const body = await readJsonBody(req);
      const result = joinServer(
        serverJoinMatch[1],
        {
          userId: user.id,
          username: user.username,
          displayName: user.displayName || user.username,
        },
        {
          inviteCode: body.inviteCode || body.code || null,
          joinToken: body.joinToken || null,
        },
      );
      return json(res, 200, {
        success: true,
        server: result.server,
        joinToken: result.joinToken,
        expiresAt: result.expiresAt,
        playHref: result.playHref,
        gameId: result.gameId,
        sessionId: result.player.sessionId,
      });
    }

    const serverLeaveMatch = pathname.match(/^\/api\/servers\/([^/]+)\/leave$/);
    if (serverLeaveMatch && method === 'POST') {
      const user = requireAuth(req);
      const pub = leaveServer(serverLeaveMatch[1], user.id);
      return json(res, 200, { success: true, server: pub });
    }

    const serverCloseMatch = pathname.match(/^\/api\/servers\/([^/]+)\/close$/);
    if (serverCloseMatch && method === 'POST') {
      const user = requireAuth(req);
      const force = hasPermission(user, 'servers.close') || hasPermission(user, 'servers.manage');
      const body = await readJsonBody(req).catch(() => ({}));
      const pub = closeServer(serverCloseMatch[1], user.id, {
        force,
        reason: body.reason || (force ? 'admin_close' : 'host_closed'),
      });
      return json(res, 200, { success: true, server: pub });
    }

    const serverKickMatch = pathname.match(/^\/api\/servers\/([^/]+)\/kick$/);
    if (serverKickMatch && method === 'POST') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const targetId = Number(body.userId);
      if (!Number.isSafeInteger(targetId)) {
        throw new ApiError('INVALID_INPUT', 'userId obrigatório.', 400);
      }
      const force = hasPermission(user, 'servers.kick_player') || hasPermission(user, 'servers.manage');
      const pub = kickPlayer(serverKickMatch[1], targetId, user.id, { force });
      return json(res, 200, { success: true, server: pub });
    }

    if (pathname === '/api/admin/servers' && method === 'GET') {
      requirePerm(req, 'servers.view');
      const servers = listServersAdmin({
        gameId: query.get('gameId') || undefined,
        includeClosed: query.get('includeClosed') === '1',
        limit: intParam(query.get('limit'), 200),
      });
      return json(res, 200, { success: true, servers });
    }

    const adminServerClose = pathname.match(/^\/api\/admin\/servers\/([^/]+)\/close$/);
    if (adminServerClose && method === 'POST') {
      const user = requirePerm(req, 'servers.close');
      const body = await readJsonBody(req).catch(() => ({}));
      const pub = closeServer(adminServerClose[1], user.id, {
        force: true,
        reason: body.reason || 'admin_force_close',
      });
      return json(res, 200, { success: true, server: pub });
    }

    const adminServerKick = pathname.match(/^\/api\/admin\/servers\/([^/]+)\/kick$/);
    if (adminServerKick && method === 'POST') {
      const user = requirePerm(req, 'servers.kick_player');
      const body = await readJsonBody(req);
      const targetId = Number(body.userId);
      if (!Number.isSafeInteger(targetId)) {
        throw new ApiError('INVALID_INPUT', 'userId obrigatório.', 400);
      }
      const pub = kickPlayer(adminServerKick[1], targetId, user.id, { force: true });
      return json(res, 200, { success: true, server: pub });
    }

    // --- Runtime bridge (external game processes: capyrails, stubs) ---
    if (pathname === '/api/internal/runtime/register' && method === 'POST') {
      requireRuntimeBridge(req);
      const wait = hit('runtime-reg:ip', 120, 60000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      assertGameId(body.gameId);
      const runtimeKey = String(body.runtimeKey || body.code || '').trim();
      if (!runtimeKey) throw new ApiError('INVALID_INPUT', 'runtimeKey obrigatório.', 400);

      if (body.serverId) {
        const existing = getServer(String(body.serverId));
        if (existing && existing.status !== 'closed') {
          const pub = bindRuntimeKey(existing.id, runtimeKey, {
            playerCount: body.playerCount,
            status: body.status,
            hostUserId: body.hostUserId,
          });
          if (body.name || body.started != null) {
            syncRuntime(runtimeKey, {
              name: body.name,
              started: body.started,
              playerCount: body.playerCount,
              status: body.status,
              hostName: body.hostName || body.hostUsername,
              hostUserId: body.hostUserId,
            });
          }
          return json(res, 200, {
            success: true,
            server: pub || toPublicServer(existing),
            bound: true,
            created: false,
          });
        }
      }

      const result = registerRuntimeServer({
        gameId: body.gameId,
        name: body.name || `${body.gameId} ${runtimeKey}`,
        hostUserId: Number(body.hostUserId) || 0,
        hostUsername: String(body.hostUsername || body.hostName || 'host').slice(0, 32),
        hostDisplayName: String(body.hostDisplayName || body.hostName || body.hostUsername || 'host').slice(0, 48),
        visibility: body.visibility === 'private' ? 'private' : 'public',
        maxPlayers: body.maxPlayers,
        runtimeKey,
        inviteCode: body.inviteCode || (runtimeKey.length === 4 ? runtimeKey : undefined),
        playerCount: body.playerCount,
        status: body.status || 'waiting',
      });
      return json(res, 200, {
        success: true,
        server: result.public,
        created: result.created,
        bound: false,
      });
    }

    if (pathname === '/api/internal/runtime/sync' && method === 'POST') {
      requireRuntimeBridge(req);
      const wait = hit('runtime-sync:ip', 300, 60000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      const runtimeKey = String(body.runtimeKey || body.code || '').trim();
      if (!runtimeKey) throw new ApiError('INVALID_INPUT', 'runtimeKey obrigatório.', 400);
      const pub = syncRuntime(runtimeKey, {
        playerCount: body.playerCount,
        status: body.status,
        started: body.started,
        name: body.name,
        hostName: body.hostName || body.hostUsername,
        hostUserId: body.hostUserId,
      });
      touchHeartbeatByRuntime(runtimeKey);
      if (!pub) {
        return json(res, 404, { success: false, error: 'NOT_FOUND', message: 'Runtime não registrado.' });
      }
      return json(res, 200, { success: true, server: pub });
    }

    if (pathname === '/api/internal/runtime/close' && method === 'POST') {
      requireRuntimeBridge(req);
      const body = await readJsonBody(req);
      const runtimeKey = String(body.runtimeKey || body.code || '').trim();
      const serverId = body.serverId ? String(body.serverId) : null;
      let server = serverId ? getServer(serverId) : null;
      if (!server && runtimeKey) server = findByRuntimeKey(runtimeKey);
      if (!server || server.status === 'closed') {
        return json(res, 200, { success: true, closed: false });
      }
      const pub = closeServer(server.id, server.hostUserId, {
        force: true,
        reason: body.reason || 'runtime_closed',
      });
      return json(res, 200, { success: true, closed: true, server: pub });
    }

    if (pathname === '/api/friends' && method === 'GET') {
      const user = requireAuth(req);
      return json(res, 200, { success: true, ...listFriends(user.id) });
    }

    if (pathname === '/api/friends/request' && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`friend:${user.id}`, 20, 600000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      const result = requestFriend(user.id, body.username);
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/friends/accept' && method === 'POST') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const result = acceptFriend(user.id, body.username);
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/friends/decline' && method === 'POST') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const result = declineFriend(user.id, body.username);
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/friends/block' && method === 'POST') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const result = blockUser(user.id, body.username);
      return json(res, 200, { success: true, ...result });
    }

    const friendUnblock = pathname.match(/^\/api\/friends\/block\/([^/]+)$/);
    if (friendUnblock && method === 'DELETE') {
      const user = requireAuth(req);
      const result = unblockUser(user.id, decodeURIComponent(friendUnblock[1]));
      return json(res, 200, { success: true, ...result });
    }

    const friendUser = pathname.match(/^\/api\/friends\/([^/]+)$/);
    if (friendUser && method === 'DELETE' && friendUser[1] !== 'block' && friendUser[1] !== 'request') {
      const user = requireAuth(req);
      const result = removeFriend(user.id, decodeURIComponent(friendUser[1]));
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/me/followers' && method === 'GET') {
      const user = requireAuth(req);
      return json(res, 200, {
        success: true,
        ...listMyFollowers(user.id, {
          limit: intParam(query.get('limit'), 50),
          offset: intParam(query.get('offset'), 0)
        })
      });
    }

    if (pathname === '/api/me/following' && method === 'GET') {
      const user = requireAuth(req);
      return json(res, 200, {
        success: true,
        ...listMyFollowing(user.id, {
          limit: intParam(query.get('limit'), 50),
          offset: intParam(query.get('offset'), 0)
        })
      });
    }

    const followMatch = pathname.match(/^\/api\/follow\/([^/]+)$/);
    if (followMatch && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`follow:${user.id}`, 30, 600000);
      if (wait) return rateLimited(res, wait);
      const result = followUser(user.id, decodeURIComponent(followMatch[1]));
      return json(res, 200, { success: true, ...result });
    }
    if (followMatch && method === 'DELETE') {
      const user = requireAuth(req);
      const result = unfollowUser(user.id, decodeURIComponent(followMatch[1]));
      return json(res, 200, { success: true, ...result });
    }

    const userFollowers = pathname.match(/^\/api\/users\/([^/]+)\/followers$/);
    if (userFollowers && method === 'GET') {
      const result = listFollowers(decodeURIComponent(userFollowers[1]), {
        limit: intParam(query.get('limit'), 50),
        offset: intParam(query.get('offset'), 0)
      });
      return json(res, 200, { success: true, ...result });
    }

    const userFollowing = pathname.match(/^\/api\/users\/([^/]+)\/following$/);
    if (userFollowing && method === 'GET') {
      const result = listFollowing(decodeURIComponent(userFollowing[1]), {
        limit: intParam(query.get('limit'), 50),
        offset: intParam(query.get('offset'), 0)
      });
      return json(res, 200, { success: true, ...result });
    }

    const publicUserMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (publicUserMatch && method === 'GET' && publicUserMatch[1] !== 'me' && publicUserMatch[1] !== 'search') {
      const profile = toPublicProfile(decodeURIComponent(publicUserMatch[1]), req.user || null);
      return json(res, 200, { success: true, profile });
    }

    // ---- troca de senha do proprio usuario ----
    if (pathname === '/api/auth/change-password' && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`pwd:${user.id}`, 8, 600000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      if (String(body.confirmPassword ?? '') !== String(body.newPassword ?? '')) {
        throw new ApiError('INVALID_PASSWORD', 'A confirmação não confere com a nova senha.');
      }
      const u = changeOwnPassword(user.id, body.currentPassword, body.newPassword);
      return json(res, 200, { success: true, user: u });
    }

    // ---- metadata publica (cargos/labels para clientes) ----
    if (pathname === '/api/meta/roles' && method === 'GET') {
      return json(res, 200, {
        success: true,
        roles: ROLES,
        labels: ROLE_LABELS,
        adminViewRoles: ADMIN_VIEW_ROLES
      });
    }

    if (pathname === '/api/portal/motd' && method === 'GET') {
      const motd = getActiveMotd();
      return json(res, 200, {
        success: true,
        motd: motd ? toPublicGlobalMessage(motd) : null
      });
    }

    if ((pathname === '/api/portal/messages/active' || pathname === '/api/global-messages/active')
        && method === 'GET') {
      const messages = listActiveGlobalMessages({
        limit: intParam(query.get('limit'), 20)
      }).map(toPublicGlobalMessage);
      return json(res, 200, {
        success: true,
        messages,
        motd: toPublicGlobalMessage(getActiveMotd()),
        serverTime: Date.now()
      });
    }

    if (pathname === '/api/portal/news' && method === 'GET') {
      const items = listPortalNews({
        publishedOnly: true,
        limit: intParam(query.get('limit'), 20),
        offset: intParam(query.get('offset'), 0)
      });
      return json(res, 200, { success: true, news: items });
    }

    const publicNewsSlug = pathname.match(/^\/api\/portal\/news\/([^/]+)$/);
    if (publicNewsSlug && method === 'GET') {
      const item = getPortalNewsBySlug(decodeURIComponent(publicNewsSlug[1]), { publishedOnly: true });
      if (!item) throw new ApiError('NOT_FOUND', 'Novidade não encontrada.', 404);
      return json(res, 200, { success: true, news: item });
    }

    if (pathname === '/api/portal/wiki' && method === 'GET') {
      const items = listPortalWiki({
        gameId: query.get('gameId') || undefined,
        publishedOnly: true,
        limit: intParam(query.get('limit'), 100),
        offset: intParam(query.get('offset'), 0)
      });
      return json(res, 200, { success: true, articles: items });
    }

    const publicWiki = pathname.match(/^\/api\/portal\/wiki\/([^/]+)\/([^/]+)$/);
    if (publicWiki && method === 'GET') {
      const item = getPortalWikiArticle(decodeURIComponent(publicWiki[1]), decodeURIComponent(publicWiki[2]), { publishedOnly: true });
      if (!item) throw new ApiError('NOT_FOUND', 'Artigo não encontrado.', 404);
      return json(res, 200, { success: true, article: item });
    }

    if (pathname === '/api/portal/achievements' && method === 'GET') {
      const items = listPortalAchievements({
        gameId: query.get('gameId') || undefined,
        publishedOnly: true,
        limit: intParam(query.get('limit'), 200),
        offset: intParam(query.get('offset'), 0)
      });
      return json(res, 200, { success: true, achievements: items });
    }

    if (pathname === '/api/achievements' && method === 'GET') {
      const user = requireAuth(req);
      const pack = listMyAchievements(user.id, {
        gameId: query.get('gameId') || undefined
      });
      return json(res, 200, { success: true, ...pack });
    }

    if (pathname === '/api/achievements/unlock' && method === 'POST') {
      const user = requireAuth(req);
      const wait = hit(`achunlock:${user.id}`, 30, 60000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      const key = body.achievementKey || body.key || body.id;
      if (!key) throw new ApiError('INVALID_INPUT', 'achievementKey obrigatório.', 400);
      const result = unlockAchievement(user.id, key);
      return json(res, 200, { success: true, ...result });
    }

    if (pathname === '/api/me/featured-achievements' && method === 'PATCH') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      const keys = body.keys ?? body.featured ?? body.achievementKeys;
      const pack = setFeaturedAchievements(user.id, keys);
      return json(res, 200, { success: true, ...pack });
    }

    const userAchMatch = pathname.match(/^\/api\/users\/([^/]+)\/achievements$/);
    if (userAchMatch && method === 'GET') {
      const raw = findByUsername(decodeURIComponent(userAchMatch[1]));
      if (!raw || raw.status === 'banned' || raw.status === 'suspended') {
        throw new ApiError('NOT_FOUND', 'Usuário não encontrado.', 404);
      }
      const viewerId = req.user?.id ?? null;
      const isSelf = viewerId != null && Number(viewerId) === Number(raw.id);
      const statsPublic = !!(raw.stats_public ?? raw.statsPublic);
      if (!isSelf && !statsPublic) {
        throw new ApiError('FORBIDDEN', 'Conquistas privadas.', 403);
      }
      const pack = listUserAchievements(raw.id, {
        gameId: query.get('gameId') || undefined,
        viewerId
      });
      return json(res, 200, { success: true, ...pack });
    }

    // ---- game sync ----
    if (pathname === '/api/game/report' && method === 'POST') {
      const user = requireAuth(req);
      // Partida legítima dura minutos; reports em rajada são farm scriptado.
      const wait = hit(`report:${user.id}`, 2, 60000);
      if (wait) return rateLimited(res, wait);
      const body = await readJsonBody(req);
      return json(res, 200, { success: true, result: reportMatch(user.id, body) });
    }

    if (pathname === '/api/game/capybara' && method === 'GET') {
      const user = requireAuth(req);
      return json(res, 200, { success: true, capybara: getCapybara(user.id) });
    }

    if (pathname === '/api/game/capybara' && method === 'POST') {
      const user = requireAuth(req);
      const body = await readJsonBody(req);
      return json(res, 200, { success: true, capybara: updateCapybara(user.id, body) });
    }

    // ---- admin ----
    if (pathname.startsWith('/api/admin')) {
      if (pathname === '/api/admin/code' && method === 'POST') {
        const wait = hit(`admcode:${clientIp(req)}`, 8, 900000);
        if (wait) return rateLimited(res, wait);
        const body = await readJsonBody(req);
        if (!env.adminCode || typeof body.code !== 'string' ||
          !timingSafeEq(body.code, env.adminCode)) {
          logAdminAction(null, null, 'ADMIN_CODE_FAILURE', { ip: clientIp(req) }, false);
          throw new ApiError('FORBIDDEN', 'Credenciais administrativas inválidas.', 403);
        }
        const s = createAdminCodeSession();
        logAdminAction(null, null, 'ADMIN_CODE_SUCCESS', { ip: clientIp(req) }, true);
        res.setHeader('Set-Cookie', sessionCookieHeader(req, s.token, s.expiresAt));
        return json(res, 200, { success: true });
      }

      const admin = requireAuth(req);
      if (!hasPermission(admin, 'admin.view')) throw new ApiError('FORBIDDEN', 'Acesso restrito.', 403);

      if (pathname === '/api/admin/me' && method === 'GET') {
        return json(res, 200, { success: true, user: admin, permissions: PERMISSIONS[admin.role] || (admin.role === 'custom' ? JSON.parse(admin.customPermissions || '[]') : []), canAct: hasPermission(admin, 'users.view') && PERMISSIONS[admin.role]?.some(p => !VIEW_PERMS.includes(p) || p === 'roles.manage') });
      }

      const idemKey = req.headers['idempotency-key'];
      const mutate = (fn) => withIdempotency(req, idemKey, fn);

      if (pathname === '/api/admin/permissions' && method === 'GET') {
        requirePerm(req, 'admin.view');
        return json(res, 200, { success: true, permissions: getAvailablePermissions() });
      }

      if (pathname === '/api/admin/change-password' && method === 'POST') {
        const b = await readJsonBody(req);
        if (!b.currentPassword || !b.newPassword) throw new ApiError('INVALID_INPUT', 'Senha atual e nova senha obrigatórias.', 400);
        const row = db.prepare('SELECT password_hash FROM users WHERE id=?').get(admin.id);
        if (!row || !verifyPassword(b.currentPassword, row.password_hash)) {
          throw new ApiError('FORBIDDEN', 'Senha atual incorreta.', 403);
        }
        if (String(b.newPassword).length < 6) throw new ApiError('INVALID_PASSWORD', 'Nova senha deve ter no mínimo 6 caracteres.', 400);
        db.prepare('UPDATE users SET password_hash=?, updated_at=? WHERE id=?').run(hashPassword(b.newPassword), Date.now(), admin.id);
        return json(res, 200, { success: true });
      }

      if (pathname === '/api/admin/dashboard' && method === 'GET') {
        requirePerm(req, 'game.view');
        return json(res, 200, { success: true, stats: dashboardStats() });
      }

      // ---- criar usuario pelo admin ----
      if (pathname === '/api/admin/users' && method === 'POST') {
        requirePerm(req, 'users.create');
        const b = await readJsonBody(req);
        if (String(b.confirmPassword ?? '') !== String(b.password ?? '')) {
          throw new ApiError('INVALID_PASSWORD', 'Senhas não conferem.');
        }
        let role = b.role;
        if (role !== undefined && role !== null && role !== '') {
          if (!ROLES.includes(role)) throw new ApiError('INVALID_INPUT', 'Cargo inválido.', 400);
          if (ROLE_RANK[role] >= ROLE_RANK[admin.role] && admin.role !== 'king') {
            throw new ApiError('FORBIDDEN', 'Não é possível criar conta com cargo igual ou superior ao seu.', 403);
          }
        }
        const user = mutate(() => createUser({ username: b.username, password: b.password, displayName: b.displayName, role, customPermissions: b.customPermissions }));
        logAdminAction(admin.id, user.id, 'CREATE_USER',
          { username: user.username, role: user.role }, true);
        return json(res, 201, { success: true, user });
      }

      if (pathname === '/api/admin/items' && method === 'GET') {
        requirePerm(req, 'inventory.view');
        return json(res, 200, { success: true, items: [...getItemsCatalog().values()] });
      }

      if (pathname === '/api/admin/users' && method === 'GET') {
        requirePerm(req, 'users.view');
        const rows = searchUsers({
          q: query.get('q'), status: query.get('status'), role: query.get('role') || undefined,
          limit: intParam(query.get('limit'), 20), offset: intParam(query.get('offset'), 0)
        });
        return json(res, 200, { success: true, users: rows, total: countUsers() });
      }

      const userIdMatch = pathname.match(/^\/api\/admin\/users\/(\d+)(\/[a-z-]+)?$/);
      if (userIdMatch && method === 'POST') {
        const targetId = Number(userIdMatch[1]);
        const action = userIdMatch[2] || '';
        const actor = getUserById(admin.id);
        const reasonDefault = `por ${admin.username}`;
        switch (action) {
          case '/give-coins': {
            requirePerm(req, 'economy.give');
            const b = await readJsonBody(req);
            const r = mutate(() => giveCoins(actor, targetId, Math.trunc(Number(b.amount)), b.reason || reasonDefault));
            logAdminAction(actor.id, targetId, Number(b.amount) < 0 ? 'REMOVE_COINS' : 'GIVE_COINS',
              { ...r, reason: b.reason || reasonDefault }, true);
            return json(res, 200, { success: true, balance: r });
          }
          case '/set-coins': {
            requirePerm(req, 'economy.set');
            const b = await readJsonBody(req);
            const r = mutate(() => setCoins(actor, targetId, Math.trunc(Number(b.amount)), b.reason || reasonDefault));
            logAdminAction(actor.id, targetId, 'SET_COINS', { ...r, reason: b.reason || reasonDefault }, true);
            return json(res, 200, { success: true, balance: r });
          }
          case '/give-xp': {
            requirePerm(req, 'game.giveXp');
            const b = await readJsonBody(req);
            const r = mutate(() => giveXp(actor, targetId, Math.trunc(Number(b.amount)), b.reason || reasonDefault));
            return json(res, 200, { success: true, progress: r });
          }
          case '/set-xp': {
            requirePerm(req, 'game.giveXp');
            const b = await readJsonBody(req);
            const r = mutate(() => setXp(actor, targetId, Math.trunc(Number(b.amount)), b.reason || reasonDefault));
            return json(res, 200, { success: true, progress: r });
          }
          case '/set-level': {
            requirePerm(req, 'game.setLevel');
            const b = await readJsonBody(req);
            const r = mutate(() => setLevel(actor, targetId, Number(b.level), b.reason || reasonDefault));
            return json(res, 200, { success: true, level: r.level });
          }
          case '/level-up': {
            requirePerm(req, 'game.levelUp');
            const b = await readJsonBody(req);
            const r = mutate(() => levelUp(actor, targetId, Math.max(1, Math.trunc(Number(b.times) || 1)), b.reason));
            return json(res, 200, { success: true, level: r.level });
          }
          case '/max-stats': {
            requirePerm(req, 'game.maxStats');
            await readJsonBody(req);
            mutate(() => maxStats(actor, targetId, reasonDefault));
            return json(res, 200, { success: true });
          }
          case '/heal': {
            requirePerm(req, 'game.heal');
            await readJsonBody(req);
            mutate(() => heal(actor, targetId, reasonDefault));
            return json(res, 200, { success: true });
          }
          case '/give-item': {
            requirePerm(req, 'inventory.give');
            const b = await readJsonBody(req);
            mutate(() => addItemToInventory(actor, targetId, b.itemId, Number(b.quantity) || 1, b.reason));
            return json(res, 200, { success: true });
          }
          case '/remove-item': {
            requirePerm(req, 'inventory.remove');
            const b = await readJsonBody(req);
            const r = mutate(() => removeItemFromInventory(actor, targetId, b.itemId, Number(b.quantity) || 1, b.reason));
            return json(res, 200, { success: true, remaining: r.remaining });
          }
          case '/ban': {
            requirePerm(req, 'users.ban');
            const b = await readJsonBody(req);
            mutate(() => banUser(actor, targetId, b.reason || 'sem motivo'));
            return json(res, 200, { success: true });
          }
          case '/suspend': {
            requirePerm(req, 'users.suspend');
            const b = await readJsonBody(req);
            const days = Math.min(365, Math.max(1, Number(b.days) || 7));
            mutate(() => suspendUser(actor, targetId, b.reason || 'sem motivo', days * 86400000));
            return json(res, 200, { success: true });
          }
          case '/unban': {
            requirePerm(req, 'users.suspend');
            const b = await readJsonBody(req);
            mutate(() => unbanUser(actor, targetId, b.reason || 'readmitido'));
            return json(res, 200, { success: true });
          }
          case '/reset': {
            requirePerm(req, 'game.reset');
            const b = await readJsonBody(req);
            const scopes = Array.isArray(b.scopes) ? b.scopes : [];
            if (!scopes.length) throw new ApiError('INVALID_INPUT', 'Nenhum escopo de reset informado.', 400);
            const account = mutate(() => resetPlayer(actor, targetId, scopes, b.confirmUsername, b.reason || reasonDefault));
            return json(res, 200, { success: true, account });
          }
          case '/role': {
            requirePerm(req, 'roles.manage');
            const b = await readJsonBody(req);
            const u = mutate(() => changeRole(actor, targetId, String(b.role), b.reason, b.customPermissions));
            return json(res, 200, { success: true, user: u });
          }
          case '/password': {
            requirePerm(req, 'users.password');
            const b = await readJsonBody(req);
            const u = mutate(() => adminSetPassword(actor, targetId, b.newPassword));
            return json(res, 200, { success: true, user: u });
          }
          case '/kick': {
            // Kick = revogar todas as sessões do alvo (desconecta na hora).
            requirePerm(req, 'users.suspend');
            const b = await readJsonBody(req);
            const target = getUserById(targetId);
            if (!target) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
            if (target.id !== admin.id && ROLE_RANK[target.role] >= ROLE_RANK[admin.role] && admin.role !== 'king') {
              throw new ApiError('FORBIDDEN', 'Não é possível kickar alguém com cargo igual ou superior.', 403);
            }
            mutate(() => revokeTargetSessions(targetId));
            logAdminAction(admin.id, targetId, 'KICK', { reason: b.reason || `por ${admin.username}` }, true);
            return json(res, 200, { success: true });
          }
          default:
            throw new ApiError('INVALID_INPUT', 'Rota desconhecida.', 404);
        }
      }

      if (userIdMatch && method === 'GET') {
        requirePerm(req, 'users.view');
        const targetId = Number(userIdMatch[1]);
        if (!userIdMatch[2]) {
          const account = getFullAccount(targetId);
          if (!account) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
          return json(res, 200, { success: true, ...account });
        }
        if (userIdMatch[2] === '/transactions') {
          requirePerm(req, 'economy.view');
          return json(res, 200, {
            success: true,
            transactions: listTransactions(targetId, intParam(query.get('limit'), 20), intParam(query.get('offset'), 0))
          });
        }
      }

      if (pathname === '/api/admin/economy/give-all' && method === 'POST') {
        requirePerm(req, 'game.giveAll');
        const b = await readJsonBody(req);
        if (!b.confirmed) throw new ApiError('INVALID_INPUT', 'Requer confirmação explícita.', 400);
        const amount = Math.trunc(Number(b.amount));
        const currency = b.currency === 'tokens' ? 'tokens' : 'coins';
        const reason = b.reason || `give-all por ${admin.username}`;
        const actor = getUserById(admin.id);
        const targets = [];
        for (let offset = 0; offset < 100000; offset += 100) {
          const page = searchUsers({ status: 'active', limit: 100, offset });
          targets.push(...page.filter(u => u.role !== 'king' && u.role !== 'co_king' && u.role !== 'head_admin' && u.role !== 'admin' && u.role !== 'developer' && u.role !== 'best_capybara'));
          if (page.length < 100) break;
        }
        const applyOne = currency === 'tokens'
          ? (u) => giveTokens(actor, u.id, amount, `[GIVE ALL] ${reason}`)
          : (u) => giveCoins(actor, u.id, amount, `[GIVE ALL] ${reason}`);
        const results = targets.map(u => { try { applyOne(u); return true; } catch { return false; } });
        const affected = results.filter(Boolean).length;
        logAdminAction(admin.id, null, 'GIVE_ALL',
          { currency, amountPerPlayer: amount, playersAffected: affected, reason }, true);
        return json(res, 200, { success: true, affected, amountPerPlayer: amount, currency });
      }

      if (pathname === '/api/admin/logs' && method === 'GET') {
        requirePerm(req, 'admin.logs');
        const successRaw = query.get('success');
        const logs = listLogs({
          actorId: intParam(query.get('actorId'), undefined),
          targetUserId: intParam(query.get('targetUserId'), undefined),
          action: query.get('action') || undefined,
          from: intParam(query.get('from'), undefined),
          to: intParam(query.get('to'), undefined),
          success: (successRaw === null || successRaw === '') ? undefined : successRaw === 'true',
          limit: intParam(query.get('limit'), 20),
          offset: intParam(query.get('offset'), 0)
        });
        return json(res, 200, { success: true, logs });
      }

      // ---- admin chat ----
      if (pathname === '/api/admin/admin-chat' && method === 'GET') {
        requirePerm(req, 'admin.view');
        const limit = Math.min(intParam(query.get('limit'), 50), 200);
        const offset = intParam(query.get('offset'), 0);
        const msgs = adminChatMessages.slice(-(offset + limit), offset || undefined);
        return json(res, 200, { success: true, messages: msgs });
      }

      if (pathname === '/api/admin/admin-chat' && method === 'POST') {
        requirePerm(req, 'admin.view');
        const b = await readJsonBody(req);
        const text = String(b.text || '').trim();
        if (!text) throw new ApiError('INVALID_INPUT', 'Mensagem vazia.', 400);
        if (text.length > 1000) throw new ApiError('INVALID_INPUT', 'Mensagem muito longa (máx. 1000 caracteres).', 400);
        const msg = { id: adminChatMessages.length + 1, from: admin.username, role: admin.role, text, ts: Date.now() };
        adminChatMessages.push(msg);
        if (adminChatMessages.length > ADMIN_CHAT_MAX) adminChatMessages.splice(0, adminChatMessages.length - ADMIN_CHAT_MAX);
        return json(res, 201, { success: true, message: msg });
      }

      if (pathname === '/api/admin/messages' && method === 'GET') {
        requirePerm(req, 'messages.global');
        return json(res, 200, {
          success: true,
          messages: listGlobalMessages({
            kind: query.get('kind') || undefined,
            activeOnly: query.get('active') === '1',
            limit: intParam(query.get('limit'), 50),
            offset: intParam(query.get('offset'), 0)
          }),
          motd: getActiveMotd()
        });
      }

      if (pathname === '/api/admin/messages' && method === 'POST') {
        requirePerm(req, 'messages.global');
        const b = await readJsonBody(req);
        const kind = String(b.kind || b.type || 'announce');
        const dur = parseDurationInput(b);
        const msg = mutate(() => createGlobalMessage({
          kind,
          body: b.body ?? b.message ?? b.text,
          actorId: admin.id,
          durationSeconds: dur.durationSeconds !== undefined ? dur.durationSeconds : undefined,
          expiresAt: dur.expiresAt !== undefined ? dur.expiresAt : undefined,
          active: b.active !== false
        }));
        logAdminAction(admin.id, null, kind === 'motd' ? 'SET_MOTD' : 'GLOBAL_MESSAGE', {
          id: msg.id, kind: msg.kind, body: msg.body,
          durationSeconds: msg.durationSeconds, expiresAt: msg.expiresAt
        }, true);
        emitGlobalMessageEvent('global_message_created', msg);
        return json(res, 201, { success: true, message: msg });
      }

      const msgIdMatch = pathname.match(/^\/api\/admin\/messages\/(\d+)(\/[a-z-]+)?$/);
      if (msgIdMatch && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
        requirePerm(req, 'messages.global');
        const id = Number(msgIdMatch[1]);
        const sub = msgIdMatch[2] || '';

        if (method === 'DELETE' || sub === '/delete') {
          const msg = deleteGlobalMessage(id);
          logAdminAction(admin.id, null, 'DELETE_MESSAGE', { id: msg.id, kind: msg.kind }, true);
          emitGlobalMessageEvent('global_message_disabled', msg);
          return json(res, 200, { success: true, message: msg });
        }

        if (sub === '/disable' || method === 'POST' || method === 'PATCH') {
          const b = method === 'DELETE' ? {} : await readJsonBody(req);
          const action = b.action || (sub === '/disable' ? 'deactivate' : b.action);

          if (action === 'deactivate' || action === 'disable' || b.deactivate || sub === '/disable') {
            const msg = deactivateGlobalMessage(id, { actorId: admin.id });
            logAdminAction(admin.id, null, 'DEACTIVATE_MESSAGE', { id: msg.id, kind: msg.kind }, true);
            emitGlobalMessageEvent('global_message_disabled', msg);
            return json(res, 200, { success: true, message: msg });
          }

          if (action === 'reactivate' || action === 'enable') {
            const dur = parseDurationInput(b);
            if (dur.durationSeconds === undefined && dur.expiresAt === undefined
                && b.untilDisabled !== true && b.duration !== 'manual') {
              throw new ApiError('INVALID_INPUT', 'Informe uma nova duração ao reativar.', 400);
            }
            const msg = reactivateGlobalMessage(id, {
              actorId: admin.id,
              durationSeconds: dur.durationSeconds !== undefined ? dur.durationSeconds : null,
              expiresAt: dur.expiresAt
            });
            logAdminAction(admin.id, null, 'REACTIVATE_MESSAGE', {
              id: msg.id, kind: msg.kind, durationSeconds: msg.durationSeconds, expiresAt: msg.expiresAt
            }, true);
            emitGlobalMessageEvent('global_message_created', msg);
            return json(res, 200, { success: true, message: msg });
          }

          if (action === 'update' || method === 'PATCH' || (!action && (b.body || b.message || b.durationSeconds !== undefined))) {
            const dur = parseDurationInput(b);
            const msg = updateGlobalMessage(id, {
              body: b.body ?? b.message ?? b.text,
              durationSeconds: dur.durationSeconds,
              expiresAt: dur.expiresAt,
              actorId: admin.id
            });
            logAdminAction(admin.id, null, 'UPDATE_MESSAGE', { id: msg.id, kind: msg.kind }, true);
            emitGlobalMessageEvent('global_message_updated', msg);
            return json(res, 200, { success: true, message: msg });
          }

          if (!action) {
            throw new ApiError('INVALID_INPUT', 'Ação de mensagem desconhecida.', 400);
          }
        }

        throw new ApiError('INVALID_INPUT', 'Ação de mensagem desconhecida.', 400);
      }

      if (pathname === '/api/admin/portal/news' && method === 'GET') {
        requirePerm(req, 'portal.news');
        return json(res, 200, {
          success: true,
          news: listPortalNews({
            publishedOnly: false,
            limit: intParam(query.get('limit'), 50),
            offset: intParam(query.get('offset'), 0)
          })
        });
      }

      if (pathname === '/api/admin/portal/news' && method === 'POST') {
        requirePerm(req, 'portal.news');
        const b = await readJsonBody(req);
        const item = mutate(() => createPortalNews({
          title: b.title, summary: b.summary, body: b.body, slug: b.slug,
          published: !!b.published, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_NEWS_CREATE', { id: item.id, slug: item.slug }, true);
        return json(res, 201, { success: true, news: item });
      }

      const newsIdMatch = pathname.match(/^\/api\/admin\/portal\/news\/(\d+)(\/[a-z-]+)?$/);
      if (newsIdMatch && method === 'POST') {
        requirePerm(req, 'portal.news');
        const id = Number(newsIdMatch[1]);
        const action = newsIdMatch[2] || '';
        if (action === '/delete') {
          const item = deletePortalNews(id);
          logAdminAction(admin.id, null, 'PORTAL_NEWS_DELETE', { id: item.id, slug: item.slug }, true);
          return json(res, 200, { success: true, news: item });
        }
        const b = await readJsonBody(req);
        const item = mutate(() => updatePortalNews(id, {
          title: b.title, summary: b.summary, body: b.body, slug: b.slug,
          published: b.published, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_NEWS_UPDATE', { id: item.id, slug: item.slug }, true);
        return json(res, 200, { success: true, news: item });
      }

      if (pathname === '/api/admin/portal/wiki' && method === 'GET') {
        requirePerm(req, 'portal.wiki');
        return json(res, 200, {
          success: true,
          articles: listPortalWiki({
            gameId: query.get('gameId') || undefined,
            publishedOnly: false,
            limit: intParam(query.get('limit'), 100),
            offset: intParam(query.get('offset'), 0)
          })
        });
      }

      if (pathname === '/api/admin/portal/wiki' && method === 'POST') {
        requirePerm(req, 'portal.wiki');
        const b = await readJsonBody(req);
        const item = mutate(() => createPortalWiki({
          gameId: b.gameId, slug: b.slug, title: b.title, description: b.description,
          bodyMd: b.bodyMd ?? b.body, published: !!b.published, sortOrder: b.sortOrder, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_WIKI_CREATE', { id: item.id, gameId: item.gameId, slug: item.slug }, true);
        return json(res, 201, { success: true, article: item });
      }

      const wikiIdMatch = pathname.match(/^\/api\/admin\/portal\/wiki\/(\d+)(\/[a-z-]+)?$/);
      if (wikiIdMatch && method === 'POST') {
        requirePerm(req, 'portal.wiki');
        const id = Number(wikiIdMatch[1]);
        const action = wikiIdMatch[2] || '';
        if (action === '/delete') {
          const item = deletePortalWiki(id);
          logAdminAction(admin.id, null, 'PORTAL_WIKI_DELETE', { id: item.id, slug: item.slug }, true);
          return json(res, 200, { success: true, article: item });
        }
        const b = await readJsonBody(req);
        const item = mutate(() => updatePortalWiki(id, {
          gameId: b.gameId, slug: b.slug, title: b.title, description: b.description,
          bodyMd: b.bodyMd ?? b.body, published: b.published, sortOrder: b.sortOrder, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_WIKI_UPDATE', { id: item.id, slug: item.slug }, true);
        return json(res, 200, { success: true, article: item });
      }

      if (pathname === '/api/admin/portal/achievements' && method === 'GET') {
        requirePerm(req, 'portal.achievements');
        return json(res, 200, {
          success: true,
          achievements: listPortalAchievements({
            gameId: query.get('gameId') || undefined,
            publishedOnly: false,
            limit: intParam(query.get('limit'), 200),
            offset: intParam(query.get('offset'), 0)
          })
        });
      }

      if (pathname === '/api/admin/portal/achievements' && method === 'POST') {
        requirePerm(req, 'portal.achievements');
        const b = await readJsonBody(req);
        const item = mutate(() => createPortalAchievement({
          key: b.key, gameId: b.gameId, name: b.name, description: b.description,
          legacyTier: b.legacyTier, secret: !!b.secret, published: b.published !== false,
          sortOrder: b.sortOrder, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_ACH_CREATE', { id: item.id, key: item.key }, true);
        return json(res, 201, { success: true, achievement: item });
      }

      const achIdMatch = pathname.match(/^\/api\/admin\/portal\/achievements\/(\d+)(\/[a-z-]+)?$/);
      if (achIdMatch && method === 'POST') {
        requirePerm(req, 'portal.achievements');
        const id = Number(achIdMatch[1]);
        const action = achIdMatch[2] || '';
        if (action === '/delete') {
          const item = deletePortalAchievement(id);
          logAdminAction(admin.id, null, 'PORTAL_ACH_DELETE', { id: item.id, key: item.key }, true);
          return json(res, 200, { success: true, achievement: item });
        }
        const b = await readJsonBody(req);
        const item = mutate(() => updatePortalAchievement(id, {
          key: b.key, gameId: b.gameId, name: b.name, description: b.description,
          legacyTier: b.legacyTier, secret: b.secret, published: b.published,
          sortOrder: b.sortOrder, actorId: admin.id
        }));
        logAdminAction(admin.id, null, 'PORTAL_ACH_UPDATE', { id: item.id, key: item.key }, true);
        return json(res, 200, { success: true, achievement: item });
      }

      throw new ApiError('INVALID_INPUT', 'Rota administrativa desconhecida.', 404);
    }

    throw new ApiError('INVALID_INPUT', 'Rota desconhecida.', 404);
  } catch (err) {
    if (err instanceof ApiError) {
      return json(res, err.httpStatus, {
        success: false,
        error: { code: err.code, message: err.message }
      });
    }
    console.error('[api] erro interno:', err);
    return json(res, 500, {
      success: false,
      error: { code: 'OPERATION_FAILED', message: 'Erro interno.' }
    });
  }
}

function timingSafeEq(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(data));
}

function rateLimited(res, ms = 0) {
  res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': String(Math.ceil(ms / 1000) || 30) });
  res.end(JSON.stringify({ success: false, error: { code: 'RATE_LIMITED', message: 'Muitas tentativas. Aguarde.' } }));
}

export function isAdminRole(role) {
  return ADMIN_VIEW_ROLES.includes(role);
}

export { ROLE_RANK, ROLES as GAME_ROLES };
