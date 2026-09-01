import { api } from './api.js';

/**
 * @typedef {{
 *   id: number,
 *   username: string,
 *   displayName: string,
 *   role: string,
 *   status: string,
 *   createdAt?: number,
 *   lastLoginAt?: number|null,
 * }} PortalUser
 *
 * @typedef {{
 *   userId: number,
 *   coins: number,
 *   tokens: number,
 *   xp: number,
 *   level: number,
 *   rebirths: number,
 *   playTime: number,
 *   kills: number,
 *   damageDealt: number,
 *   matches: number,
 * }} GameProfile
 *
 * @typedef {{
 *   user: PortalUser,
 *   profile: GameProfile|null,
 *   capybara: { name?: string, health?: number, energy?: number, hunger?: number, happiness?: number }|null,
 *   inventory: unknown,
 * }} Account
 */

/** @type {Account|null} */
let cached = null;
/** @type {Promise<Account|null>|null} */
let inflight = null;
/** @type {Set<(a: Account|null) => void>} */
const listeners = new Set();

/**
 * @param {(a: Account|null) => void} fn
 * @returns {() => void}
 */
export function onAuthChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) {
    try {
      fn(cached);
    } catch (e) {
      console.error('[capy-portal] auth listener', e);
    }
  }
}

/**
 * @returns {Account|null}
 */
export function getCachedAccount() {
  return cached;
}

/**
 * @param {boolean} [force]
 * @returns {Promise<Account|null>}
 */
export async function fetchMe(force = false) {
  if (!force && cached) return cached;
  if (!force && inflight) return inflight;

  inflight = (async () => {
    const res = await api('/api/users/me');
    if (!res.ok) {
      cached = null;
      emit();
      return null;
    }
    const d = res.data || {};
    cached = {
      user: d.user,
      profile: d.profile ?? null,
      capybara: d.capybara ?? null,
      inventory: d.inventory ?? null,
    };
    emit();
    return cached;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ ok: true, account: Account } | { ok: false, error: string }>}
 */
export async function login(username, password) {
  const res = await api('/api/auth/login', {
    method: 'POST',
    json: { username, password },
  });
  if (!res.ok) {
    return { ok: false, error: res.error || 'Não foi possível entrar.' };
  }
  const account = await fetchMe(true);
  if (!account) {
    return { ok: false, error: 'Login ok, mas a sessão não carregou.' };
  }
  return { ok: true, account };
}

/**
 * @param {{ username: string, password: string, confirmPassword: string, displayName?: string }} body
 * @returns {Promise<{ ok: true, account: Account } | { ok: false, error: string }>}
 */
export async function register(body) {
  const res = await api('/api/auth/register', {
    method: 'POST',
    json: body,
  });
  if (!res.ok) {
    return { ok: false, error: res.error || 'Não foi possível criar a conta.' };
  }
  const account = await fetchMe(true);
  if (!account) {
    return { ok: false, error: 'Conta criada, mas a sessão não carregou.' };
  }
  return { ok: true, account };
}

/**
 * @returns {Promise<void>}
 */
export async function logout() {
  await api('/api/auth/logout', { method: 'POST', json: {} });
  cached = null;
  emit();
}

/**
 * Display name helper.
 * @param {PortalUser|null|undefined} user
 * @returns {string}
 */
export function displayNameOf(user) {
  if (!user) return 'Jogador';
  return user.displayName || user.username || 'Jogador';
}
