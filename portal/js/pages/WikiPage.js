import { WIKI_SECTIONS, findWikiArticle, wikiContentUrl } from '../data/wiki.js';
import { setTitle } from '../core/router.js';
import { renderMarkdown } from '../utils/markdown.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/**
 * Wiki hub or game section list.
 * @param {string} [gameId]
 * @returns {HTMLElement}
 */
export function renderWikiHubPage(gameId) {
  if (gameId) {
    const section = WIKI_SECTIONS.find((s) => s.gameId === gameId);
    if (!section) {
      setTitle('Wiki');
      const wrap = document.createElement('section');
      wrap.className = 'shell page';
      wrap.append(
        renderEmptyState({
          title: 'Wiki não encontrada',
          body: 'Não há seção de wiki para este jogo.',
          actionHref: '/wiki',
          actionLabel: 'Voltar à wiki',
        }),
      );
      return wrap;
    }
    setTitle(`Wiki · ${section.title}`);
    return renderSectionList(section);
  }

  setTitle('Wiki');
  const page = document.createElement('section');
  page.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Documentação</p>
    <h1>Wiki</h1>
    <p class="page-lead">Guias e artigos estáticos dos projetos Capy. Conteúdo em markdown servido pelo portal.</p>
  `;
  page.append(head);

  const grid = document.createElement('div');
  grid.className = 'wiki-hub-grid';

  for (const sec of WIKI_SECTIONS) {
    const card = document.createElement('a');
    card.className = 'wiki-hub-card';
    card.href = `/wiki/${sec.gameId}`;
    card.innerHTML = `
      <strong>${escapeHtml(sec.title)}</strong>
      <span>${sec.articles.length} artigo${sec.articles.length === 1 ? '' : 's'}</span>
    `;
    grid.append(card);
  }

  page.append(grid);
  return page;
}

/**
 * @param {import('../data/wiki.js').WikiGameSection} section
 * @returns {HTMLElement}
 */
function renderSectionList(section) {
  const page = document.createElement('section');
  page.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow"><a href="/wiki">Wiki</a></p>
    <h1>${escapeHtml(section.title)}</h1>
    <p class="page-lead">Artigos e guias deste projeto.</p>
  `;
  page.append(head);

  const list = document.createElement('div');
  list.className = 'link-list';
  const seen = new Set();
  for (const a of section.articles) {
    seen.add(a.slug);
    const link = document.createElement('a');
    link.className = 'link-list__item';
    link.href = `/wiki/${section.gameId}/${a.slug}`;
    link.innerHTML = `<strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.description)}</span>`;
    list.append(link);
  }
  page.append(list);

  import('../services/api.js').then(({ api }) => {
    api(`/api/portal/wiki?gameId=${encodeURIComponent(section.gameId)}&limit=100`).then((res) => {
      if (!res.ok || !res.data?.articles?.length) return;
      for (const a of res.data.articles) {
        if (!a?.slug || seen.has(a.slug)) continue;
        seen.add(a.slug);
        const link = document.createElement('a');
        link.className = 'link-list__item';
        link.href = `/wiki/${section.gameId}/${encodeURIComponent(a.slug)}`;
        link.innerHTML = `<strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.description || 'Artigo do admin')}</span>`;
        list.append(link);
      }
    });
  });

  return page;
}

/**
 * Load and render a wiki article (async content into container).
 * @param {string} gameId
 * @param {string} slug
 * @returns {HTMLElement}
 */
export function renderWikiArticlePage(gameId, slug) {
  const found = findWikiArticle(gameId, slug);
  const page = document.createElement('section');
  page.className = 'shell page wiki-article';

  if (found) {
    const { section, article } = found;
    setTitle(`${article.title} · ${section.title}`);

    const head = document.createElement('div');
    head.className = 'page-head';
    head.innerHTML = `
      <p class="page-eyebrow"><a href="/wiki">Wiki</a> · <a href="/wiki/${escapeAttr(section.gameId)}">${escapeHtml(section.title)}</a></p>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="page-lead">${escapeHtml(article.description)}</p>
    `;
    page.append(head);

    const body = document.createElement('article');
    body.className = 'wiki-body prose';
    body.setAttribute('aria-busy', 'true');
    body.innerHTML = `<p class="page-note">Carregando…</p>`;
    page.append(body);

    const url = wikiContentUrl(section.gameId, article.file);
    fetch(url, { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((md) => {
        body.innerHTML = renderMarkdown(md);
        body.setAttribute('aria-busy', 'false');
      })
      .catch(() => {
        body.replaceChildren(
          renderEmptyState({
            title: 'Não foi possível carregar o artigo',
            body: `Falha ao buscar ${article.file}. Verifique se o markdown está publicado em /capy-portal/content/wiki/.`,
            actionHref: `/wiki/${section.gameId}`,
            actionLabel: 'Voltar',
          }),
        );
        body.setAttribute('aria-busy', 'false');
      });

    return page;
  }

  setTitle('Artigo');
  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow"><a href="/wiki">Wiki</a> · <a href="/wiki/${escapeAttr(gameId)}">${escapeHtml(gameId)}</a></p>
    <h1>Carregando…</h1>
  `;
  page.append(head);

  const body = document.createElement('article');
  body.className = 'wiki-body prose';
  body.setAttribute('aria-busy', 'true');
  body.innerHTML = `<p class="page-note">Carregando…</p>`;
  page.append(body);

  import('../services/api.js').then(({ api }) => {
    api(`/api/portal/wiki/${encodeURIComponent(gameId)}/${encodeURIComponent(slug)}`).then((res) => {
      body.setAttribute('aria-busy', 'false');
      if (!res.ok || !res.data?.article) {
        setTitle('Artigo não encontrado');
        head.querySelector('h1').textContent = 'Artigo não encontrado';
        body.replaceChildren(
          renderEmptyState({
            title: 'Artigo não encontrado',
            body: 'Esse slug não existe na wiki do portal.',
            actionHref: '/wiki',
            actionLabel: 'Voltar à wiki',
          }),
        );
        return;
      }
      const article = res.data.article;
      setTitle(`${article.title} · ${gameId}`);
      head.querySelector('h1').textContent = article.title;
      if (article.description) {
        let lead = head.querySelector('.page-lead');
        if (!lead) {
          lead = document.createElement('p');
          lead.className = 'page-lead';
          head.append(lead);
        }
        lead.textContent = article.description;
      }
      body.innerHTML = renderMarkdown(article.bodyMd || article.body || '');
    });
  });

  return page;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** @param {string} s */
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
