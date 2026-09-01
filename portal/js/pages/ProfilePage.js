import { displayNameOf, getCachedAccount } from '../services/auth.js';
import { ADMIN_HREF, canViewAdmin, isStaff, roleLabel } from '../core/roles.js';
import { formatNumber, formatRelative } from '../core/format.js';
import { setTitle } from '../core/router.js';
import { features } from '../core/features.js';
import { renderUserAvatar } from '../ui/UserAvatar.js';
import { renderRoleBadge } from '../ui/RoleBadge.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/**
 * Full profile page (logged-in account from /api/users/me).
 * @param {{ onLoginRequest?: () => void }} [opts]
 * @returns {HTMLElement}
 */
export function renderProfilePage(opts = {}) {
  setTitle('Perfil');
  const account = getCachedAccount();

  const section = document.createElement('section');
  section.className = 'shell page profile-page';

  if (!account?.user) {
    const head = document.createElement('div');
    head.className = 'page-head';
    head.innerHTML = `<p class="page-eyebrow">Conta</p><h1>Perfil</h1>`;
    section.append(head);

    const empty = renderEmptyState({
      title: 'Você não está logado',
      body: 'Entre com a conta do Capyquake para ver nível, estatísticas e atalhos da equipe.',
    });
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary';
    btn.textContent = 'Entrar';
    btn.style.marginTop = '12px';
    btn.addEventListener('click', () => opts.onLoginRequest?.());
    empty.append(btn);

    const staffNote = document.createElement('p');
    staffNote.className = 'page-note';
    staffNote.textContent =
      'Contas developer, admin e superiores são distintas das de jogador e abrem o painel /admin.';
    section.append(empty, staffNote);
    return section;
  }

  const user = account.user;
  const staff = isStaff(user.role);
  const name = displayNameOf(user);

  const head = document.createElement('div');
  head.className = 'profile-page__head';

  head.append(renderUserAvatar({ name, size: 'lg', staff }));

  const info = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.textContent = name;
  const un = document.createElement('p');
  un.className = 'profile-page__user';
  un.textContent = `@${user.username}`;
  info.append(h1, un);

  const badge = renderRoleBadge(user.role);
  if (badge) info.append(badge);

  if (user.lastLoginAt) {
    const last = document.createElement('p');
    last.className = 'page-note';
    last.textContent = `Último login: ${formatRelative(user.lastLoginAt)}`;
    info.append(last);
  }

  head.append(info);
  section.append(head);

  if (staff) {
    const box = document.createElement('div');
    box.className = 'staff-banner';
    box.innerHTML = `
      <div>
        <strong>Conta da equipe</strong>
        <p>${escapeHtml(roleLabel(user.role))} — acesso administrativo distinto de jogadores comuns.</p>
      </div>
    `;
    if (canViewAdmin(user.role)) {
      const a = document.createElement('a');
      a.className = 'btn btn--primary btn--sm';
      a.href = ADMIN_HREF;
      a.textContent = 'Abrir painel admin';
      box.append(a);
    }
    section.append(box);
  }

  const profile = account.profile;
  if (profile) {
    const grid = document.createElement('div');
    grid.className = 'stat-grid';
    grid.setAttribute('aria-label', 'Estatísticas Capyquake');
    const cells = [
      ['Nível', profile.level],
      ['XP', profile.xp],
      ['Eliminações', profile.kills],
      ['Partidas', profile.matches],
      ['Moedas', profile.coins],
      ['Tokens', profile.tokens],
      ['Rebirths', profile.rebirths],
      ['Tempo de jogo', profile.playTime],
    ];
    for (const [label, val] of cells) {
      const el = document.createElement('div');
      el.className = 'stat-grid__cell';
      el.innerHTML = `<span>${escapeHtml(formatNumber(val))}</span><small>${escapeHtml(label)}</small>`;
      grid.append(el);
    }
    const h2 = document.createElement('h2');
    h2.className = 'page-sub';
    h2.textContent = 'Capyquake';
    section.append(h2, grid);
  }

  const capy = account.capybara;
  if (capy) {
    const h2 = document.createElement('h2');
    h2.className = 'page-sub';
    h2.textContent = 'Companheiro';
    const card = document.createElement('div');
    card.className = 'profile-capy';
    card.innerHTML = `
      <strong>${escapeHtml(capy.name || 'Capybara')}</strong>
      <ul>
        <li>HP: ${capy.health ?? '—'}</li>
        <li>Energia: ${capy.energy ?? '—'}</li>
        <li>Fome: ${capy.hunger ?? '—'}</li>
        <li>Felicidade: ${capy.happiness ?? '—'}</li>
      </ul>
    `;
    section.append(h2, card);
  }

  if (!features.social) {
    const note = document.createElement('p');
    note.className = 'page-note';
    note.textContent = 'Amigos, seguidores e avatares customizados ainda não estão no portal.';
    section.append(note);
  }

  const actions = document.createElement('div');
  actions.className = 'page-actions';
  const play = document.createElement('a');
  play.className = 'btn btn--primary';
  play.href = '/capyquake/';
  play.textContent = 'Abrir Capyquake';
  const ach = document.createElement('a');
  ach.className = 'btn';
  ach.href = '/conquistas';
  ach.textContent = 'Conquistas';
  actions.append(play, ach);
  section.append(actions);

  return section;
}

/**
 * Public user stub — no public profile API yet.
 * @param {string} username
 * @returns {HTMLElement}
 */
export function renderUserPage(username) {
  setTitle(`@${username}`);
  const section = document.createElement('section');
  section.className = 'shell page';
  section.append(
    renderEmptyState({
      title: `@${username}`,
      body: 'Perfis públicos de outros jogadores ainda não estão disponíveis no portal (sem API).',
      actionHref: '/',
      actionLabel: 'Início',
    }),
  );
  return section;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
