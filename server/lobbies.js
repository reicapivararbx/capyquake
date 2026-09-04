/**
 * Ephemeral public lobby directory over the in-memory rooms Map.
 * Single-process only; multi-instance needs a shared store (out of scope).
 *
 * @typedef {{ code: string, hostName: string, playerCount: number, maxPlayers: number, started: boolean, gameId: string }} PublicLobby
 */

/** @type {Map<any, any>|null} */
let roomsRef = null;

/**
 * Inject rooms Map from index.js at boot.
 * @param {Map<any, any>} rooms
 */
export function bindRooms(rooms) {
  roomsRef = rooms;
}

/**
 * @param {{ includeStarted?: boolean }} [opts]
 * @returns {PublicLobby[]}
 */
export function listPublicLobbies(opts = {}) {
  // Single Node process: list is ephemeral and lost on restart.
  if (!roomsRef) return [];
  const includeStarted = !!opts.includeStarted;
  /** @type {PublicLobby[]} */
  const out = [];
  for (const room of roomsRef.values()) {
    if (!room || !room.code) continue;
    if (room.started && !includeStarted) continue;
    const hostName = room.host && room.players?.get?.(room.host)
      ? String(room.players.get(room.host).name || '')
      : '';
    out.push({
      code: String(room.code),
      hostName,
      playerCount: room.players?.size ?? 0,
      maxPlayers: 6,
      started: !!room.started,
      gameId: 'capyquake'
    });
  }
  out.sort((a, b) => a.code.localeCompare(b.code));
  return out;
}

/**
 * @param {string} code
 * @returns {PublicLobby|null}
 */
export function getLobby(code) {
  const wanted = String(code || '').trim().toUpperCase();
  if (!wanted) return null;
  const all = listPublicLobbies({ includeStarted: true });
  return all.find(l => l.code === wanted) || null;
}
