/**
 * Central Server Registry for Portal Capy multiplayer.
 * Single source of truth for create / discover / join / leave / close
 * across capyquake, capyrails, capyzen, find-the-markers.
 *
 * Live sessions are in-memory (same process as WS). Join tokens are short-lived.
 * Heartbeat sweeps zombie servers. No fake listings.
 */

import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { hit } from './ratelimit.js';
import { ApiError } from './validation.js';
import { logAdminAction } from './services.js';

/** @typedef {'capyquake'|'capyrails'|'capyzen'|'find-the-markers'} GameId */
/** @typedef {'public'|'private'} Visibility */
/** @typedef {'waiting'|'playing'|'full'|'closing'|'closed'} ServerStatus */

/**
 * @typedef {{
 *   id: string,
 *   gameId: GameId,
 *   name: string,
 *   hostUserId: number,
 *   hostUsername: string,
 *   hostDisplayName: string,
 *   visibility: Visibility,
 *   inviteCode: string|null,
 *   status: ServerStatus,
 *   playerCount: number,
 *   maxPlayers: number,
 *   createdAt: number,
 *   updatedAt: number,
 *   lastHeartbeatAt: number,
 *   closedAt: number|null,
 *   runtimeKey: string|null,
 *   meta: Record<string, unknown>
 * }} GameServer
 */

/**
 * @typedef {{
 *   serverId: string,
 *   userId: number,
 *   username: string,
 *   displayName: string,
 *   joinedAt: number,
 *   sessionId: string,
 *   state: 'joined'|'playing'|'left'
 * }} ServerPlayer
 */

export const GAME_IDS = Object.freeze([
  'capyquake',
  'capyrails',
  'capyzen',
  'find-the-markers',
]);

/** Per-game capacity — inspect-driven, not arbitrary. */
export const GAME_CAPACITY = Object.freeze({
  capyquake: Object.freeze({ defaultMaxPlayers: 6, maximumAllowedPlayers: 6 }),
  capyrails: Object.freeze({ defaultMaxPlayers: 4, maximumAllowedPlayers: 8 }),
  capyzen: Object.freeze({ defaultMaxPlayers: 4, maximumAllowedPlayers: 8 }),
  'find-the-markers': Object.freeze({ defaultMaxPlayers: 8, maximumAllowedPlayers: 8 }),
});

export const GAME_LABELS = Object.freeze({
  capyquake: 'Capyquake',
  capyrails: 'Capyrails',
  capyzen: 'Capyzen',
  'find-the-markers': 'Find the Markers',
});

export const GAME_SYMBOLS = Object.freeze({
  capyquake: '🔫',
  capyrails: '🚂',
  capyzen: '🦫',
  'find-the-markers': '🎯',
});

export const GAME_PLAY_HREF = Object.freeze({
  capyquake: '/capyquake/',
  capyrails: '/capyrails/',
  capyzen: '/capyzen/',
  'find-the-markers': '/find-the-markers/',
});

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_PREFIX = 'CAPY-';
const HEARTBEAT_STALE_MS = 45_000;
const EMPTY_GRACE_MS = 30_000;
const JOIN_TOKEN_TTL_MS = 60_000;
const SWEEP_INTERVAL_MS = 5_000;

/** @type {Map<string, GameServer>} */
const servers = new Map();
/** @type {Map<string, Map<number, ServerPlayer>>} serverId -> userId -> player */
const playersByServer = new Map();
/** @type {Map<string, string>} inviteCodeUpper -> serverId */
const inviteIndex = new Map();
/** @type {Map<string, { serverId: string, userId: number, expiresAt: number, used: boolean }>} */
const joinTokens = new Map();
/** @type {Map<number, string>} userId -> serverId (at most one active membership) */
const userServerIndex = new Map();
/** @type {Set<(event: string, payload: object) => void>} */
const listeners = new Set();

let sweepTimer = null;

function now() {
  return Date.now();
}

function newId(prefix = 'srv') {
  return `${prefix}_${randomBytes(8).toString('hex')}`;
}

function newSessionId() {
  return `ses_${randomBytes(12).toString('hex')}`;
}

/**
 * Generate CAPY-XXXX style invite (no ambiguous chars).
 * @returns {string}
 */
export function generateInviteCode() {
  let code;
  do {
    let body = '';
    for (let i = 0; i < 4; i++) body += CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0];
    code = INVITE_PREFIX + body;
  } while (inviteIndex.has(code));
  return code;
}

/**
 * Normalize invite / lobby codes for lookup (case-insensitive, strip spaces).
 * Accepts CAPY-7K2F, capy7k2f, 7K2F (4-char legacy).
 * @param {string} raw
 * @returns {string}
 */
export function normalizeInviteCode(raw) {
  const s = String(raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!s) return '';
  if (s.startsWith('CAPY') && s.length >= 8) return `CAPY-${s.slice(4, 8)}`;
  if (s.length === 4) return s; // legacy Capyquake lobby code
  if (s.startsWith('CAPY')) return `CAPY-${s.slice(4)}`;
  return s;
}

/**
 * @param {GameId} gameId
 * @param {number} [requested]
 */
export function resolveMaxPlayers(gameId, requested) {
  const cap = GAME_CAPACITY[gameId];
  if (!cap) throw new ApiError('INVALID_GAME', 'Jogo inválido.', 400);
  if (requested == null || requested === '') return cap.defaultMaxPlayers;
  const n = Number(requested);
  if (!Number.isSafeInteger(n)) throw new ApiError('INVALID_INPUT', 'Máximo de jogadores inválido.', 400);
  if (n < 2) throw new ApiError('INVALID_INPUT', 'Mínimo de 2 jogadores.', 400);
  if (n > cap.maximumAllowedPlayers) {
    throw new ApiError(
      'INVALID_INPUT',
      `Máximo permitido para ${GAME_LABELS[gameId]} é ${cap.maximumAllowedPlayers}.`,
      400,
    );
  }
  return n;
}

/**
 * @param {string} gameId
 * @returns {asserts gameId is GameId}
 */
export function assertGameId(gameId) {
  if (!GAME_IDS.includes(/** @type {GameId} */ (gameId))) {
    throw new ApiError('INVALID_GAME', 'Jogo inválido.', 400);
  }
}

function emit(event, payload) {
  for (const fn of listeners) {
    try {
      fn(event, payload);
    } catch (err) {
      console.error('[servers-registry] listener error:', err);
    }
  }
}

/**
 * Subscribe to registry events (server_created/updated/closed, player_*).
 * @param {(event: string, payload: object) => void} fn
 * @returns {() => void}
 */
export function onServerEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function deriveStatus(server) {
  if (server.status === 'closed' || server.status === 'closing') return server.status;
  if (server.playerCount >= server.maxPlayers) return 'full';
  if (server.status === 'playing') return 'playing';
  return 'waiting';
}

/**
 * Public-safe card payload — never includes inviteCode for private.
 * @param {GameServer} server
 * @param {{ includeInvite?: boolean, viewerUserId?: number|null }} [opts]
 */
export function toPublicServer(server, opts = {}) {
  const includeInvite =
    !!opts.includeInvite &&
    (server.visibility === 'public' ||
      (opts.viewerUserId != null && Number(opts.viewerUserId) === server.hostUserId));

  return {
    id: server.id,
    gameId: server.gameId,
    gameName: GAME_LABELS[server.gameId] || server.gameId,
    gameSymbol: GAME_SYMBOLS[server.gameId] || '🎮',
    name: server.name,
    hostUserId: server.hostUserId,
    hostUsername: server.hostUsername,
    hostDisplayName: server.hostDisplayName || server.hostUsername,
    visibility: server.visibility,
    inviteCode: includeInvite ? server.inviteCode : null,
    status: server.status,
    playerCount: server.playerCount,
    maxPlayers: server.maxPlayers,
    hasSlots: server.playerCount < server.maxPlayers && isJoinableStatus(server.status),
    createdAt: server.createdAt,
    updatedAt: server.updatedAt,
    lastHeartbeatAt: server.lastHeartbeatAt,
    playHref: GAME_PLAY_HREF[server.gameId] || null,
  };
}

function isJoinableStatus(status) {
  return status === 'waiting' || status === 'playing' || status === 'full';
}

/**
 * @param {{
 *   gameId: GameId,
 *   name: string,
 *   hostUserId: number,
 *   hostUsername: string,
 *   hostDisplayName?: string,
 *   visibility?: Visibility,
 *   maxPlayers?: number,
 *   runtimeKey?: string|null,
 *   meta?: Record<string, unknown>
 * }} input
 * @returns {{ server: GameServer, public: ReturnType<typeof toPublicServer>, inviteCode: string|null }}
 */
export function createServer(input) {
  assertGameId(input.gameId);
  const name = String(input.name || '').trim().slice(0, 48);
  if (!name) throw new ApiError('INVALID_INPUT', 'Nome do servidor obrigatório.', 400);
  if (!input.hostUserId) throw new ApiError('UNAUTHORIZED', 'Sessão necessária.', 401);

  // One hosted open server per user per game (avoid spam)
  for (const s of servers.values()) {
    if (
      s.hostUserId === input.hostUserId &&
      s.gameId === input.gameId &&
      s.status !== 'closed' &&
      s.status !== 'closing'
    ) {
      throw new ApiError(
        'ALREADY_HOSTING',
        'Você já hospeda um servidor deste jogo. Encerre-o antes de criar outro.',
        409,
      );
    }
  }

  const visibility = input.visibility === 'private' ? 'private' : 'public';
  const maxPlayers = resolveMaxPlayers(input.gameId, input.maxPlayers);
  const t = now();
  const id = newId('srv');
  const inviteCode = visibility === 'private' ? generateInviteCode() : generateInviteCode();
  // Always generate code (needed for Capyquake legacy + private join); public can still share.

  /** @type {GameServer} */
  const server = {
    id,
    gameId: input.gameId,
    name,
    hostUserId: Number(input.hostUserId),
    hostUsername: String(input.hostUsername || '').slice(0, 32),
    hostDisplayName: String(input.hostDisplayName || input.hostUsername || '').slice(0, 48),
    visibility,
    inviteCode,
    status: 'waiting',
    playerCount: 0,
    maxPlayers,
    createdAt: t,
    updatedAt: t,
    lastHeartbeatAt: t,
    closedAt: null,
    runtimeKey: input.runtimeKey || null,
    meta: input.meta && typeof input.meta === 'object' ? { ...input.meta } : {},
  };

  servers.set(id, server);
  playersByServer.set(id, new Map());
  if (inviteCode) inviteIndex.set(normalizeInviteCode(inviteCode), id);

  // Host auto-joins as first player
  const hostPlayer = joinServerInternal(server, {
    userId: server.hostUserId,
    username: server.hostUsername,
    displayName: server.hostDisplayName,
  }, { force: true });

  const hostToken = issueJoinToken(server.id, server.hostUserId);
  const pub = toPublicServer(server, {
    includeInvite: visibility === 'private',
    viewerUserId: server.hostUserId,
  });
  pub.playHref = buildPlayHref(server, hostToken.token, { asHost: true });

  emit('server_created', { server: pub });
  try {
    logAdminAction(server.hostUserId, null, 'SERVER_CREATED', {
      serverId: id,
      gameId: server.gameId,
      visibility,
      name,
    });
  } catch {
    /* non-fatal */
  }

  return {
    server,
    public: pub,
    inviteCode: visibility === 'private' ? inviteCode : null,
    hostSessionId: hostPlayer.sessionId,
    joinToken: hostToken.token,
    expiresAt: hostToken.expiresAt,
    playHref: pub.playHref,
  };
}

/**
 * Register an already-running game runtime (e.g. Capyquake WS room) into the registry.
 * @param {{
 *   gameId: GameId,
 *   name: string,
 *   hostUserId: number,
 *   hostUsername: string,
 *   hostDisplayName?: string,
 *   visibility?: Visibility,
 *   maxPlayers?: number,
 *   runtimeKey: string,
 *   inviteCode?: string|null,
 *   playerCount?: number,
 *   status?: ServerStatus
 * }} input
 */
export function registerRuntimeServer(input) {
  assertGameId(input.gameId);
  if (!input.runtimeKey) throw new ApiError('INVALID_INPUT', 'runtimeKey obrigatório.', 400);

  // Upsert by runtimeKey
  for (const s of servers.values()) {
    if (s.runtimeKey === input.runtimeKey && s.status !== 'closed') {
      s.name = String(input.name || s.name).slice(0, 48);
      s.playerCount = Math.max(0, Number(input.playerCount ?? s.playerCount) || 0);
      if (input.status) s.status = input.status;
      s.lastHeartbeatAt = now();
      s.updatedAt = now();
      s.status = deriveStatus(s);
      const pub = toPublicServer(s);
      emit('server_updated', { server: pub });
      return { server: s, public: pub, created: false };
    }
  }

  const visibility = input.visibility === 'private' ? 'private' : 'public';
  const maxPlayers = resolveMaxPlayers(input.gameId, input.maxPlayers);
  const t = now();
  const id = newId('srv');
  let inviteCode = input.inviteCode ? normalizeInviteCode(input.inviteCode) : null;
  if (!inviteCode) inviteCode = generateInviteCode();
  // Store 4-char codes as-is for Capyquake legacy
  if (inviteCode.length === 4) {
    /* keep */
  } else if (!inviteCode.startsWith('CAPY-')) {
    inviteCode = generateInviteCode();
  }

  /** @type {GameServer} */
  const server = {
    id,
    gameId: input.gameId,
    name: String(input.name || 'Sala').slice(0, 48),
    hostUserId: Number(input.hostUserId) || 0,
    hostUsername: String(input.hostUsername || 'host').slice(0, 32),
    hostDisplayName: String(input.hostDisplayName || input.hostUsername || 'host').slice(0, 48),
    visibility,
    inviteCode,
    status: input.status || 'waiting',
    playerCount: Math.max(0, Number(input.playerCount) || 0),
    maxPlayers,
    createdAt: t,
    updatedAt: t,
    lastHeartbeatAt: t,
    closedAt: null,
    runtimeKey: String(input.runtimeKey),
    meta: {},
  };

  servers.set(id, server);
  playersByServer.set(id, new Map());
  inviteIndex.set(normalizeInviteCode(inviteCode), id);

  const pub = toPublicServer(server);
  emit('server_created', { server: pub });
  return { server, public: pub, created: true };
}

/**
 * @param {string} serverId
 */
export function getServer(serverId) {
  return servers.get(String(serverId)) || null;
}

/**
 * @param {string} code
 */
export function findByInviteCode(code) {
  const norm = normalizeInviteCode(code);
  if (!norm) return null;
  const id = inviteIndex.get(norm);
  if (!id) {
    // Also try raw 4-char against all invite codes / runtime keys
    for (const s of servers.values()) {
      if (s.status === 'closed') continue;
      if (normalizeInviteCode(s.inviteCode || '') === norm) return s;
      if (s.runtimeKey && String(s.runtimeKey).toUpperCase() === norm) return s;
    }
    return null;
  }
  return servers.get(id) || null;
}

/**
 * @param {string} runtimeKey
 */
export function findByRuntimeKey(runtimeKey) {
  const key = String(runtimeKey || '');
  if (!key) return null;
  for (const s of servers.values()) {
    if (s.runtimeKey === key && s.status !== 'closed') return s;
  }
  return null;
}

/**
 * List servers for portal browser. Never returns private without ownership filter.
 * @param {{
 *   gameId?: string,
 *   visibility?: 'public'|'private'|'all',
 *   hasSlots?: boolean,
 *   hostUserId?: number,
 *   mineUserId?: number,
 *   status?: string,
 *   q?: string,
 *   includeClosed?: boolean,
 *   limit?: number
 * }} [filters]
 */
export function listServers(filters = {}) {
  const limit = Math.min(Math.max(Number(filters.limit) || 100, 1), 200);
  const q = String(filters.q || '').trim().toLowerCase();
  /** @type {GameServer[]} */
  const out = [];

  for (const s of servers.values()) {
    if (!filters.includeClosed && (s.status === 'closed' || s.status === 'closing')) continue;

    if (filters.gameId && s.gameId !== filters.gameId) continue;

    if (filters.hostUserId != null && s.hostUserId !== Number(filters.hostUserId)) continue;

    if (filters.mineUserId != null) {
      const uid = Number(filters.mineUserId);
      const inServer = playersByServer.get(s.id)?.has(uid);
      if (s.hostUserId !== uid && !inServer) continue;
    }

    // Privacy: public list never shows private
    if (filters.visibility === 'public' || filters.visibility == null) {
      if (filters.mineUserId == null && s.visibility === 'private') continue;
      if (filters.visibility === 'public' && s.visibility !== 'public') continue;
    } else if (filters.visibility === 'private') {
      if (s.visibility !== 'private') continue;
      // private list only for mine filter
      if (filters.mineUserId == null && filters.hostUserId == null) continue;
    }

    if (filters.hasSlots && !(s.playerCount < s.maxPlayers && isJoinableStatus(s.status))) continue;

    if (filters.status && s.status !== filters.status) continue;

    if (q) {
      const hay = `${s.name} ${s.hostUsername} ${s.hostDisplayName} ${s.gameId}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }

    out.push(s);
  }

  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out.slice(0, limit).map((s) =>
    toPublicServer(s, {
      includeInvite: false,
      viewerUserId: filters.mineUserId ?? filters.hostUserId ?? null,
    }),
  );
}

/**
 * Admin full list (includes private codes for authorized staff).
 */
export function listServersAdmin(filters = {}) {
  const limit = Math.min(Math.max(Number(filters.limit) || 200, 1), 500);
  /** @type {object[]} */
  const out = [];
  for (const s of servers.values()) {
    if (!filters.includeClosed && s.status === 'closed') continue;
    if (filters.gameId && s.gameId !== filters.gameId) continue;
    out.push({
      ...toPublicServer(s, { includeInvite: true, viewerUserId: s.hostUserId }),
      inviteCode: s.inviteCode,
      runtimeKey: s.runtimeKey,
      closedAt: s.closedAt,
      playerIds: [...(playersByServer.get(s.id)?.keys() || [])],
    });
  }
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out.slice(0, limit);
}

/**
 * @param {GameServer} server
 * @param {{ userId: number, username: string, displayName?: string }} user
 * @param {{ force?: boolean }} [opts]
 * @returns {ServerPlayer}
 */
function joinServerInternal(server, user, opts = {}) {
  if (!opts.force) {
    if (server.status === 'closed' || server.status === 'closing') {
      throw new ApiError('SERVER_CLOSED', 'Servidor encerrado.', 410);
    }
    if (server.playerCount >= server.maxPlayers) {
      // Allow reconnect of same user
      const existing = playersByServer.get(server.id)?.get(Number(user.userId));
      if (!existing || existing.state === 'left') {
        throw new ApiError('SERVER_FULL', 'Servidor lotado.', 409);
      }
    }
  }

  const uid = Number(user.userId);
  const map = playersByServer.get(server.id) || new Map();
  playersByServer.set(server.id, map);

  // Leave other server if any
  const prevServerId = userServerIndex.get(uid);
  if (prevServerId && prevServerId !== server.id) {
    try {
      leaveServer(prevServerId, uid, { silent: true });
    } catch {
      /* ignore */
    }
  }

  const existing = map.get(uid);
  if (existing && existing.state !== 'left') {
    // Reconnect — keep same sessionId, no double count
    existing.state = 'joined';
    server.lastHeartbeatAt = now();
    server.updatedAt = now();
    userServerIndex.set(uid, server.id);
    touchHeartbeat(server.id);
    const pub = toPublicServer(server);
    emit('server_updated', { server: pub });
    emit('player_rejoined', { serverId: server.id, userId: uid, sessionId: existing.sessionId });
    return existing;
  }

  if (!opts.force && map.size >= server.maxPlayers) {
    throw new ApiError('SERVER_FULL', 'Servidor lotado.', 409);
  }

  /** @type {ServerPlayer} */
  const player = {
    serverId: server.id,
    userId: uid,
    username: String(user.username || '').slice(0, 32),
    displayName: String(user.displayName || user.username || '').slice(0, 48),
    joinedAt: now(),
    sessionId: newSessionId(),
    state: 'joined',
  };
  map.set(uid, player);
  userServerIndex.set(uid, server.id);
  server.playerCount = countActivePlayers(server.id);
  server.status = deriveStatus(server);
  server.updatedAt = now();
  server.lastHeartbeatAt = now();

  const pub = toPublicServer(server);
  emit('server_updated', { server: pub });
  emit('player_joined', {
    serverId: server.id,
    userId: uid,
    username: player.username,
    displayName: player.displayName,
    playerCount: server.playerCount,
  });
  return player;
}

function countActivePlayers(serverId) {
  const map = playersByServer.get(serverId);
  if (!map) return 0;
  let n = 0;
  for (const p of map.values()) {
    if (p.state !== 'left') n++;
  }
  return n;
}

/**
 * Authorized join (public or already authorized). Race-safe last slot.
 * @param {string} serverId
 * @param {{ userId: number, username: string, displayName?: string }} user
 * @param {{ inviteCode?: string|null, joinToken?: string|null }} [auth]
 */
export function joinServer(serverId, user, auth = {}) {
  const server = getServer(serverId);
  if (!server || server.status === 'closed') {
    throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
  }

  if (server.visibility === 'private') {
    const tokenOk = auth.joinToken && consumeJoinToken(auth.joinToken, user.userId, serverId);
    const codeOk =
      auth.inviteCode &&
      normalizeInviteCode(auth.inviteCode) === normalizeInviteCode(server.inviteCode || '');
    const isHost = Number(user.userId) === server.hostUserId;
    const already = playersByServer.get(server.id)?.get(Number(user.userId));
    if (!tokenOk && !codeOk && !isHost && !(already && already.state !== 'left')) {
      throw new ApiError('FORBIDDEN', 'Você não possui acesso a este servidor privado.', 403);
    }
  }

  if (server.status === 'closing') {
    throw new ApiError('SERVER_CLOSED', 'Servidor encerrado.', 410);
  }

  const player = joinServerInternal(server, user);
  const token = issueJoinToken(server.id, user.userId);
  return {
    server: toPublicServer(server, {
      includeInvite: server.hostUserId === user.userId,
      viewerUserId: user.userId,
    }),
    player,
    joinToken: token.token,
    expiresAt: token.expiresAt,
    gameId: server.gameId,
    playHref: buildPlayHref(server, token.token),
  };
}

/**
 * Join by invite / lobby code.
 */
export function joinByCode(code, user) {
  const server = findByInviteCode(code);
  if (!server || server.status === 'closed') {
    throw new ApiError('NOT_FOUND', 'Código inválido ou servidor não encontrado.', 404);
  }
  return joinServer(server.id, user, { inviteCode: code });
}

/**
 * @param {string} serverId
 * @param {number} userId
 * @param {{ silent?: boolean, promoteHost?: boolean }} [opts]
 */
export function leaveServer(serverId, userId, opts = {}) {
  const server = getServer(serverId);
  if (!server) return null;
  const map = playersByServer.get(serverId);
  if (!map) return null;
  const uid = Number(userId);
  const player = map.get(uid);
  if (!player) return null;

  player.state = 'left';
  map.delete(uid);
  if (userServerIndex.get(uid) === serverId) userServerIndex.delete(uid);

  server.playerCount = countActivePlayers(serverId);
  server.updatedAt = now();

  const wasHost = server.hostUserId === uid;
  if (wasHost && server.playerCount > 0 && opts.promoteHost !== false) {
    // Promote earliest remaining player
    let next = null;
    for (const p of map.values()) {
      if (p.state === 'left') continue;
      if (!next || p.joinedAt < next.joinedAt) next = p;
    }
    if (next) {
      server.hostUserId = next.userId;
      server.hostUsername = next.username;
      server.hostDisplayName = next.displayName;
      emit('host_changed', {
        serverId,
        hostUserId: next.userId,
        hostUsername: next.username,
        hostDisplayName: next.displayName,
      });
    }
  }

  if (server.playerCount <= 0) {
    // Grace period before close — mark empty time in meta
    server.meta = { ...server.meta, emptySince: now() };
  } else {
    if (server.meta && 'emptySince' in server.meta) {
      const { emptySince, ...rest } = server.meta;
      server.meta = rest;
    }
  }

  server.status = deriveStatus(server);
  const pub = toPublicServer(server);
  emit('server_updated', { server: pub });
  emit('player_left', { serverId, userId: uid, playerCount: server.playerCount });

  if (!opts.silent && server.playerCount <= 0) {
    // immediate schedule — sweep will close after grace
  }
  return pub;
}

/**
 * @param {string} serverId
 * @param {number} actorUserId
 * @param {{ force?: boolean, reason?: string }} [opts]
 */
export function closeServer(serverId, actorUserId, opts = {}) {
  const server = getServer(serverId);
  if (!server || server.status === 'closed') {
    throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
  }
  if (!opts.force && Number(actorUserId) !== server.hostUserId) {
    throw new ApiError('FORBIDDEN', 'Apenas o host pode encerrar o servidor.', 403);
  }

  server.status = 'closed';
  server.closedAt = now();
  server.updatedAt = now();
  server.playerCount = 0;

  const map = playersByServer.get(serverId);
  if (map) {
    for (const [uid] of map) {
      if (userServerIndex.get(uid) === serverId) userServerIndex.delete(uid);
    }
    map.clear();
  }
  if (server.inviteCode) inviteIndex.delete(normalizeInviteCode(server.inviteCode));

  const pub = toPublicServer(server);
  emit('server_closed', { server: pub, reason: opts.reason || 'host_closed' });

  try {
    logAdminAction(actorUserId || null, null, opts.force ? 'SERVER_FORCE_CLOSED' : 'SERVER_CLOSED', {
      serverId,
      gameId: server.gameId,
      reason: opts.reason || null,
    });
  } catch {
    /* non-fatal */
  }

  // Keep closed record briefly for admin, purge later
  setTimeout(() => {
    const s = servers.get(serverId);
    if (s && s.status === 'closed' && s.closedAt && now() - s.closedAt > 120_000) {
      servers.delete(serverId);
      playersByServer.delete(serverId);
    }
  }, 125_000).unref?.();

  return pub;
}

/**
 * Host or admin updates visibility / name / maxPlayers.
 * @param {string} serverId
 * @param {number} actorUserId
 * @param {{ name?: string, visibility?: Visibility, maxPlayers?: number }} patch
 * @param {{ force?: boolean }} [opts]
 */
export function updateServer(serverId, actorUserId, patch, opts = {}) {
  const server = getServer(serverId);
  if (!server || server.status === 'closed') {
    throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
  }
  if (!opts.force && Number(actorUserId) !== server.hostUserId) {
    throw new ApiError('FORBIDDEN', 'Apenas o host pode editar o servidor.', 403);
  }

  if (patch.name != null) {
    const name = String(patch.name).trim().slice(0, 48);
    if (!name) throw new ApiError('INVALID_INPUT', 'Nome inválido.', 400);
    server.name = name;
  }

  if (patch.maxPlayers != null) {
    const mp = resolveMaxPlayers(server.gameId, patch.maxPlayers);
    if (mp < server.playerCount) {
      throw new ApiError('INVALID_INPUT', 'Máximo não pode ser menor que jogadores atuais.', 400);
    }
    server.maxPlayers = mp;
  }

  if (patch.visibility === 'public' || patch.visibility === 'private') {
    const prev = server.visibility;
    server.visibility = patch.visibility;
    if (prev === 'public' && patch.visibility === 'private') {
      // Generate fresh code, drop from public
      if (server.inviteCode) inviteIndex.delete(normalizeInviteCode(server.inviteCode));
      server.inviteCode = generateInviteCode();
      inviteIndex.set(normalizeInviteCode(server.inviteCode), server.id);
    }
    if (prev === 'private' && patch.visibility === 'public') {
      // Invalidate old private exclusivity — keep code for share but list publicly
      if (server.inviteCode) inviteIndex.set(normalizeInviteCode(server.inviteCode), server.id);
    }
    try {
      logAdminAction(actorUserId, null, 'SERVER_VISIBILITY_CHANGED', {
        serverId,
        from: prev,
        to: patch.visibility,
      });
    } catch {
      /* */
    }
  }

  server.updatedAt = now();
  server.status = deriveStatus(server);
  const pub = toPublicServer(server, {
    includeInvite: server.visibility === 'private',
    viewerUserId: actorUserId,
  });
  emit('server_updated', { server: pub });
  return {
    server: pub,
    inviteCode: server.visibility === 'private' ? server.inviteCode : null,
  };
}

/**
 * Sync player count / status from game runtime (Capyquake room etc).
 * @param {string} runtimeKey
 * @param {{ playerCount?: number, status?: ServerStatus, hostName?: string, hostUserId?: number, started?: boolean, name?: string }} data
 */
export function syncRuntime(runtimeKey, data = {}) {
  const server = findByRuntimeKey(runtimeKey);
  if (!server) return null;
  if (data.playerCount != null) server.playerCount = Math.max(0, Number(data.playerCount) || 0);
  if (data.name) server.name = String(data.name).slice(0, 48);
  if (data.hostName) {
    server.hostDisplayName = String(data.hostName).slice(0, 48);
    server.hostUsername = String(data.hostName).slice(0, 32);
  }
  if (data.hostUserId) server.hostUserId = Number(data.hostUserId);
  if (data.started === true) server.status = 'playing';
  else if (data.status) server.status = data.status;
  else server.status = deriveStatus(server);
  server.lastHeartbeatAt = now();
  server.updatedAt = now();

  if (server.playerCount <= 0) {
    server.meta = { ...server.meta, emptySince: server.meta.emptySince || now() };
  }

  const pub = toPublicServer(server);
  emit('server_updated', { server: pub });
  return pub;
}

export function touchHeartbeat(serverId) {
  const s = getServer(serverId);
  if (!s || s.status === 'closed') return;
  s.lastHeartbeatAt = now();
}

export function touchHeartbeatByRuntime(runtimeKey) {
  const s = findByRuntimeKey(runtimeKey);
  if (!s) return;
  s.lastHeartbeatAt = now();
}

/**
 * Issue short-lived join token after successful auth.
 * @param {string} serverId
 * @param {number} userId
 */
export function issueJoinToken(serverId, userId) {
  const token = randomBytes(24).toString('base64url');
  const expiresAt = now() + JOIN_TOKEN_TTL_MS;
  joinTokens.set(token, {
    serverId,
    userId: Number(userId),
    expiresAt,
    used: false,
  });
  // Opportunistic purge
  if (joinTokens.size > 5000) {
    const t = now();
    for (const [k, v] of joinTokens) {
      if (v.expiresAt < t || v.used) joinTokens.delete(k);
    }
  }
  return { token, expiresAt };
}

/**
 * Validate join token without consuming (for game WS attach).
 */
export function peekJoinToken(token) {
  const entry = joinTokens.get(String(token || ''));
  if (!entry) return null;
  if (entry.used) return null;
  if (entry.expiresAt < now()) {
    joinTokens.delete(token);
    return null;
  }
  return entry;
}

/**
 * @param {string} token
 * @param {number} userId
 * @param {string} [serverId]
 */
export function consumeJoinToken(token, userId, serverId) {
  const entry = peekJoinToken(token);
  if (!entry) return false;
  if (Number(entry.userId) !== Number(userId)) return false;
  if (serverId && entry.serverId !== serverId) return false;
  entry.used = true;
  joinTokens.delete(token);
  return true;
}

/**
 * Hash compare helper if tokens stored hashed later.
 */
export function hashToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

export function safeEqualStr(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * @param {GameServer} server
 * @param {string} joinToken
 */
export function buildPlayHref(server, joinToken, opts = {}) {
  const base = GAME_PLAY_HREF[server.gameId] || '/';
  const params = new URLSearchParams();
  params.set('serverId', server.id);
  if (joinToken) params.set('joinToken', joinToken);
  const runtime = server.runtimeKey ? String(server.runtimeKey) : '';
  if (runtime && /^[A-Z0-9]{4}$/i.test(runtime)) {
    params.set('lobby', runtime.toUpperCase());
  } else if (server.inviteCode) {
    const raw = String(server.inviteCode);
    if (raw.length === 4) params.set('lobby', raw.toUpperCase());
    else params.set('invite', normalizeInviteCode(raw));
  }
  if (server.visibility === 'private') params.set('visibility', 'private');
  params.set('serverName', server.name);
  if (opts.asHost) params.set('asHost', '1');
  return `${base}?${params.toString()}`;
}

export function bindRuntimeKey(serverId, runtimeKey, data = {}) {
  const server = getServer(serverId);
  if (!server || server.status === 'closed') return null;
  const key = String(runtimeKey || '').trim();
  if (!key) return null;

  for (const s of servers.values()) {
    if (s.id !== server.id && s.runtimeKey === key && s.status !== 'closed') {
      s.runtimeKey = null;
      s.updatedAt = now();
    }
  }

  server.runtimeKey = key;
  if (data.playerCount != null) server.playerCount = Math.max(0, Number(data.playerCount) || 0);
  if (data.hostUserId) server.hostUserId = Number(data.hostUserId);
  if (data.status) server.status = data.status;
  else server.status = deriveStatus(server);
  server.lastHeartbeatAt = now();
  server.updatedAt = now();
  if (key.length === 4) {
    inviteIndex.set(normalizeInviteCode(key), server.id);
  }
  const pub = toPublicServer(server);
  emit('server_updated', { server: pub });
  return pub;
}

/**
 * List players in a server (host/admin/member).
 * @param {string} serverId
 */
export function listPlayers(serverId) {
  const map = playersByServer.get(serverId);
  if (!map) return [];
  return [...map.values()]
    .filter((p) => p.state !== 'left')
    .map((p) => ({
      userId: p.userId,
      username: p.username,
      displayName: p.displayName,
      joinedAt: p.joinedAt,
      sessionId: p.sessionId,
    }));
}

/**
 * Kick player (host or admin).
 */
export function kickPlayer(serverId, targetUserId, actorUserId, opts = {}) {
  const server = getServer(serverId);
  if (!server) throw new ApiError('NOT_FOUND', 'Servidor não encontrado.', 404);
  if (!opts.force && Number(actorUserId) !== server.hostUserId) {
    throw new ApiError('FORBIDDEN', 'Apenas o host pode expulsar jogadores.', 403);
  }
  if (Number(targetUserId) === server.hostUserId && !opts.force) {
    throw new ApiError('FORBIDDEN', 'Não é possível expulsar o host.', 403);
  }
  leaveServer(serverId, targetUserId);
  try {
    logAdminAction(actorUserId, targetUserId, 'PLAYER_KICKED_FROM_SERVER', { serverId });
  } catch {
    /* */
  }
  emit('player_kicked', { serverId, userId: Number(targetUserId) });
  return toPublicServer(server);
}

/**
 * @param {number} userId
 */
export function getUserServer(userId) {
  const sid = userServerIndex.get(Number(userId));
  if (!sid) return null;
  return getServer(sid);
}

/** Capacity metadata for UI create modal. */
export function listGameCapacity() {
  return GAME_IDS.map((id) => ({
    gameId: id,
    name: GAME_LABELS[id],
    symbol: GAME_SYMBOLS[id],
    ...GAME_CAPACITY[id],
    playHref: GAME_PLAY_HREF[id],
  }));
}

function sweep() {
  const t = now();
  for (const s of [...servers.values()]) {
    if (s.status === 'closed') continue;

    // Heartbeat stale
    if (t - s.lastHeartbeatAt > HEARTBEAT_STALE_MS) {
      closeServer(s.id, s.hostUserId, { force: true, reason: 'heartbeat_timeout' });
      continue;
    }

    // Empty grace
    const emptySince = s.meta?.emptySince;
    if (s.playerCount <= 0 && emptySince && t - Number(emptySince) > EMPTY_GRACE_MS) {
      closeServer(s.id, s.hostUserId, { force: true, reason: 'empty' });
      continue;
    }
  }

  // purge expired tokens
  for (const [k, v] of joinTokens) {
    if (v.expiresAt < t || v.used) joinTokens.delete(k);
  }
}

export function startRegistrySweeper() {
  if (sweepTimer) return;
  sweepTimer = setInterval(sweep, SWEEP_INTERVAL_MS);
  sweepTimer.unref?.();
}

export function stopRegistrySweeper() {
  if (sweepTimer) clearInterval(sweepTimer);
  sweepTimer = null;
}

/** Test helper */
export function _resetRegistryForTests() {
  servers.clear();
  playersByServer.clear();
  inviteIndex.clear();
  joinTokens.clear();
  userServerIndex.clear();
}

export const REGISTRY_CONSTANTS = Object.freeze({
  HEARTBEAT_STALE_MS,
  EMPTY_GRACE_MS,
  JOIN_TOKEN_TTL_MS,
});
