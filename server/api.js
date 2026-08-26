import { db } from './db.js';
import { env } from './env.js';
import { verifyPassword } from './passwords.js';
import { hit } from './ratelimit.js';
import {
  createUser, authenticate, resolveSession, revokeSession, createSession,
  createAdminCodeSession, getUserById, getFullAccount, reportMatch, updateCapybara, getCapybara,
  giveCoins, setCoins, giveTokens, setTokens, giveXp, setXp, setLevel, levelUp,
  addItemToInventory, removeItemFromInventory, getInventory, maxStats, heal,
  banUser, suspendUser, unbanUser, changeRole, resetPlayer, logAdminAction,
  listLogs, listTransactions, searchUsers, dashboardStats, countUsers, getItemsCatalog,
  changeOwnPassword, adminSetPassword, revokeTargetSessions
} from './services.js';
import { ApiError, ROLE_RANK, ROLES, ROLE_LABELS, ADMIN_VIEW_ROLES } from './validation.js';

// Permissões por cargo. best_capybara visualiza tudo, mas não pode executar ações.
const VIEW_PERMS = ['admin.view', 'users.view', 'game.view', 'inventory.view', 'economy.view'];
export const PERMISSIONS = {
  visitante: [],
  citizen: [],
  cool: [],
  hazbin: [],
  friend: [],
  // ✨ The Best Capybara: somente visualização.
  best_capybara: [...VIEW_PERMS],
  developer: [...VIEW_PERMS,
    'admin.logs', 'game.heal',
    'users.suspend', 'users.ban', 'users.create', 'users.password',
    'economy.give', 'economy.remove', 'economy.set',
    'inventory.give', 'inventory.remove',
    'game.giveXp', 'game.setLevel', 'game.levelUp', 'game.maxStats', 'game.reset', 'game.giveAll'],
  admin: [...VIEW_PERMS,
    'admin.logs', 'game.heal',
    'users.suspend', 'users.ban', 'users.create', 'users.password',
    'economy.give', 'economy.remove', 'economy.set',
    'inventory.give', 'inventory.remove',
    'game.giveXp', 'game.setLevel', 'game.levelUp', 'game.maxStats', 'game.reset', 'game.giveAll'],
  head_admin: [...VIEW_PERMS,
    'admin.logs', 'game.heal',
    'users.suspend', 'users.ban', 'users.create', 'users.password',
    'economy.give', 'economy.remove', 'economy.set',
    'inventory.give', 'inventory.remove',
    'game.giveXp', 'game.setLevel', 'game.levelUp', 'game.maxStats', 'game.reset', 'game.giveAll',
    'roles.manage'],
  co_king: [...VIEW_PERMS,
    'admin.logs', 'game.heal',
    'users.suspend', 'users.ban', 'users.create', 'users.password',
    'economy.give', 'economy.remove', 'economy.set',
    'inventory.give', 'inventory.remove',
    'game.giveXp', 'game.setLevel', 'game.levelUp', 'game.maxStats', 'game.reset', 'game.giveAll',
    'roles.manage'],
  king: ['*']
};

export function hasPermission(user, perm) {
  const perms = PERMISSIONS[user?.role] || [];
  return perms.includes('*') || perms.includes(perm);
}

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
    db.prepare('INSERT INTO capybaras (user_id, updated_at) VALUES (?, ?)').run(id, t);
    console.log(`[auth] conta administrativa '${env.adminUsername}' criada.`);
  } else if (existing.role !== 'king' || !verifyPassword(env.adminPassword, existing.password_hash)) {
    db.prepare("UPDATE users SET role='king', password_hash=?, updated_at=? WHERE id=?")
      .run(hashPassword(env.adminPassword), Date.now(), existing.id);
    console.log('[auth] credenciais da conta administrativa sincronizadas com o ambiente.');
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

    // ---- game sync ----
    if (pathname === '/api/game/report' && method === 'POST') {
      const user = requireAuth(req);
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
        return json(res, 200, { success: true, user: admin, permissions: PERMISSIONS[admin.role], canAct: hasPermission(admin, 'users.view') && PERMISSIONS[admin.role].some(p => !VIEW_PERMS.includes(p) || p === 'roles.manage') });
      }

      const idemKey = req.headers['idempotency-key'];
      const mutate = (fn) => withIdempotency(req, idemKey, fn);

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
        const user = mutate(() => createUser({ username: b.username, password: b.password, displayName: b.displayName, role }));
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
            const u = mutate(() => changeRole(actor, targetId, String(b.role), b.reason));
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
