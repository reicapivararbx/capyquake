import { features } from '../core/features.js';
import { setTitle } from '../core/router.js';
import { GAMES } from '../data/games.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/**
 * @param {string} [gameId]
 * @returns {HTMLElement}
 */
export function renderServersPage(gameId) {
  const game = gameId ? GAMES.find((g) => g.id === gameId) : null;
  const title = game ? `Servidores · ${game.name}` : 'Servidores';
  setTitle(title);

  const section = document.createElement('section');
  section.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Multiplayer</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="page-lead">Salas e lobbies públicos no portal só aparecem quando existir API real — sem inventar lista fake.</p>
  `;
  section.append(head);

  if (!features.publicServers) {
    const body =
      game?.id === 'capyquake'
        ? 'O Capyquake usa lobbies por código dentro do jogo. Não há browser de salas públicas no portal ainda.'
        : game
          ? `${game.name} não expõe lista pública de servidores no portal.`
          : 'O browser de salas públicas ainda não está disponível. No Capyquake, multiplayer usa lobbies por código dentro do jogo.';

    section.append(
      renderEmptyState({
        title: 'Servidores públicos indisponíveis',
        body,
        actionHref: game?.playHref || '/capyquake/',
        actionLabel: game?.playHref ? `Abrir ${game.name}` : 'Abrir Capyquake',
      }),
    );

    if (!gameId) {
      const list = document.createElement('div');
      list.className = 'link-list';
      list.innerHTML = '<h2 class="page-sub">Por jogo</h2>';
      for (const g of GAMES) {
        const a = document.createElement('a');
        a.className = 'link-list__item';
        a.href = `/${g.id}/servidores`;
        a.innerHTML = `<strong>${escapeHtml(g.name)}</strong><span>Ver status multiplayer</span>`;
        list.append(a);
      }
      section.append(list);
    }

    return section;
  }

  section.append(
    renderEmptyState({
      title: 'Nenhum servidor listado',
      body: 'A API de salas públicas respondeu vazia.',
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
