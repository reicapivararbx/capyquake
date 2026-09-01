/**
 * Lightweight hash-free path router for portal SPA.
 * Real game routes (/capyquake/, /capyrails/, …) are full navigations — not handled here.
 */

/**
 * @typedef {{
 *   name: string,
 *   path: string,
 *   params: Record<string, string>,
 *   query: URLSearchParams,
 * }} Route
 */

/** @type {Array<{ name: string, pattern: RegExp, keys: string[] }>} */
const ROUTES = [
  { name: 'home', pattern: /^\/$/, keys: [] },
  { name: 'games', pattern: /^\/jogos\/?$/, keys: [] },
  { name: 'game', pattern: /^\/jogos\/([^/]+)\/?$/, keys: ['gameId'] },
  { name: 'servers', pattern: /^\/servidores\/?$/, keys: [] },
  { name: 'game-servers', pattern: /^\/([^/]+)\/servidores\/?$/, keys: ['gameId'] },
  { name: 'achievements', pattern: /^\/conquistas\/?$/, keys: [] },
  { name: 'game-achievements', pattern: /^\/([^/]+)\/conquistas\/?$/, keys: ['gameId'] },
  { name: 'wiki', pattern: /^\/wiki\/?$/, keys: [] },
  { name: 'wiki-article', pattern: /^\/wiki\/([^/]+)\/([^/]+)\/?$/, keys: ['gameId', 'slug'] },
  { name: 'wiki-game', pattern: /^\/wiki\/([^/]+)\/?$/, keys: ['gameId'] },
  { name: 'news', pattern: /^\/novidades\/?$/, keys: [] },
  { name: 'news-item', pattern: /^\/novidades\/([^/]+)\/?$/, keys: ['slug'] },
  { name: 'profile', pattern: /^\/perfil\/?$/, keys: [] },
  { name: 'user', pattern: /^\/u\/([^/]+)\/?$/, keys: ['username'] },
  { name: 'friends', pattern: /^\/amigos\/?$/, keys: [] },
];

/**
 * @returns {string}
 */
function currentPathname() {
  return typeof location !== 'undefined' ? location.pathname : '/';
}

/**
 * @returns {string}
 */
function currentSearch() {
  return typeof location !== 'undefined' ? location.search || '' : '';
}

/**
 * @param {string} [pathname]
 * @returns {Route}
 */
export function matchRoute(pathname) {
  let path = pathname !== undefined && pathname !== null ? pathname : currentPathname();
  path = path || '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (path === '') path = '/';

  // Normalize trailing for home
  const normalized = path === '' ? '/' : path;
  const check = normalized === '/' ? '/' : normalized.replace(/\/$/, '') || '/';
  // Re-add trailing optional: test both
  const candidates = check === '/' ? ['/'] : [check, `${check}/`];
  const query = new URLSearchParams(currentSearch());

  for (const cand of candidates) {
    for (const r of ROUTES) {
      const m = cand.match(r.pattern);
      if (!m) continue;
      /** @type {Record<string, string>} */
      const params = {};
      r.keys.forEach((k, i) => {
        params[k] = decodeURIComponent(m[i + 1] || '');
      });
      return {
        name: r.name,
        path: cand,
        params,
        query,
      };
    }
  }

  return {
    name: 'not-found',
    path: pathname ?? path,
    params: {},
    query,
  };
}

/**
 * @param {string} href
 * @param {{ replace?: boolean }} [opts]
 */
export function navigate(href, opts = {}) {
  const url = new URL(href, location.origin);
  // External / other apps: full load
  if (isForeignPath(url.pathname)) {
    location.href = url.pathname + url.search + url.hash;
    return;
  }
  if (opts.replace) {
    history.replaceState({}, '', url.pathname + url.search + url.hash);
  } else {
    history.pushState({}, '', url.pathname + url.search + url.hash);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const GAME_SPA_OVERLAY =
  /^\/(capyquake|capyrails|capyzen|find-the-markers)\/(servidores|conquistas)\/?$/;

/**
 * Paths that belong to real game apps / API — never SPA-intercept.
 * @param {string} pathname
 */
export function isForeignPath(pathname) {
  const p = pathname || '';
  if (GAME_SPA_OVERLAY.test(p)) return false;
  return (
    p.startsWith('/capyquake') ||
    p.startsWith('/capyrails') ||
    p.startsWith('/railsgame') ||
    p.startsWith('/capyzen') ||
    p.startsWith('/find-the-markers') ||
    p.startsWith('/api/') ||
    p.startsWith('/ws') ||
    p.startsWith('/admin') ||
    p.startsWith('/assets/') ||
    p.startsWith('/capy-portal/') ||
    p.startsWith('/gamerails')
  );
}

/**
 * @param {MouseEvent} e
 * @returns {boolean} true if handled
 */
export function handleLinkClick(e) {
  if (e.defaultPrevented) return false;
  if (e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
  if (!a) return false;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  if (a.target === '_blank' || a.hasAttribute('download')) return false;
  let url;
  try {
    url = new URL(href, location.origin);
  } catch {
    return false;
  }
  if (url.origin !== location.origin) return false;
  if (isForeignPath(url.pathname)) return false;
  e.preventDefault();
  navigate(url.pathname + url.search + url.hash);
  return true;
}

/**
 * @param {(route: Route) => void} onChange
 * @returns {() => void} unbind
 */
export function startRouter(onChange) {
  const run = () => onChange(matchRoute());
  window.addEventListener('popstate', run);
  document.addEventListener('click', handleLinkClick);
  run();
  return () => {
    window.removeEventListener('popstate', run);
    document.removeEventListener('click', handleLinkClick);
  };
}

/**
 * Title helper.
 * @param {string} page
 */
export function setTitle(page) {
  document.title = page ? `${page} — Capy` : 'Capy — Jogos e mundos';
}
