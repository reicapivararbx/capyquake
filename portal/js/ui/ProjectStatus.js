/**
 * Reusable project status badge (text + color, never color alone).
 * @typedef {'online' | 'development' | 'coming_soon' | 'maintenance' | 'offline'} ProjectStatus
 */

/** @type {Readonly<Record<ProjectStatus, string>>} */
const LABELS = Object.freeze({
  online: 'Online',
  development: 'Em desenvolvimento',
  coming_soon: 'Em breve',
  maintenance: 'Manutenção',
  offline: 'Offline',
});

/**
 * @param {ProjectStatus} status
 * @returns {string}
 */
export function statusLabel(status) {
  return LABELS[status] ?? LABELS.offline;
}

/**
 * @param {ProjectStatus} status
 * @returns {HTMLElement}
 */
export function renderProjectStatus(status) {
  const safe = status in LABELS ? status : 'offline';
  const el = document.createElement('span');
  el.className = `status-badge status-badge--${safe}`;
  el.setAttribute('role', 'status');

  const dot = document.createElement('span');
  dot.className = 'status-badge__dot';
  dot.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.textContent = statusLabel(/** @type {ProjectStatus} */ (safe));

  el.append(dot, text);
  return el;
}
