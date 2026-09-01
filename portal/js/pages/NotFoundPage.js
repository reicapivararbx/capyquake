import { setTitle } from '../core/router.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/** @returns {HTMLElement} */
export function renderNotFoundPage() {
  setTitle('Página não encontrada');
  const section = document.createElement('section');
  section.className = 'shell page';
  section.append(
    renderEmptyState({
      title: 'Página não encontrada',
      body: 'Esse endereço não existe no portal. Volte ao início ou abra um dos jogos.',
      actionHref: '/',
      actionLabel: 'Ir ao início',
    }),
  );
  return section;
}
