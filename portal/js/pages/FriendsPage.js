import { features } from '../core/features.js';
import { setTitle } from '../core/router.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/** @returns {HTMLElement} */
export function renderFriendsPage() {
  setTitle('Amigos');
  const section = document.createElement('section');
  section.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Social</p>
    <h1>Amigos</h1>
  `;
  section.append(head);

  if (!features.social) {
    section.append(
      renderEmptyState({
        title: 'Amigos ainda não disponíveis',
        body: 'Não há API de amigos no portal. Quando existir backend real, esta página deixa de ser vazia — sem lista inventada.',
        actionHref: '/perfil',
        actionLabel: 'Ir ao perfil',
      }),
    );
    return section;
  }

  section.append(renderEmptyState({ title: 'Nenhum amigo', body: 'Lista vazia.' }));
  return section;
}
