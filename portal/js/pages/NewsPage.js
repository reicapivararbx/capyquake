import { features } from '../core/features.js';
import { setTitle } from '../core/router.js';
import { api } from '../services/api.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/**
 * @param {string} [slug]
 * @returns {HTMLElement}
 */
export function renderNewsPage(slug) {
  setTitle(slug ? 'Novidade' : 'Novidades');

  const section = document.createElement('section');
  section.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Changelog</p>
    <h1>Novidades</h1>
    <p class="page-lead">Posts oficiais só aparecem aqui quando existirem de verdade — sem inventar feed.</p>
  `;
  section.append(head);

  if (!features.news) {
    section.append(
      renderEmptyState({
        title: 'Nenhuma novidade publicada ainda',
        body: 'Quando houver changelog oficial, ele aparece aqui.',
        actionHref: '/',
        actionLabel: 'Voltar ao início',
      }),
    );
    return section;
  }

  const mount = document.createElement('div');
  mount.className = 'news-feed';
  mount.setAttribute('aria-busy', 'true');
  mount.innerHTML = `<p class="page-note">Carregando…</p>`;
  section.append(mount);

  if (slug) {
    loadNewsItem(mount, slug);
  } else {
    loadNewsList(mount);
  }

  return section;
}

/** @param {HTMLElement} mount */
async function loadNewsList(mount) {
  const res = await api('/api/portal/news?limit=30');
  mount.setAttribute('aria-busy', 'false');
  if (!res.ok) {
    mount.replaceChildren(
      renderEmptyState({
        title: 'Não foi possível carregar novidades',
        body: res.error || 'Erro de rede.',
        actionHref: '/',
        actionLabel: 'Voltar ao início',
      }),
    );
    return;
  }
  const items = res.data?.news || [];
  if (!items.length) {
    mount.replaceChildren(
      renderEmptyState({
        title: 'Nenhuma novidade publicada ainda',
        body: 'Quando houver changelog oficial, ele aparece aqui.',
        actionHref: '/',
        actionLabel: 'Voltar ao início',
      }),
    );
    return;
  }
  const list = document.createElement('div');
  list.className = 'link-list';
  for (const n of items) {
    const a = document.createElement('a');
    a.className = 'link-list__item';
    a.href = `/novidades/${encodeURIComponent(n.slug)}`;
    const when = n.publishedAt || n.createdAt
      ? new Date(n.publishedAt || n.createdAt).toLocaleDateString('pt-BR')
      : '';
    a.innerHTML = `<strong>${escapeHtml(n.title)}</strong><span>${escapeHtml(n.summary || when)}</span>`;
    list.append(a);
  }
  mount.replaceChildren(list);
}

/**
 * @param {HTMLElement} mount
 * @param {string} slug
 */
async function loadNewsItem(mount, slug) {
  const res = await api(`/api/portal/news/${encodeURIComponent(slug)}`);
  mount.setAttribute('aria-busy', 'false');
  if (!res.ok || !res.data?.news) {
    mount.replaceChildren(
      renderEmptyState({
        title: 'Post não encontrado',
        body: 'Esse slug não existe ou ainda não foi publicado.',
        actionHref: '/novidades',
        actionLabel: 'Voltar às novidades',
      }),
    );
    return;
  }
  const n = res.data.news;
  setTitle(n.title);
  const article = document.createElement('article');
  article.className = 'wiki-body prose';
  const when = n.publishedAt || n.createdAt
    ? new Date(n.publishedAt || n.createdAt).toLocaleString('pt-BR')
    : '';
  article.innerHTML = `
    <p class="page-eyebrow"><a href="/novidades">Novidades</a>${when ? ` · ${escapeHtml(when)}` : ''}</p>
    <h2>${escapeHtml(n.title)}</h2>
    ${n.summary ? `<p class="page-lead">${escapeHtml(n.summary)}</p>` : ''}
    <div class="news-body">${formatBody(n.body || '')}</div>
  `;
  mount.replaceChildren(article);
}

/** @param {string} body */
function formatBody(body) {
  return escapeHtml(body).replace(/\n/g, '<br>');
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
