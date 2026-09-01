/**
 * @param {{ name?: string, size?: 'sm'|'md'|'lg', staff?: boolean }} opts
 * @returns {HTMLElement}
 */
export function renderUserAvatar(opts = {}) {
  const size = opts.size || 'md';
  const name = (opts.name || 'Jogador').trim() || 'Jogador';
  const initials = initialsOf(name);

  const el = document.createElement('span');
  el.className = `user-avatar user-avatar--${size}`;
  if (opts.staff) el.classList.add('user-avatar--staff');
  el.setAttribute('aria-hidden', 'true');
  el.textContent = initials;
  el.title = name;
  return el;
}

/**
 * @param {string} name
 * @returns {string}
 */
function initialsOf(name) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}
