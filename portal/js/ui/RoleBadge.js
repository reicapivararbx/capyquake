import { isStaff, roleLabel, roleTone } from '../core/roles.js';

/**
 * Distinct badge for staff/admin/dev vs normal players.
 * @param {string|null|undefined} role
 * @param {{ compact?: boolean }} [opts]
 * @returns {HTMLElement|null} null for plain player roles when compact
 */
export function renderRoleBadge(role, opts = {}) {
  if (!role) return null;
  const staff = isStaff(role);
  if (!staff && opts.compact) return null;

  const el = document.createElement('span');
  const tone = roleTone(role);
  el.className = `role-badge role-badge--${tone}`;
  el.textContent = roleLabel(role);
  el.title = staff
    ? 'Conta da equipe — acesso distinto de jogadores comuns'
    : 'Conta de jogador';
  if (staff) el.dataset.staff = 'true';
  return el;
}
