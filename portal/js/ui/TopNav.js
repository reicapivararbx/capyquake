/**
 * Top navigation + mobile drawer + auth/staff slot.
 */

import { displayNameOf } from '../services/auth.js';
import { ADMIN_HREF, canViewAdmin, isStaff } from '../core/roles.js';
import { features } from '../core/features.js';
import { renderUserAvatar } from './UserAvatar.js';
import { renderRoleBadge } from './RoleBadge.js';

const NAV_LINKS = Object.freeze([
  Object.freeze({ href: '/', label: 'Início', id: 'home', match: (p) => p === '/' || p === '' }),
  Object.freeze({ href: '/jogos', label: 'Jogos', id: 'games', match: (p) => p.startsWith('/jogos') }),
  Object.freeze({
    href: '/servidores',
    label: 'Servidores',
    id: 'servers',
    match: (p) => p.includes('servidores'),
  }),
  Object.freeze({ href: '/wiki', label: 'Wiki', id: 'wiki', match: (p) => p.startsWith('/wiki') }),
  Object.freeze({
    href: '/conquistas',
    label: 'Conquistas',
    id: 'achievements',
    match: (p) => p.includes('conquistas'),
  }),
  Object.freeze({
    href: '/novidades',
    label: 'Novidades',
    id: 'news',
    match: (p) => p.startsWith('/novidades'),
  }),
]);

/**
 * @param {{
 *   onlineCount?: number,
 *   currentPath?: string,
 *   account?: import('../services/auth.js').Account|null,
 *   onLogin?: () => void,
 *   onProfile?: () => void,
 *   onSearch?: () => void,
 * }} [opts]
 * @returns {HTMLElement}
 */
export function renderTopNav(opts = {}) {
  const onlineCount = opts.onlineCount ?? 0;
  const currentPath = opts.currentPath ?? '/';
  const account = opts.account ?? null;

  const header = document.createElement('header');
  header.className = 'topnav';
  header.setAttribute('role', 'banner');

  const inner = document.createElement('div');
  inner.className = 'shell topnav__inner';

  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className = 'topnav__icon-btn topnav__menu-btn';
  menuBtn.setAttribute('aria-label', 'Abrir menu');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'mobile-nav');
  menuBtn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  const brand = document.createElement('a');
  brand.className = 'topnav__brand';
  brand.href = '/';
  brand.setAttribute('aria-label', 'Capy — início');
  brand.innerHTML = '<span class="topnav__mark">CP</span><span>CAPY</span>';

  const nav = document.createElement('nav');
  nav.className = 'topnav__links';
  nav.setAttribute('aria-label', 'Navegação principal');

  for (const link of NAV_LINKS) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (link.match(currentPath)) a.setAttribute('aria-current', 'page');
    nav.append(a);
  }

  const actions = document.createElement('div');
  actions.className = 'topnav__actions';

  if (onlineCount > 0) {
    const pill = document.createElement('span');
    pill.className = 'topnav__status';
    pill.innerHTML = `<span class="topnav__status-dot" aria-hidden="true"></span> ${onlineCount} JOGOS ONLINE`;
    actions.append(pill);
  }

  const search = document.createElement('button');
  search.type = 'button';
  search.className = 'topnav__search';
  if (features.search && opts.onSearch) {
    search.setAttribute('aria-label', 'Buscar');
    search.title = 'Buscar (Ctrl+K)';
    search.textContent = 'Buscar jogos, guias…';
    search.addEventListener('click', () => opts.onSearch?.());
  } else {
    search.setAttribute('aria-label', 'Buscar (em breve)');
    search.disabled = true;
    search.title = 'Busca em breve';
    search.textContent = 'Buscar jogos, guias…';
  }

  const notif = document.createElement('button');
  notif.type = 'button';
  notif.className = 'topnav__icon-btn';
  notif.setAttribute('aria-label', 'Notificações (em breve)');
  notif.disabled = true;
  notif.title = 'Notificações em breve';
  notif.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"/><path d="M9 17a3 3 0 0 0 6 0"/></svg>';

  actions.append(search, notif);
  actions.append(renderAuthSlot(account, opts));

  inner.append(menuBtn, brand, nav, actions);
  header.append(inner);

  const mobile = buildMobileNav(currentPath, account, opts);
  header.append(mobile);

  menuBtn.addEventListener('click', () => openMobile(mobile, menuBtn, true));
  mobile
    .querySelector('[data-close-mobile]')
    ?.addEventListener('click', () => openMobile(mobile, menuBtn, false));
  mobile
    .querySelector('.mobile-nav__backdrop')
    ?.addEventListener('click', () => openMobile(mobile, menuBtn, false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
      openMobile(mobile, menuBtn, false);
    }
  });

  return header;
}

/**
 * @param {import('../services/auth.js').Account|null} account
 * @param {{ onLogin?: () => void, onProfile?: () => void }} opts
 * @returns {HTMLElement}
 */
function renderAuthSlot(account, opts) {
  const wrap = document.createElement('div');
  wrap.className = 'topnav__auth';

  const user = account?.user;
  if (!user) {
    const login = document.createElement('button');
    login.type = 'button';
    login.className = 'topnav__login';
    login.textContent = 'Entrar';
    login.title = 'Entrar com conta Capyquake';
    login.addEventListener('click', () => opts.onLogin?.());
    wrap.append(login);
    return wrap;
  }

  const staff = isStaff(user.role);
  const name = displayNameOf(user);

  if (canViewAdmin(user.role)) {
    const admin = document.createElement('a');
    admin.className = 'topnav__admin';
    admin.href = ADMIN_HREF;
    admin.textContent = 'Admin';
    admin.title = 'Painel administrativo — conta da equipe';
    wrap.append(admin);
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'topnav__user';
  if (staff) btn.classList.add('topnav__user--staff');
  btn.setAttribute('aria-label', `Perfil de ${name}`);
  btn.title = staff
    ? `${name} · equipe (${user.role})`
    : `${name} · jogador`;
  btn.append(renderUserAvatar({ name, size: 'sm', staff }));

  const label = document.createElement('span');
  label.className = 'topnav__user-name';
  label.textContent = name;
  btn.append(label);

  const badge = renderRoleBadge(user.role, { compact: true });
  if (badge) {
    badge.classList.add('role-badge--nav');
    btn.append(badge);
  }

  btn.addEventListener('click', () => opts.onProfile?.());
  wrap.append(btn);
  return wrap;
}

/**
 * @param {HTMLElement} mobile
 * @param {HTMLButtonElement} menuBtn
 * @param {boolean} open
 */
function openMobile(mobile, menuBtn, open) {
  mobile.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}

/**
 * @param {string} currentPath
 * @param {import('../services/auth.js').Account|null} account
 * @param {{ onLogin?: () => void, onProfile?: () => void }} opts
 * @returns {HTMLElement}
 */
function buildMobileNav(currentPath, account, opts) {
  const root = document.createElement('div');
  root.className = 'mobile-nav';
  root.id = 'mobile-nav';
  root.setAttribute('aria-hidden', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-nav__backdrop';

  const panel = document.createElement('div');
  panel.className = 'mobile-nav__panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Menu');

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'mobile-nav__close';
  close.setAttribute('aria-label', 'Fechar menu');
  close.dataset.closeMobile = '';
  close.textContent = '×';

  panel.append(close);

  for (const link of NAV_LINKS) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (link.match(currentPath)) a.setAttribute('aria-current', 'page');
    a.addEventListener('click', () => {
      root.classList.remove('is-open');
      document.body.style.overflow = '';
    });
    panel.append(a);
  }

  if (account?.user && canViewAdmin(account.user.role)) {
    const admin = document.createElement('a');
    admin.href = ADMIN_HREF;
    admin.textContent = 'Painel admin';
    admin.className = 'mobile-nav__staff';
    panel.append(admin);
  }

  if (account?.user) {
    const profile = document.createElement('button');
    profile.type = 'button';
    profile.className = 'mobile-nav__btn';
    profile.textContent = `Perfil · ${displayNameOf(account.user)}`;
    profile.addEventListener('click', () => {
      root.classList.remove('is-open');
      document.body.style.overflow = '';
      opts.onProfile?.();
    });
    panel.append(profile);
  } else {
    const login = document.createElement('button');
    login.type = 'button';
    login.className = 'mobile-nav__btn';
    login.textContent = 'Entrar';
    login.addEventListener('click', () => {
      root.classList.remove('is-open');
      document.body.style.overflow = '';
      opts.onLogin?.();
    });
    panel.append(login);
  }

  root.append(backdrop, panel);

  const obs = new MutationObserver(() => {
    root.setAttribute('aria-hidden', root.classList.contains('is-open') ? 'false' : 'true');
  });
  obs.observe(root, { attributes: true, attributeFilter: ['class'] });

  return root;
}
