import { displayNameOf, logout } from '../services/auth.js';
import { ADMIN_HREF, canViewAdmin, isStaff, roleLabel } from '../core/roles.js';
import { formatNumber } from '../core/format.js';
import { renderUserAvatar } from './UserAvatar.js';
import { renderRoleBadge } from './RoleBadge.js';
import { features } from '../core/features.js';
import { navigate } from '../core/router.js';

/**
 * Right-side profile drawer.
 * @param {{ onLoginRequest?: () => void, onChange?: () => void }} [opts]
 * @returns {{
 *   root: HTMLElement,
 *   open: (account: import('../services/auth.js').Account|null) => void,
 *   close: () => void,
 *   isOpen: () => boolean,
 *   update: (account: import('../services/auth.js').Account|null) => void,
 * }}
 */
export function createProfileDrawer(opts = {}) {
  /** @type {Element|null} */
  let lastFocus = null;
  /** @type {import('../services/auth.js').Account|null} */
  let current = null;

  const root = document.createElement('div');
  root.className = 'profile-drawer-root';
  root.hidden = true;
  root.innerHTML = `
    <div class="profile-overlay" data-close tabindex="-1"></div>
    <aside class="profile-drawer" role="dialog" aria-modal="true" aria-labelledby="pd-name" tabindex="-1">
      <button type="button" class="profile-drawer__close" data-close aria-label="Fechar">×</button>
      <div class="profile-drawer__scroll" data-body></div>
    </aside>
  `;

  const body = root.querySelector('[data-body]');
  const panel = root.querySelector('.profile-drawer');

  function isOpen() {
    return !root.hidden;
  }

  function open(account) {
    lastFocus = document.activeElement;
    current = account;
    renderBody(account);
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => panel?.focus());
  }

  function close() {
    root.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  function update(account) {
    current = account;
    if (isOpen()) renderBody(account);
  }

  /**
   * @param {import('../services/auth.js').Account|null} account
   */
  function renderBody(account) {
    body.replaceChildren();

    if (!account?.user) {
      const empty = document.createElement('div');
      empty.className = 'profile-drawer__guest';
      empty.innerHTML = `
        <h2 id="pd-name">Sua conta</h2>
        <p>Entre com a conta do Capyquake para ver perfil, estatísticas e atalhos da equipe.</p>
      `;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--primary btn--block';
      btn.textContent = 'Entrar';
      btn.addEventListener('click', () => {
        close();
        opts.onLoginRequest?.();
      });
      empty.append(btn);
      const note = document.createElement('p');
      note.className = 'profile-drawer__hint';
      note.textContent =
        'Contas developer/admin são distintas das de jogador e abrem o painel /admin.';
      empty.append(note);
      body.append(empty);
      return;
    }

    const user = account.user;
    const staff = isStaff(user.role);
    const name = displayNameOf(user);

    const head = document.createElement('div');
    head.className = 'profile-drawer__head';

    const av = renderUserAvatar({ name, size: 'lg', staff });
    const info = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.id = 'pd-name';
    h2.textContent = name;
    const un = document.createElement('p');
    un.className = 'profile-drawer__user';
    un.textContent = `@${user.username}`;
    info.append(h2, un);

    const badge = renderRoleBadge(user.role);
    if (badge) info.append(badge);

    const status = document.createElement('p');
    status.className = 'profile-drawer__online';
    status.innerHTML = '<span class="status-badge__dot" aria-hidden="true"></span> Online no portal';
    info.append(status);

    head.append(av, info);
    body.append(head);

    if (staff) {
      const staffBox = document.createElement('div');
      staffBox.className = 'profile-drawer__staff';
      staffBox.innerHTML = `
        <strong>Conta da equipe</strong>
        <p>${roleLabel(user.role)} — acesso administrativo distinto de jogadores comuns.</p>
      `;
      const adminLink = document.createElement('a');
      adminLink.className = 'btn btn--primary btn--sm';
      adminLink.href = ADMIN_HREF;
      adminLink.textContent = canViewAdmin(user.role)
        ? 'Abrir painel admin'
        : 'Área da equipe';
      staffBox.append(adminLink);
      body.append(staffBox);
    }

    const profile = account.profile;
    if (profile) {
      const stats = document.createElement('div');
      stats.className = 'profile-drawer__stats';
      stats.setAttribute('aria-label', 'Estatísticas Capyquake');
      stats.append(
        stat('Nível', formatNumber(profile.level)),
        stat('Eliminações', formatNumber(profile.kills)),
        stat('Partidas', formatNumber(profile.matches)),
        stat('Moedas', formatNumber(profile.coins)),
      );
      body.append(section('Capyquake', stats));
    }

    const capy = account.capybara;
    if (capy) {
      const row = document.createElement('div');
      row.className = 'profile-drawer__capy';
      row.innerHTML = `<strong>${escapeText(capy.name || 'Capybara')}</strong>
        <span>HP ${capy.health ?? '—'} · Energia ${capy.energy ?? '—'} · Fome ${capy.hunger ?? '—'} · Felicidade ${capy.happiness ?? '—'}</span>`;
      body.append(section('Companheiro', row));
    }

    if (!features.social) {
      const social = document.createElement('p');
      social.className = 'profile-drawer__hint';
      social.textContent = 'Amigos e seguidores ainda não estão disponíveis no portal.';
      body.append(social);
    }

    const actions = document.createElement('div');
    actions.className = 'profile-drawer__actions';

    const full = document.createElement('a');
    full.className = 'btn btn--block';
    full.href = '/perfil';
    full.textContent = 'Ver perfil completo';
    full.addEventListener('click', (e) => {
      e.preventDefault();
      close();
      navigate('/perfil');
    });

    const play = document.createElement('a');
    play.className = 'btn btn--primary btn--block';
    play.href = '/capyquake/';
    play.textContent = 'Abrir Capyquake';

    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'btn btn--ghost btn--block';
    out.textContent = 'Sair';
    out.addEventListener('click', async () => {
      await logout();
      close();
      opts.onChange?.();
    });

    actions.append(full, play, out);
    body.append(actions);
  }

  root.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  });

  return { root, open, close, isOpen, update };
}

/**
 * @param {string} title
 * @param {HTMLElement} content
 */
function section(title, content) {
  const wrap = document.createElement('section');
  wrap.className = 'profile-drawer__section';
  const h = document.createElement('h3');
  h.textContent = title;
  wrap.append(h, content);
  return wrap;
}

/**
 * @param {string} label
 * @param {string} value
 */
function stat(label, value) {
  const el = document.createElement('div');
  el.className = 'profile-drawer__stat';
  el.innerHTML = `<span>${escapeText(value)}</span><small>${escapeText(label)}</small>`;
  return el;
}

/** @param {string} s */
function escapeText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
