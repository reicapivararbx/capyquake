/**
 * @param {{ title: string, body?: string, actionHref?: string, actionLabel?: string }} opts
 * @returns {HTMLElement}
 */
export function renderEmptyState(opts) {
  const el = document.createElement('div');
  el.className = 'empty-state';
  el.setAttribute('role', 'status');

  const strong = document.createElement('strong');
  strong.textContent = opts.title;
  el.append(strong);

  if (opts.body) {
    const p = document.createElement('p');
    p.textContent = opts.body;
    el.append(p);
  }

  if (opts.actionHref && opts.actionLabel) {
    const a = document.createElement('a');
    a.className = 'btn btn--sm';
    a.href = opts.actionHref;
    a.textContent = opts.actionLabel;
    a.style.marginTop = '12px';
    el.append(a);
  }

  return el;
}
