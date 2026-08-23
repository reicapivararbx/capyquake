const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;
const RESERVED = new Set(['admin-console', 'root-console', 'support', 'moderation', 'system', 'null', 'undefined', 'capyquake']);
export const ROLES = ['player', 'moderator', 'admin', 'owner'];
export const ROLE_RANK = { player: 0, moderator: 1, admin: 2, owner: 3 };

export class ApiError extends Error {
  constructor(code, message, httpStatus = 400) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export function validateUsername(raw) {
  const username = String(raw ?? '').trim();
  if (username.length < 3) throw new ApiError('INVALID_USERNAME', 'Username deve ter no mínimo 3 caracteres.');
  if (username.length > 24) throw new ApiError('INVALID_USERNAME', 'Username deve ter no máximo 24 caracteres.');
  if (!USERNAME_RE.test(username)) throw new ApiError('INVALID_USERNAME', 'Use apenas letras, números, - e _.');
  if (RESERVED.has(username.toLowerCase())) throw new ApiError('INVALID_USERNAME', 'Username reservado.');
  return username;
}

export function validatePassword(password, { min = 8 } = {}) {
  const p = String(password ?? '');
  if (p.length < min) throw new ApiError('INVALID_PASSWORD', `Senha deve ter no mínimo ${min} caracteres.`);
  if (p.length > 128) throw new ApiError('INVALID_PASSWORD', 'Senha muito longa.');
  return p;
}

export function intInRange(value, min, max, code, message) {
  const n = Number(value);
  if (!Number.isSafeInteger(n)) throw new ApiError(code, message);
  if (n < min || n > max) throw new ApiError(code, `${message} (entre ${min} e ${max}).`);
  return n;
}

export function requireString(value, field, maxLen = 200) {
  const s = String(value ?? '').trim();
  if (!s) throw new ApiError('INVALID_INPUT', `Campo ${field} obrigatório.`);
  if (s.length > maxLen) throw new ApiError('INVALID_INPUT', `Campo ${field} muito longo.`);
  return s;
}
