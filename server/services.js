import { db } from './db.js';
import { hashPassword, verifyPassword, newSessionToken } from './passwords.js';
import { env } from './env.js';
import { ApiError, ROLES, ROLE_RANK, ROLE_LABELS, validateUsername, validatePassword, intInRange, requireRole } from './validation.js';
import { applyXp, MAX_LEVEL, xpNeededForLevel } from './xplevel.js';

const now = () => Date.now();

function tx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

// ---------- users ----------

export function createUser({ username, password, displayName, role, customPermissions }) {
  const uname = validateUsername(username);
  const pass = validatePassword(password);
  const finalRole = role !== undefined ? requireRole(role) : 'citizen';
  const permsJson = finalRole === 'custom' && Array.isArray(customPermissions)
    ? JSON.stringify(customPermissions.filter(p => typeof p === 'string'))
    : null;
  return tx(() => {
    const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(uname);
    if (exists) throw new ApiError('USERNAME_TAKEN', 'Username já está em uso.', 409);
    const t = now();
    const name = String(displayName ?? uname).trim().slice(0, 32) || uname;
    const info = db.prepare(
      `INSERT INTO users (username, display_name, password_hash, role, custom_permissions, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
    ).run(uname, name, hashPassword(pass), finalRole, permsJson, t, t);
    const id = Number(info.lastInsertRowid);
    db.prepare(
      `INSERT INTO game_profiles (user_id, created_at, updated_at) VALUES (?, ?, ?)`
    ).run(id, t, t);
    db.prepare(
      `INSERT INTO capybaras (user_id, updated_at) VALUES (?, ?)`
    ).run(id, t);
    return getUserById(id);
  });
}

export function findByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(String(username ?? '').trim());
}

export function getUserById(id) {
  return db.prepare(
    `SELECT id, username, display_name AS displayName, role, status, suspended_until AS suspendedUntil,
            custom_permissions AS customPermissions,
            created_at AS createdAt, updated_at AS updatedAt, last_login_at AS lastLoginAt
     FROM users WHERE id = ?`
  ).get(Number(id)) || null;
}

function publicUser(u) {
  if (!u) return null;
  const { password_hash: _ph, revoked_at: _rv, ...rest } = u;
  return {
    id: rest.id,
    username: rest.username,
    displayName: rest.displayName ?? rest.display_name,
    role: rest.role,
    status: rest.status,
    suspendedUntil: rest.suspendedUntil ?? rest.suspended_until ?? null,
    createdAt: rest.createdAt ?? rest.created_at,
    updatedAt: rest.updatedAt ?? rest.updated_at,
    lastLoginAt: rest.lastLoginAt ?? rest.last_login_at ?? null,
    customPermissions: rest.customPermissions ?? rest.custom_permissions ?? null,
  };
}

export function authenticate(username, password) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(String(username ?? '').trim());
  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new ApiError('UNAUTHORIZED', 'Credenciais inválidas.', 401);
  }
  checkStatus(user);
  const t = now();
  db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(t, t, user.id);
  return publicUser(user);
}

export function checkStatus(user) {
  if (!user) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
  if (user.status === 'banned') throw new ApiError('ACCOUNT_BANNED', 'Conta banida.', 403);
  if (user.status === 'suspended' && (user.suspended_until ?? Infinity) > now()) {
    throw new ApiError('ACCOUNT_SUSPENDED', 'Conta suspensa.', 403);
  }
  if (user.status === 'suspended') {
    db.prepare("UPDATE users SET status='active', suspended_until=NULL WHERE id=?").run(user.id);
    user.status = 'active';
  }
}

// ---------- senhas ----------

// O próprio usuário troca a senha informando a atual.
export function changeOwnPassword(userId, currentPassword, newPassword) {
  const pass = validatePassword(newPassword);
  return tx(() => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(userId));
    if (!user) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
    if (!verifyPassword(currentPassword, user.password_hash)) {
      logAdminAction(userId, userId, 'PASSWORD_CHANGE', { result: 'wrong_current_password' }, false);
      throw new ApiError('UNAUTHORIZED', 'Senha atual incorreta.', 401);
    }
    db.prepare('UPDATE users SET password_hash=?, updated_at=? WHERE id=?')
      .run(hashPassword(pass), now(), userId);
    // Revoga todas as outras sessões por segurança; a sessão atual continua válida.
    revokeOtherSessions(userId, null);
    logAdminAction(userId, userId, 'PASSWORD_CHANGE', { self: true }, true);
    return getUserById(userId);
  });
}

// Admin autorizado define uma nova senha para um usuário de rank inferior.
export function adminSetPassword(actor, targetId, newPassword) {
  const pass = validatePassword(newPassword);
  return tx(() => {
    const target = getUserById(targetId);
    if (!target) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
    if (target.id !== actor.id && ROLE_RANK[target.role] >= ROLE_RANK[actor.role] && actor.role !== 'king') {
      throw new ApiError('FORBIDDEN', 'Não é possível alterar senha de alguém com cargo igual ou superior.', 403);
    }
    if (ROLE_RANK[target.role] > ROLE_RANK[actor.role]) {
      throw new ApiError('FORBIDDEN', 'Nem o King pode ser redefinido por aqui.', 403);
    }
    db.prepare('UPDATE users SET password_hash=?, updated_at=? WHERE id=?')
      .run(hashPassword(pass), now(), targetId);
    revokeAllSessions(targetId);
    logAdminAction(actor.id, targetId, 'PASSWORD_CHANGE', { byAdmin: true }, true);
    return getUserById(targetId);
  });
}

function revokeOtherSessions(userId, keepToken) {
  db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL AND id != ?')
    .run(now(), Number(userId), keepToken ?? '');
}

// ---------- sessions ----------

export function createSession(userId) {
  const token = newSessionToken();
  const t = now();
  tx(() => {
    db.prepare('INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
      .run(token, userId, t, t + env.sessionTtlMs);
  });
  return { token, expiresAt: t + env.sessionTtlMs };
}

export function createAdminCodeSession() {
  const admin = db.prepare(`SELECT * FROM users WHERE username = ? AND role = 'king'`)
    .get(env.adminUsername);
  if (!admin) throw new ApiError('OPERATION_FAILED', 'Conta administrativa não configurada.', 500);
  return createSession(admin.id);
}

export function resolveSession(token) {
  if (!token) return null;
  const row = db.prepare(
    `SELECT s.id AS session_id, s.expires_at, u.*,
            (u.status = 'suspended' AND (u.suspended_until IS NOT NULL AND u.suspended_until <= ?)) AS suspension_over
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ?`
  ).get(now(), token);
  if (!row || row.expires_at < now()) return null;
  if (row.revoked_at) return null;
  if (row.status === 'suspended' && !row.suspension_over) return null;
  delete row.session_id;
  delete row.expires_at;
  delete row.suspension_over;
  return publicUser(row);
}

export function revokeSession(token) {
  if (!token) return;
  tx(() => db.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?').run(now(), token));
}

// ---------- economy ----------

const COIN_CAP = 1e15;

function applyCurrencyChange(userId, currency, after, type, reason, actor) {
  const col = currency === 'tokens' ? 'tokens' : 'coins';
  const prof = getProfileRaw(userId);
  const before = prof[col];
  db.prepare(`UPDATE game_profiles SET ${col} = ?, updated_at = ? WHERE user_id = ?`)
    .run(after, now(), userId);
  db.prepare(
    `INSERT INTO currency_transactions (user_id, type, currency, amount, balance_before, balance_after, reason, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(userId, type, currency, after - before, before, after, String(reason || '').slice(0, 300), actor, now());
  return { before, after };
}

function adjustCurrency(userId, currency, delta, type, reason, actor) {
  const col = currency === 'tokens' ? 'tokens' : 'coins';
  const prof = getProfileRaw(userId);
  const after = Math.max(0, Math.min(COIN_CAP, prof[col] + delta));
  return tx(() => applyCurrencyChange(userId, currency, after, type, reason, actor));
}

export function giveCoins(actor, targetId, amount, reason) {
  const value = intInRange(amount, -COIN_CAP, COIN_CAP, 'INVALID_AMOUNT', 'Quantidade inválida');
  return tx(() => {
    const cur = getProfileRaw(targetId).coins;
    const next = Math.max(0, Math.min(COIN_CAP, cur + value));
    if (next === cur && value !== 0) return { before: cur, after: cur };
    return applyCurrencyChange(targetId, 'coins', next,
      value >= 0 ? 'ADMIN_GIVE' : 'ADMIN_REMOVE', reason, actor.username);
  });
}

export function setCoins(actor, targetId, amount, reason) {
  const value = intInRange(amount, 0, COIN_CAP, 'INVALID_AMOUNT', 'Saldo inválido');
  return tx(() => applyCurrencyChange(targetId, 'coins', value, 'ADMIN_SET', reason, actor.username));
}

export function giveTokens(actor, targetId, amount, reason) {
  const value = intInRange(amount, -COIN_CAP, COIN_CAP, 'INVALID_AMOUNT', 'Quantidade inválida');
  return tx(() => {
    const cur = getProfileRaw(targetId).tokens;
    const next = Math.max(0, Math.min(COIN_CAP, cur + value));
    return applyCurrencyChange(targetId, 'tokens', next,
      value >= 0 ? 'ADMIN_GIVE' : 'ADMIN_REMOVE', reason, actor.username);
  });
}

export function setTokens(actor, targetId, amount, reason) {
  const value = intInRange(amount, 0, COIN_CAP, 'INVALID_AMOUNT', 'Saldo inválido');
  return tx(() => applyCurrencyChange(targetId, 'tokens', value, 'ADMIN_SET', reason, actor.username));
}

// ---------- xp / level ----------

export function giveXp(actor, targetId, amount, reason) {
  const gained = intInRange(amount, -1e12, 1e12, 'INVALID_XP', 'XP inválido');
  return tx(() => {
    const prof = getProfileRaw(targetId);
    const next = gained >= 0
      ? applyXp(prof.level, prof.xp, gained)
      : clampXpDown(prof.level, prof.xp, -gained);
    db.prepare('UPDATE game_profiles SET level = ?, xp = ?, updated_at = ? WHERE user_id = ?')
      .run(next.level, next.xp, now(), targetId);
    logAdminAction(actor.id ?? null, targetId, gained >= 0 ? 'GIVE_XP' : 'REMOVE_XP',
      { amount: gained, previousXp: prof.xp, newXp: next.xp, previousLevel: prof.level, newLevel: next.level, reason }, true);
    return { ...next, previousLevel: prof.level };
  });
}

function clampXpDown(level, xp, loss) {
  let cur = xp - loss;
  let lvl = level;
  while (cur < 0 && lvl > 1) { lvl--; cur += xpNeededForLevel(lvl); }
  return { level: lvl, xp: Math.max(0, cur), leveledUp: false };
}

export function setXp(actor, targetId, totalXp, reason) {
  const value = intInRange(totalXp, 0, 1e13, 'INVALID_XP', 'XP inválido');
  return tx(() => {
    const prof = getProfileRaw(targetId);
    const next = applyXp(1, 0, value);
    db.prepare('UPDATE game_profiles SET level = ?, xp = ?, updated_at = ? WHERE user_id = ?')
      .run(next.level, next.xp, now(), targetId);
    logAdminAction(actor.id ?? null, targetId, 'SET_XP',
      { previousValue: `${prof.level}/${prof.xp}`, newValue: `${next.level}/${next.xp}`, reason }, true);
    return next;
  });
}

export function setLevel(actor, targetId, level, reason) {
  const lvl = intInRange(level, 1, MAX_LEVEL, 'INVALID_LEVEL', 'Nível inválido');
  return tx(() => {
    const prof = getProfileRaw(targetId);
    db.prepare('UPDATE game_profiles SET level = ?, xp = MIN(xp, ?), updated_at = ? WHERE user_id = ?')
      .run(lvl, xpNeededForLevel(lvl) - 1, now(), targetId);
    logAdminAction(actor.id ?? null, targetId, 'SET_LEVEL',
      { previousLevel: prof.level, newLevel: lvl, reason }, true);
    return { level: lvl };
  });
}

export function levelUp(actor, targetId, times = 1, reason = '') {
  const n = intInRange(times, 1, MAX_LEVEL - 1, 'INVALID_LEVEL', 'Nível inválido');
  return tx(() => {
    const prof = getProfileRaw(targetId);
    const targetLevel = Math.min(MAX_LEVEL, prof.level + n);
    db.prepare('UPDATE game_profiles SET level = ?, xp = 0, updated_at = ? WHERE user_id = ?')
      .run(targetLevel, now(), targetId);
    logAdminAction(actor.id ?? null, targetId, 'LEVEL_UP',
      { previousLevel: prof.level, newLevel: targetLevel, reason }, true);
    return { level: targetLevel };
  });
}

// ---------- inventory ----------

export function getItemsCatalog() {
  return catalogCache;
}

import { readFileSync } from 'node:fs';
let catalogCache = (() => {
  try {
    const data = JSON.parse(readFileSync(new URL('./items.json', import.meta.url), 'utf8'));
    const map = new Map();
    for (const it of data.items) map.set(it.id, it);
    return map;
  } catch { return new Map(); }
})();

export function addItemToInventory(actor, targetId, itemId, quantity, reason) {
  const qty = intInRange(quantity, 1, 1e6, 'INVALID_QUANTITY', 'Quantidade inválida');
  const item = catalogCache.get(String(itemId));
  if (!item) throw new ApiError('INVALID_ITEM', 'Item inexistente.', 400);
  return tx(() => {
    db.prepare(
      `INSERT INTO inventory (user_id, item_id, quantity, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, item_id) DO UPDATE SET quantity = quantity + excluded.quantity, updated_at = excluded.updated_at`
    ).run(targetId, item.id, qty, now());
    logAdminAction(actor?.id ?? null, targetId, 'GIVE_ITEM', { itemId: item.id, quantity: qty, reason }, true);
  });
}

export function removeItemFromInventory(actor, targetId, itemId, quantity, reason) {
  const qty = intInRange(quantity, 1, 1e6, 'INVALID_QUANTITY', 'Quantidade inválida');
  const item = catalogCache.get(String(itemId));
  if (!item) throw new ApiError('INVALID_ITEM', 'Item inexistente.', 400);
  return tx(() => {
    const row = db.prepare('SELECT quantity FROM inventory WHERE user_id = ? AND item_id = ?').get(targetId, item.id);
    const available = row ? row.quantity : 0;
    if (available < qty) throw new ApiError('INVALID_QUANTITY', `Possui apenas ${available}x ${item.name}.`, 400);
    const left = available - qty;
    if (left === 0) db.prepare('DELETE FROM inventory WHERE user_id = ? AND item_id = ?').run(targetId, item.id);
    else db.prepare('UPDATE inventory SET quantity = ?, updated_at = ? WHERE user_id = ? AND item_id = ?')
      .run(left, now(), targetId, item.id);
    logAdminAction(actor?.id ?? null, targetId, 'REMOVE_ITEM', { itemId: item.id, quantity: qty, reason }, true);
    return { removed: qty, remaining: left };
  });
}

export function getInventory(userId) {
  return db.prepare(
    'SELECT item_id AS itemId, quantity, updated_at AS updatedAt FROM inventory WHERE user_id = ? ORDER BY item_id'
  ).all(Number(userId));
}

// ---------- capybara ----------

const CAPY_STATS = ['health', 'energy', 'hunger', 'happiness'];

export function getCapybara(userId) {
  ensureCapybara(userId);
  return db.prepare(
    'SELECT name, health, energy, hunger, happiness, updated_at AS updatedAt FROM capybaras WHERE user_id = ?'
  ).get(Number(userId));
}

function ensureCapybara(userId) {
  db.prepare('INSERT OR IGNORE INTO capybaras (user_id, updated_at) VALUES (?, ?)').run(Number(userId), now());
}

function clampStat(v) { return Math.max(0, Math.min(100, Number(v) | 0)); }

export function updateCapybara(userId, patch = {}) {
  ensureCapybara(userId);
  const sets = [];
  const vals = [];
  for (const k of CAPY_STATS) {
    if (patch[k] !== undefined) { sets.push(`${k} = ?`); vals.push(clampStat(patch[k])); }
  }
  if (patch.name !== undefined) {
    const name = String(patch.name).trim().slice(0, 24) || 'Capy';
    sets.push('name = ?'); vals.push(name);
  }
  if (sets.length) {
    sets.push('updated_at = ?');
    vals.push(now());
    vals.push(Number(userId));
    db.prepare(`UPDATE capybaras SET ${sets.join(', ')} WHERE user_id = ?`).run(...vals);
  }
  return getCapybara(userId);
}

export function maxStats(actor, targetId, reason) {
  ensureCapybara(targetId);
  return tx(() => {
    db.prepare('UPDATE capybaras SET health=100, energy=100, hunger=100, happiness=100, updated_at=? WHERE user_id=?')
      .run(now(), targetId);
    logAdminAction(actor.id ?? null, targetId, 'MAX_STATS', { reason }, true);
    return getCapybara(targetId);
  });
}

export function heal(actor, targetId, reason) {
  ensureCapybara(targetId);
  return tx(() => {
    db.prepare('UPDATE capybaras SET health=100, energy=100, updated_at=? WHERE user_id=?').run(now(), targetId);
    logAdminAction(actor.id ?? null, targetId, 'HEAL', { reason }, true);
    return getCapybara(targetId);
  });
}

// ---------- profiles / reports ----------

export function getProfileRaw(userId) {
  const p = db.prepare(
    `SELECT user_id AS userId, coins, tokens, xp, level, rebirths, play_time AS playTime,
            kills, damage_dealt AS damageDealt, matches, updated_at AS updatedAt
     FROM game_profiles WHERE user_id = ?`
  ).get(Number(userId));
  if (!p) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
  return p;
}

export function getFullAccount(userId) {
  const user = getUserById(userId);
  if (!user) return null;
  return {
    user,
    profile: getProfileRaw(userId),
    capybara: getCapybara(userId),
    inventory: getInventory(userId)
  };
}

const REPORT_LIMITS = {
  coins: 5e12, tokens: 5e9, xp: 1e10, kills: 2e6, damage: 1e15,
  playTime: 4 * 3600, matches: 1, rebirthsDelta: 0
};

// Relatorio fim-de-partida: cliente envia GANHOS da partida; servidor limita e aplica.
export function reportMatch(userId, report = {}) {
  const num = (v, max) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(Math.floor(n), max);
  };
  const coins = num(report.moneyEarned, REPORT_LIMITS.coins);
  const tokens = num(report.tokensEarned, REPORT_LIMITS.tokens);
  const kills = num(report.kills, REPORT_LIMITS.kills);
  const damage = num(report.damageDealt, REPORT_LIMITS.damage);
  const playTime = num(report.playTimeSeconds, REPORT_LIMITS.playTime);
  const won = report.won ? 1 : 0;
  return tx(() => {
    const prof = getProfileRaw(userId);
    const next = applyXp(prof.level, prof.xp, num(report.xpEarned, REPORT_LIMITS.xp));
    const beforeCoins = prof.coins;
    const beforeTokens = prof.tokens;
    db.prepare(
      `UPDATE game_profiles SET coins = coins + ?, tokens = tokens + ?, xp = ?, level = ?,
        play_time = play_time + ?, kills = kills + ?, damage_dealt = damage_dealt + ?, matches = matches + 1, updated_at = ?
       WHERE user_id = ?`
    ).run(coins, tokens, next.xp, next.level, playTime, kills, damage, now(), userId);
    for (const [currency, amount, before] of [
      ['coins', coins, beforeCoins], ['tokens', tokens, beforeTokens]
    ]) {
      if (amount > 0) {
        db.prepare(
          `INSERT INTO currency_transactions (user_id, type, currency, amount, balance_before, balance_after, reason, created_by, created_at)
           VALUES (?, 'EARN', ?, ?, ?, ?, 'match_report', NULL, ?)`
        ).run(userId, currency, amount, before, before + amount, now());
      }
    }
    const fresh = getProfileRaw(userId);
    return {
      coins: fresh.coins,
      tokens: fresh.tokens,
      level: next.level, xp: next.xp, leveledUp: next.leveledUp,
      applied: { coins, tokens, xp: num(report.xpEarned, REPORT_LIMITS.xp), kills, damage }
    };
  });
}

// ---------- moderation ----------

export function setStatus(actor, targetId, status, durationMs, reason) {
  return tx(() => {
    const target = getUserById(targetId);
    if (!target) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
    if (ROLE_RANK[target.role] >= ROLE_RANK[actor.role]) {
      throw new ApiError('FORBIDDEN', 'Não é possível moderar alguém com role igual ou superior.', 403);
    }
    const until = status === 'suspended' && durationMs ? now() + durationMs : null;
    db.prepare('UPDATE users SET status=?, suspended_until=?, updated_at=? WHERE id=?')
      .run(status, until, now(), targetId);
    revokeAllSessions(targetId);
    const actionName = { banned: 'BAN', suspended: 'SUSPEND', active: 'UNBAN' }[status] || status.toUpperCase();
    logAdminAction(actor.id, targetId, actionName, { reason, until }, true);
    return getUserById(targetId);
  });
}

export const banUser = (actor, id, reason) => setStatus(actor, id, 'banned', null, reason);
export const suspendUser = (actor, id, reason, durationMs) => setStatus(actor, id, 'suspended', durationMs, reason);
export const unbanUser = (actor, id, reason) => setStatus(actor, id, 'active', null, reason);

function revokeAllSessions(userId) {
  db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(now(), userId);
}

export function revokeTargetSessions(userId) {
  revokeAllSessions(userId);
}

// ---------- roles ----------

export function changeRole(actor, targetId, newRole, reason, customPermissions) {
  const role = requireRole(newRole);
  const permsJson = role === 'custom' && Array.isArray(customPermissions)
    ? JSON.stringify(customPermissions.filter(p => typeof p === 'string'))
    : null;
  return tx(() => {
    const target = getUserById(targetId);
    if (!target) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
    if (target.id === actor.id) throw new ApiError('FORBIDDEN', 'Você não pode alterar a própria role.', 403);
    if (target.role === 'king' && actor.role !== 'king') throw new ApiError('FORBIDDEN', 'O cargo de Capybara_King não pode ser alterado por ninguém além do próprio King.', 403);
    if (ROLE_RANK[target.role] >= ROLE_RANK[actor.role] && actor.role !== 'king') {
      throw new ApiError('FORBIDDEN', 'Alvo com cargo igual ou superior ao seu.', 403);
    }
    if (ROLE_RANK[role] > ROLE_RANK[actor.role] && actor.role !== 'king') {
      throw new ApiError('FORBIDDEN', 'Não é possível conceder cargo superior ao seu.', 403);
    }
    if (role === 'king' && actor.role !== 'king') {
      throw new ApiError('FORBIDDEN', 'Apenas o Capybara_King define outro King.', 403);
    }
    db.prepare('UPDATE users SET role=?, custom_permissions=?, updated_at=? WHERE id=?').run(role, permsJson, now(), targetId);
    revokeAllSessions(targetId);
    logAdminAction(actor.id, targetId, 'ROLE_CHANGE',
      { previousRole: target.role, newRole: role, roleLabel: ROLE_LABELS[role], reason }, true);
    return getUserById(targetId);
  });
}

// ---------- reset ----------

export function resetPlayer(actor, targetId, scopes, confirmUsername, reason) {
  const target = getUserById(targetId);
  if (!target) throw new ApiError('PLAYER_NOT_FOUND', 'Jogador não encontrado.', 404);
  if (String(confirmUsername || '').toLowerCase() !== target.username.toLowerCase()) {
    throw new ApiError('INVALID_INPUT', 'Confirmação de username não corresponde.', 400);
  }
  const all = scopes.includes('all');
  const has = s => all || scopes.includes(s);
  return tx(() => {
    if (has('coins')) { applyCurrencyChange(targetId, 'coins', 0, 'ADMIN_SET', reason, actor.username); applyCurrencyChange(targetId, 'tokens', 0, 'ADMIN_SET', reason, actor.username); }
    if (has('xp') || has('level')) {
      db.prepare('UPDATE game_profiles SET xp=0, level=1, updated_at=? WHERE user_id=?').run(now(), targetId);
    }
    if (has('stats')) {
      db.prepare(`UPDATE game_profiles SET kills=0, damage_dealt=0, play_time=0, matches=0, updated_at=? WHERE user_id=?`)
        .run(now(), targetId);
    }
    if (has('inventory')) db.prepare('DELETE FROM inventory WHERE user_id=?').run(targetId);
    if (has('capybara')) {
      db.prepare('UPDATE capybaras SET health=100, energy=100, hunger=100, happiness=100, updated_at=? WHERE user_id=?')
        .run(now(), targetId);
    }
    logAdminAction(actor.id, targetId, 'RESET_PLAYER',
      { scopes: all ? ['all'] : scopes, reason }, true);
    return getFullAccount(targetId);
  });
}

// ---------- audit ----------

export function logAdminAction(actorId, targetId, action, metadata, success = true) {
  db.prepare(
    'INSERT INTO admin_logs (actor_user_id, target_user_id, action, metadata, success, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(actorId, targetId ?? null, action, JSON.stringify(metadata ?? {}), success ? 1 : 0, now());
}

export function listLogs({ actorId, targetUserId, action, from, to, success, limit = 20, offset = 0 }) {
  const where = [];
  const params = [];
  if (actorId) { where.push('actor_user_id = ?'); params.push(actorId); }
  if (targetUserId) { where.push('target_user_id = ?'); params.push(targetUserId); }
  if (action) { where.push('action = ?'); params.push(action); }
  if (from) { where.push('created_at >= ?'); params.push(from); }
  if (to) { where.push('created_at <= ?'); params.push(to); }
  if (success !== undefined) { where.push('success = ?'); params.push(success ? 1 : 0); }
  const sqlWhere = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = db.prepare(
    `SELECT l.*, a.username AS actor_username, t.username AS target_username
     FROM admin_logs l
     LEFT JOIN users a ON a.id = l.actor_user_id
     LEFT JOIN users t ON t.id = l.target_user_id
     ${sqlWhere} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, intInRange(limit, 1, 100, 'INVALID_INPUT', 'limit'), intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset'));
  return rows.map(r => ({ ...r, metadata: safeJson(r.metadata) }));
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }

export function listTransactions(userId, limit = 20, offset = 0) {
  return db.prepare(
    `SELECT id, type, currency, amount, balance_before AS balanceBefore, balance_after AS balanceAfter,
            reason, created_by AS createdBy, created_at AS createdAt
     FROM currency_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(Number(userId), intInRange(limit, 1, 100, 'INVALID_INPUT', 'limit'), intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset'));
}

// ---------- search / dashboard ----------

export function searchUsers({ q, limit = 20, offset = 0, status, role }) {
  const lim = intInRange(limit, 1, 100, 'INVALID_INPUT', 'limit');
  const off = intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset');
  const roleFilter = role && ROLES.includes(role) ? role : null;
  const SELECT_COLS = `SELECT u.id, u.username, u.display_name AS displayName, u.role, u.status,
              u.created_at AS createdAt, u.last_login_at AS lastLoginAt,
              g.coins, g.level, g.xp
       FROM users u LEFT JOIN game_profiles g ON g.user_id = u.id`;
  let rows;
  if (q) {
    const like = `%${String(q).replace(/[%_]/g, ch => '\\' + ch)}%`;
    rows = db.prepare(
      `${SELECT_COLS}
       WHERE (u.username LIKE ? ESCAPE '\\' OR u.display_name LIKE ? ESCAPE '\\' OR CAST(u.id AS TEXT) = ?)
         ${roleFilter ? 'AND u.role = ?' : ''}
         ORDER BY u.id LIMIT ? OFFSET ?`
    ).all(like, like, String(q).replace(/[^0-9]/g, ''), ...(roleFilter ? [roleFilter] : []), lim, off);
  } else if (roleFilter || status) {
    const where = [];
    const params = [];
    if (status) { where.push('u.status = ?'); params.push(String(status)); }
    if (roleFilter) { where.push('u.role = ?'); params.push(roleFilter); }
    rows = db.prepare(
      `${SELECT_COLS} WHERE ${where.join(' AND ')} ORDER BY u.id LIMIT ? OFFSET ?`
    ).all(...params, lim, off);
  } else {
    rows = db.prepare(
      `${SELECT_COLS} ORDER BY u.id LIMIT ? OFFSET ?`
    ).all(lim, off);
  }
  return rows;
}

export function countUsers() {
  return db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
}

export function dashboardStats() {
  const t = now();
  return {
    totalUsers: db.prepare('SELECT COUNT(*) AS c FROM users').get().c,
    activeUsers: db.prepare("SELECT COUNT(*) AS c FROM users WHERE status='active'").get().c,
    bannedUsers: db.prepare("SELECT COUNT(*) AS c FROM users WHERE status='banned'").get().c,
    onlineUsers: db.prepare('SELECT COUNT(DISTINCT user_id) AS c FROM sessions WHERE revoked_at IS NULL AND expires_at > ? AND created_at > ?')
      .get(t - 30 * 60000, t - 30 * 60000).c,
    totalCoins: db.prepare('SELECT COALESCE(SUM(coins),0) AS c FROM game_profiles').get().c,
    totalTokens: db.prepare('SELECT COALESCE(SUM(tokens),0) AS c FROM game_profiles').get().c,
    totalTransactions: db.prepare('SELECT COUNT(*) AS c FROM currency_transactions').get().c,
    recentActions: listLogs({ limit: 10 }),
    activeMotd: getActiveMotd()?.body || null,
    publishedNews: db.prepare('SELECT COUNT(*) AS c FROM portal_news WHERE published=1').get().c,
    portalWiki: db.prepare('SELECT COUNT(*) AS c FROM portal_wiki_articles WHERE published=1').get().c,
    portalAchievements: db.prepare('SELECT COUNT(*) AS c FROM portal_achievements WHERE published=1').get().c
  };
}

const MSG_KINDS = new Set(['announce', 'motd', 'broadcast']);

function slugify(raw, fallback = 'item') {
  const s = String(raw ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return s || fallback;
}

function mapGlobalMessage(r) {
  if (!r) return null;
  return {
    id: r.id,
    kind: r.kind,
    body: r.body,
    active: !!r.active,
    createdBy: r.created_by ?? null,
    createdAt: r.created_at,
    expiresAt: r.expires_at ?? null,
    authorUsername: r.author_username || null
  };
}

export function createGlobalMessage({ kind, body, actorId, expiresAt = null, active = true }) {
  if (!MSG_KINDS.has(kind)) throw new ApiError('INVALID_INPUT', 'Tipo de mensagem inválido.', 400);
  const text = String(body ?? '').trim();
  if (!text) throw new ApiError('INVALID_INPUT', 'Mensagem vazia.', 400);
  if (text.length > 2000) throw new ApiError('INVALID_INPUT', 'Mensagem muito longa (máx. 2000).', 400);
  const t = now();
  return tx(() => {
    if (kind === 'motd' && active) {
      db.prepare("UPDATE global_messages SET active=0 WHERE kind='motd' AND active=1").run();
    }
    const info = db.prepare(
      `INSERT INTO global_messages (kind, body, active, created_by, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(kind, text, active ? 1 : 0, actorId ?? null, t, expiresAt ?? null);
    return getGlobalMessageById(Number(info.lastInsertRowid));
  });
}

export function getGlobalMessageById(id) {
  const r = db.prepare(
    `SELECT m.*, u.username AS author_username
     FROM global_messages m LEFT JOIN users u ON u.id = m.created_by
     WHERE m.id = ?`
  ).get(Number(id));
  return mapGlobalMessage(r);
}

export function listGlobalMessages({ kind, activeOnly = false, limit = 50, offset = 0 } = {}) {
  const lim = intInRange(limit, 1, 200, 'INVALID_INPUT', 'limit');
  const off = intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset');
  const where = [];
  const params = [];
  if (kind) {
    if (!MSG_KINDS.has(kind)) throw new ApiError('INVALID_INPUT', 'Tipo de mensagem inválido.', 400);
    where.push('m.kind = ?');
    params.push(kind);
  }
  if (activeOnly) {
    where.push('m.active = 1');
    where.push('(m.expires_at IS NULL OR m.expires_at > ?)');
    params.push(now());
  }
  const sqlWhere = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.prepare(
    `SELECT m.*, u.username AS author_username
     FROM global_messages m LEFT JOIN users u ON u.id = m.created_by
     ${sqlWhere} ORDER BY m.created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, lim, off).map(mapGlobalMessage);
}

export function getActiveMotd() {
  const r = db.prepare(
    `SELECT m.*, u.username AS author_username
     FROM global_messages m LEFT JOIN users u ON u.id = m.created_by
     WHERE m.kind='motd' AND m.active=1
       AND (m.expires_at IS NULL OR m.expires_at > ?)
     ORDER BY m.created_at DESC LIMIT 1`
  ).get(now());
  return mapGlobalMessage(r);
}

export function deactivateGlobalMessage(id) {
  const row = getGlobalMessageById(id);
  if (!row) throw new ApiError('NOT_FOUND', 'Mensagem não encontrada.', 404);
  db.prepare('UPDATE global_messages SET active=0 WHERE id=?').run(Number(id));
  return getGlobalMessageById(id);
}

function mapNews(r) {
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary || '',
    body: r.body || '',
    published: !!r.published,
    publishedAt: r.published_at ?? null,
    createdBy: r.created_by ?? null,
    updatedBy: r.updated_by ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    authorUsername: r.author_username || null
  };
}

export function listPortalNews({ publishedOnly = false, limit = 50, offset = 0 } = {}) {
  const lim = intInRange(limit, 1, 200, 'INVALID_INPUT', 'limit');
  const off = intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset');
  const where = publishedOnly ? 'WHERE n.published=1' : '';
  return db.prepare(
    `SELECT n.*, u.username AS author_username
     FROM portal_news n LEFT JOIN users u ON u.id = n.created_by
     ${where}
     ORDER BY COALESCE(n.published_at, n.created_at) DESC LIMIT ? OFFSET ?`
  ).all(lim, off).map(mapNews);
}

export function getPortalNewsBySlug(slug, { publishedOnly = false } = {}) {
  const s = String(slug ?? '').trim();
  if (!s) return null;
  const r = db.prepare(
    `SELECT n.*, u.username AS author_username
     FROM portal_news n LEFT JOIN users u ON u.id = n.created_by
     WHERE n.slug = ? ${publishedOnly ? 'AND n.published=1' : ''}`
  ).get(s);
  return mapNews(r);
}

export function getPortalNewsById(id) {
  const r = db.prepare(
    `SELECT n.*, u.username AS author_username
     FROM portal_news n LEFT JOIN users u ON u.id = n.created_by WHERE n.id = ?`
  ).get(Number(id));
  return mapNews(r);
}

export function createPortalNews({ title, summary = '', body = '', slug, published = false, actorId }) {
  const tTitle = String(title ?? '').trim();
  if (!tTitle) throw new ApiError('INVALID_INPUT', 'Título obrigatório.', 400);
  if (tTitle.length > 200) throw new ApiError('INVALID_INPUT', 'Título muito longo.', 400);
  const finalSlug = slugify(slug || tTitle, 'news');
  const t = now();
  const pub = !!published;
  try {
    const info = db.prepare(
      `INSERT INTO portal_news
        (slug, title, summary, body, published, published_at, created_by, updated_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      finalSlug, tTitle, String(summary ?? '').slice(0, 500), String(body ?? '').slice(0, 50000),
      pub ? 1 : 0, pub ? t : null, actorId ?? null, actorId ?? null, t, t
    );
    return getPortalNewsById(Number(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Slug de novidade já existe.', 409);
    }
    throw e;
  }
}

export function updatePortalNews(id, { title, summary, body, slug, published, actorId }) {
  const existing = getPortalNewsById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Novidade não encontrada.', 404);
  const t = now();
  const nextTitle = title !== undefined ? String(title).trim() : existing.title;
  if (!nextTitle) throw new ApiError('INVALID_INPUT', 'Título obrigatório.', 400);
  const nextSlug = slug !== undefined ? slugify(slug, existing.slug) : existing.slug;
  const nextSummary = summary !== undefined ? String(summary).slice(0, 500) : existing.summary;
  const nextBody = body !== undefined ? String(body).slice(0, 50000) : existing.body;
  let nextPublished = existing.published;
  let nextPublishedAt = existing.publishedAt;
  if (published !== undefined) {
    nextPublished = !!published;
    if (nextPublished && !existing.published) nextPublishedAt = t;
    if (!nextPublished) nextPublishedAt = null;
  }
  try {
    db.prepare(
      `UPDATE portal_news SET slug=?, title=?, summary=?, body=?, published=?, published_at=?,
        updated_by=?, updated_at=? WHERE id=?`
    ).run(
      nextSlug, nextTitle, nextSummary, nextBody, nextPublished ? 1 : 0, nextPublishedAt,
      actorId ?? null, t, Number(id)
    );
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Slug de novidade já existe.', 409);
    }
    throw e;
  }
  return getPortalNewsById(id);
}

export function deletePortalNews(id) {
  const existing = getPortalNewsById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Novidade não encontrada.', 404);
  db.prepare('DELETE FROM portal_news WHERE id=?').run(Number(id));
  return existing;
}

function mapWiki(r) {
  if (!r) return null;
  return {
    id: r.id,
    gameId: r.game_id,
    slug: r.slug,
    title: r.title,
    description: r.description || '',
    bodyMd: r.body_md || '',
    published: !!r.published,
    sortOrder: r.sort_order ?? 0,
    createdBy: r.created_by ?? null,
    updatedBy: r.updated_by ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function listPortalWiki({ gameId, publishedOnly = false, limit = 100, offset = 0 } = {}) {
  const lim = intInRange(limit, 1, 500, 'INVALID_INPUT', 'limit');
  const off = intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset');
  const where = [];
  const params = [];
  if (gameId) { where.push('game_id = ?'); params.push(String(gameId)); }
  if (publishedOnly) where.push('published = 1');
  const sqlWhere = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.prepare(
    `SELECT * FROM portal_wiki_articles ${sqlWhere}
     ORDER BY sort_order ASC, title ASC LIMIT ? OFFSET ?`
  ).all(...params, lim, off).map(mapWiki);
}

export function getPortalWikiById(id) {
  return mapWiki(db.prepare('SELECT * FROM portal_wiki_articles WHERE id=?').get(Number(id)));
}

export function getPortalWikiArticle(gameId, slug, { publishedOnly = false } = {}) {
  const r = db.prepare(
    `SELECT * FROM portal_wiki_articles WHERE game_id=? AND slug=? ${publishedOnly ? 'AND published=1' : ''}`
  ).get(String(gameId), String(slug));
  return mapWiki(r);
}

export function createPortalWiki({ gameId, slug, title, description = '', bodyMd = '', published = false, sortOrder = 0, actorId }) {
  const g = String(gameId ?? '').trim();
  const tTitle = String(title ?? '').trim();
  if (!g) throw new ApiError('INVALID_INPUT', 'gameId obrigatório.', 400);
  if (!tTitle) throw new ApiError('INVALID_INPUT', 'Título obrigatório.', 400);
  const finalSlug = slugify(slug || tTitle, 'artigo');
  const t = now();
  try {
    const info = db.prepare(
      `INSERT INTO portal_wiki_articles
        (game_id, slug, title, description, body_md, published, sort_order, created_by, updated_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      g, finalSlug, tTitle, String(description).slice(0, 500), String(bodyMd).slice(0, 200000),
      published ? 1 : 0, Number(sortOrder) || 0, actorId ?? null, actorId ?? null, t, t
    );
    return getPortalWikiById(Number(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Artigo wiki já existe para este jogo/slug.', 409);
    }
    throw e;
  }
}

export function updatePortalWiki(id, { gameId, slug, title, description, bodyMd, published, sortOrder, actorId }) {
  const existing = getPortalWikiById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Artigo wiki não encontrado.', 404);
  const t = now();
  const next = {
    gameId: gameId !== undefined ? String(gameId).trim() : existing.gameId,
    slug: slug !== undefined ? slugify(slug, existing.slug) : existing.slug,
    title: title !== undefined ? String(title).trim() : existing.title,
    description: description !== undefined ? String(description).slice(0, 500) : existing.description,
    bodyMd: bodyMd !== undefined ? String(bodyMd).slice(0, 200000) : existing.bodyMd,
    published: published !== undefined ? !!published : existing.published,
    sortOrder: sortOrder !== undefined ? Number(sortOrder) || 0 : existing.sortOrder
  };
  if (!next.gameId || !next.title) throw new ApiError('INVALID_INPUT', 'gameId e título obrigatórios.', 400);
  try {
    db.prepare(
      `UPDATE portal_wiki_articles SET game_id=?, slug=?, title=?, description=?, body_md=?,
        published=?, sort_order=?, updated_by=?, updated_at=? WHERE id=?`
    ).run(
      next.gameId, next.slug, next.title, next.description, next.bodyMd,
      next.published ? 1 : 0, next.sortOrder, actorId ?? null, t, Number(id)
    );
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Artigo wiki já existe para este jogo/slug.', 409);
    }
    throw e;
  }
  return getPortalWikiById(id);
}

export function deletePortalWiki(id) {
  const existing = getPortalWikiById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Artigo wiki não encontrado.', 404);
  db.prepare('DELETE FROM portal_wiki_articles WHERE id=?').run(Number(id));
  return existing;
}

function mapAchievement(r) {
  if (!r) return null;
  return {
    id: r.id,
    key: r.achievement_key,
    gameId: r.game_id,
    name: r.name,
    description: r.description || '',
    legacyTier: r.legacy_tier ?? null,
    secret: !!r.secret,
    published: !!r.published,
    sortOrder: r.sort_order ?? 0,
    createdBy: r.created_by ?? null,
    updatedBy: r.updated_by ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function listPortalAchievements({ gameId, publishedOnly = false, limit = 200, offset = 0 } = {}) {
  const lim = intInRange(limit, 1, 500, 'INVALID_INPUT', 'limit');
  const off = intInRange(offset, 0, 1e9, 'INVALID_INPUT', 'offset');
  const where = [];
  const params = [];
  if (gameId) { where.push('game_id = ?'); params.push(String(gameId)); }
  if (publishedOnly) where.push('published = 1');
  const sqlWhere = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.prepare(
    `SELECT * FROM portal_achievements ${sqlWhere}
     ORDER BY sort_order ASC, name ASC LIMIT ? OFFSET ?`
  ).all(...params, lim, off).map(mapAchievement);
}

export function getPortalAchievementById(id) {
  return mapAchievement(db.prepare('SELECT * FROM portal_achievements WHERE id=?').get(Number(id)));
}

export function createPortalAchievement({ key, gameId, name, description = '', legacyTier = null, secret = false, published = true, sortOrder = 0, actorId }) {
  const tName = String(name ?? '').trim();
  const g = String(gameId ?? '').trim();
  if (!tName) throw new ApiError('INVALID_INPUT', 'Nome obrigatório.', 400);
  if (!g) throw new ApiError('INVALID_INPUT', 'gameId obrigatório.', 400);
  const finalKey = slugify(key || `${g}-${tName}`, 'ach');
  const t = now();
  try {
    const info = db.prepare(
      `INSERT INTO portal_achievements
        (achievement_key, game_id, name, description, legacy_tier, secret, published, sort_order,
         created_by, updated_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      finalKey, g, tName, String(description).slice(0, 1000), legacyTier ?? null,
      secret ? 1 : 0, published ? 1 : 0, Number(sortOrder) || 0,
      actorId ?? null, actorId ?? null, t, t
    );
    return getPortalAchievementById(Number(info.lastInsertRowid));
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Chave de conquista já existe.', 409);
    }
    throw e;
  }
}

export function updatePortalAchievement(id, { key, gameId, name, description, legacyTier, secret, published, sortOrder, actorId }) {
  const existing = getPortalAchievementById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Conquista não encontrada.', 404);
  const t = now();
  const next = {
    key: key !== undefined ? slugify(key, existing.key) : existing.key,
    gameId: gameId !== undefined ? String(gameId).trim() : existing.gameId,
    name: name !== undefined ? String(name).trim() : existing.name,
    description: description !== undefined ? String(description).slice(0, 1000) : existing.description,
    legacyTier: legacyTier !== undefined ? legacyTier : existing.legacyTier,
    secret: secret !== undefined ? !!secret : existing.secret,
    published: published !== undefined ? !!published : existing.published,
    sortOrder: sortOrder !== undefined ? Number(sortOrder) || 0 : existing.sortOrder
  };
  if (!next.name || !next.gameId) throw new ApiError('INVALID_INPUT', 'Nome e gameId obrigatórios.', 400);
  try {
    db.prepare(
      `UPDATE portal_achievements SET achievement_key=?, game_id=?, name=?, description=?, legacy_tier=?,
        secret=?, published=?, sort_order=?, updated_by=?, updated_at=? WHERE id=?`
    ).run(
      next.key, next.gameId, next.name, next.description, next.legacyTier,
      next.secret ? 1 : 0, next.published ? 1 : 0, next.sortOrder,
      actorId ?? null, t, Number(id)
    );
  } catch (e) {
    if (String(e.message || e).includes('UNIQUE')) {
      throw new ApiError('CONFLICT', 'Chave de conquista já existe.', 409);
    }
    throw e;
  }
  return getPortalAchievementById(id);
}

export function deletePortalAchievement(id) {
  const existing = getPortalAchievementById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Conquista não encontrada.', 404);
  db.prepare('DELETE FROM portal_achievements WHERE id=?').run(Number(id));
  return existing;
}
