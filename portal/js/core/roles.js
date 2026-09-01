/**
 * Staff / admin roles — must stay distinct from normal player accounts.
 * Mirrors server ADMIN_VIEW_ROLES / ADMIN_ACTION_ROLES + ROLE_LABELS.
 */

/** Roles that can open the admin panel (view). */
export const ADMIN_VIEW_ROLES = Object.freeze([
  'best_capybara',
  'developer',
  'admin',
  'head_admin',
  'co_king',
  'king',
]);

/** Roles that can execute admin actions (not view-only). */
export const ADMIN_ACTION_ROLES = Object.freeze([
  'developer',
  'admin',
  'head_admin',
  'co_king',
  'king',
]);

/** @type {Readonly<Record<string, string>>} */
export const ROLE_LABELS = Object.freeze({
  king: 'Capybara King',
  co_king: 'Capybara Co-King',
  head_admin: 'Capybara Head Admin',
  admin: 'Capybara Admin',
  developer: 'Capybara Developer',
  best_capybara: 'The Best Capybara',
  custom: 'Custom',
  friend: 'Capybara Friend',
  hazbin: 'Hazbin Hotel',
  cool: 'Capybara Cool',
  citizen: 'Capybara Citizen',
  visitante: 'Visitante',
});

/**
 * @param {string|null|undefined} role
 * @returns {boolean}
 */
export function canViewAdmin(role) {
  return Boolean(role && ADMIN_VIEW_ROLES.includes(role));
}

/**
 * @param {string|null|undefined} role
 * @returns {boolean}
 */
export function canActAdmin(role) {
  return Boolean(role && ADMIN_ACTION_ROLES.includes(role));
}

/**
 * Staff = elevated beyond normal player cosmetics (includes view-only Best Capybara).
 * @param {string|null|undefined} role
 * @returns {boolean}
 */
export function isStaff(role) {
  return canViewAdmin(role);
}

/**
 * @param {string|null|undefined} role
 * @returns {string}
 */
export function roleLabel(role) {
  if (!role) return ROLE_LABELS.visitante;
  return ROLE_LABELS[role] || role;
}

/**
 * Visual tone for badges.
 * @param {string|null|undefined} role
 * @returns {'king'|'admin'|'dev'|'staff'|'player'}
 */
export function roleTone(role) {
  if (!role) return 'player';
  if (role === 'king' || role === 'co_king') return 'king';
  if (role === 'head_admin' || role === 'admin') return 'admin';
  if (role === 'developer') return 'dev';
  if (canViewAdmin(role)) return 'staff';
  return 'player';
}

/** Admin panel entry (existing Capyquake admin UI). */
export const ADMIN_HREF = '/admin/';
