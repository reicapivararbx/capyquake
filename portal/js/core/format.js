/**
 * pt-BR formatting helpers for the portal.
 */

const rtf =
  typeof Intl !== 'undefined' && Intl.RelativeTimeFormat
    ? new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
    : null;

/**
 * @param {number} n
 * @param {number} [digits]
 * @returns {string}
 */
export function formatNumber(n, digits = 0) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Unlock rate for rarity display (e.g. 0,7%).
 * @param {number} rate
 * @returns {string}
 */
export function formatPercent(rate) {
  const v = Number(rate);
  if (!Number.isFinite(v)) return '—';
  const digits = v < 1 ? 2 : v < 10 ? 1 : 0;
  return `${formatNumber(v, digits)}%`;
}

/**
 * @param {string|number|Date|null|undefined} input
 * @returns {string}
 */
export function formatDate(input) {
  if (input == null || input === '') return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Relative time in Portuguese when possible.
 * @param {string|number|Date|null|undefined} input
 * @returns {string}
 */
export function formatRelative(input) {
  if (input == null || input === '') return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (!rtf) return formatDate(d);
  if (abs < 60) return rtf.format(Math.sign(diffSec) * Math.round(diffSec), 'second');
  if (abs < 3600) return rtf.format(Math.sign(diffSec) * Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.sign(diffSec) * Math.round(diffSec / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.sign(diffSec) * Math.round(diffSec / 86400), 'day');
  return formatDate(d);
}

/**
 * @param {string} s
 * @returns {string}
 */
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
