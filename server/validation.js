const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;
const RESERVED = new Set(['admin-console', 'root-console', 'support', 'moderation', 'system', 'null', 'undefined', 'capyquake']);

// Cargos do Capyquake em ordem hierárquica (rank crescente = mais autoridade).
// king é a autoridade máxima; best_capybara só visualiza o painel.
export const ROLES = [
  'visitante', 'citizen', 'cool', 'hazbin', 'friend',
  'custom', 'best_capybara', 'developer', 'admin', 'head_admin', 'co_king', 'king'
];

export const ROLE_RANK = {
  visitante: 0,
  citizen: 1,
  cool: 2,
  hazbin: 3,
  friend: 4,
  custom: 5,
  best_capybara: 6,
  developer: 7,
  admin: 8,
  head_admin: 9,
  co_king: 10,
  king: 11
};

export const ROLE_LABELS = {
  king: '👑 Capybara_King',
  co_king: '💖 Capybara Co-King',
  head_admin: '👑 Capybara Head Admin',
  admin: '🛠️ Capybara Admin',
  developer: '💻 Capybara Developer',
  best_capybara: '✨ The Best Capybara',
  custom: '⚙️ Custom',
  friend: '🦫 Capybara Friend',
  hazbin: '🔥 Hazbin Hotel',
  cool: '🦫🕶️ Capybara Cool',
  citizen: '🦫 Capybara Citizen',
  visitante: '👤 Visitante'
};

// Cargos que podem VISUALIZAR o painel administrativo.
export const ADMIN_VIEW_ROLES = ['best_capybara', 'developer', 'admin', 'head_admin', 'co_king', 'king'];
// Cargos que podem EXECUTAR ações administrativas.
export const ADMIN_ACTION_ROLES = ['developer', 'admin', 'head_admin', 'co_king', 'king'];

export class ApiError extends Error {
  constructor(code, message, httpStatus = 400) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export function validateUsername(raw) {
  const username = String(raw ?? '').trim();
  if (!username) throw new ApiError('INVALID_USERNAME', 'Informe um username.');
  if (username.length < 3) throw new ApiError('INVALID_USERNAME', 'Username deve ter no mínimo 3 caracteres.');
  if (username.length > 24) throw new ApiError('INVALID_USERNAME', 'Username deve ter no máximo 24 caracteres.');
  if (!USERNAME_RE.test(username)) throw new ApiError('INVALID_USERNAME', 'Use apenas letras, números, - e _.');
  if (RESERVED.has(username.toLowerCase())) throw new ApiError('INVALID_USERNAME', 'Username reservado.');
  return username;
}

export function validatePassword(password, { min = 8 } = {}) {
  const p = String(password ?? '');
  if (!p) throw new ApiError('INVALID_PASSWORD', 'Informe uma senha.');
  if (p.length < min) throw new ApiError('INVALID_PASSWORD', `Senha deve ter no mínimo ${min} caracteres.`);
  if (p.length > 128) throw new ApiError('INVALID_PASSWORD', 'Senha muito longa.');
  return p;
}

export function requireRole(role) {
  if (!ROLES.includes(role)) throw new ApiError('INVALID_INPUT', 'Cargo inválido.', 400);
  return role;
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

// Compatibilidade com contas antigas (roles legados do sistema anterior).
export function normalizeLegacyRole(role) {
  switch (role) {
    case 'owner': return 'king';
    case 'admin': return 'head_admin';
    case 'moderator': return 'developer';
    case 'player': return 'citizen';
    default: return ROLES.includes(role) ? role : 'citizen';
  }
}
