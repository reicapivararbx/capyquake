import { features } from '../core/features.js';
import { setTitle } from '../core/router.js';
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

  section.append(
    renderEmptyState({
      title: slug ? 'Post não encontrado' : 'Feed vazio',
      body: 'Nenhum item disponível.',
    }),
  );
  return section;
}
