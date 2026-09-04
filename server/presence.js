/**
 * Ephemeral presence index (single Node process).
 * Multi-instance would need a shared store — out of scope.
 *
 * @typedef {'offline'|'online'|'in_lobby'|'in_match'} PresenceStatus
 * @typedef {{ status: PresenceStatus, lobbyCode?: string|null, updatedAt: number, wsCount: number }} PresenceEntry
 */

/** @type {Map<number, PresenceEntry>} */
const presenceByUser = new Map();

/**
 * @param {number|string|null|undefined} userId
 * @returns {number|null}
 */
function uid(userId) {
  const n = Number(userId);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

/**
 * @param {number|string} userId
 * @returns {PresenceEntry}
 */
export function getPresence(userId) {
  const id = uid(userId);
  if (!id) return { status: 'offline', lobbyCode: null, updatedAt: 0, wsCount: 0 };
  return presenceByUser.get(id) || { status: 'offline', lobbyCode: null, updatedAt: 0, wsCount: 0 };
}

/**
 * WS connected (authed only). Increments wsCount; sets online if not in room.
 * @param {number|string} userId
 */
export function touchOnline(userId) {
  const id = uid(userId);
  if (!id) return;
  const prev = presenceByUser.get(id);
  const wsCount = (prev?.wsCount || 0) + 1;
  const status = prev && (prev.status === 'in_lobby' || prev.status === 'in_match')
    ? prev.status
    : 'online';
  presenceByUser.set(id, {
    status,
    lobbyCode: status === 'online' ? null : (prev?.lobbyCode ?? null),
    updatedAt: Date.now(),
    wsCount
  });
}

/**
 * WS disconnected. Decrements; removes when last socket gone.
 * @param {number|string} userId
 */
export function clearPresence(userId) {
  const id = uid(userId);
  if (!id) return;
  const prev = presenceByUser.get(id);
  if (!prev) return;
  const wsCount = Math.max(0, (prev.wsCount || 1) - 1);
  if (wsCount <= 0) {
    presenceByUser.delete(id);
    return;
  }
  presenceByUser.set(id, { ...prev, wsCount, updatedAt: Date.now() });
}

/**
 * @param {number|string} userId
 * @param {string|null|undefined} lobbyCode
 * @param {boolean} started
 */
export function setRoom(userId, lobbyCode, started) {
  const id = uid(userId);
  if (!id) return;
  const prev = presenceByUser.get(id) || { status: 'online', lobbyCode: null, updatedAt: 0, wsCount: 1 };
  const code = lobbyCode ? String(lobbyCode).toUpperCase().slice(0, 8) : null;
  presenceByUser.set(id, {
    status: code ? (started ? 'in_match' : 'in_lobby') : 'online',
    lobbyCode: code,
    updatedAt: Date.now(),
    wsCount: Math.max(1, prev.wsCount || 1)
  });
}

/**
 * Left room but still connected.
 * @param {number|string} userId
 */
export function clearRoom(userId) {
  const id = uid(userId);
  if (!id) return;
  const prev = presenceByUser.get(id);
  if (!prev) return;
  if (prev.wsCount <= 0) {
    presenceByUser.delete(id);
    return;
  }
  presenceByUser.set(id, {
    status: 'online',
    lobbyCode: null,
    updatedAt: Date.now(),
    wsCount: prev.wsCount
  });
}

/**
 * Public-safe presence (no lobby code).
 * @param {number|string} userId
 * @param {{ includeLobbyCode?: boolean }} [opts]
 */
export function presencePayload(userId, opts = {}) {
  const p = getPresence(userId);
  const out = { status: p.status || 'offline' };
  if (opts.includeLobbyCode && p.lobbyCode && (p.status === 'in_lobby' || p.status === 'in_match')) {
    out.lobbyCode = p.lobbyCode;
  }
  return out;
}

/** @returns {number[]} */
export function listOnlineUserIds() {
  return [...presenceByUser.entries()]
    .filter(([, v]) => v.status !== 'offline' && v.wsCount > 0)
    .map(([id]) => id);
}

/** Test helper — wipe all presence. */
export function _resetPresenceForTests() {
  presenceByUser.clear();
}
