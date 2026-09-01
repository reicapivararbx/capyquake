import { GAMES } from '../data/games.js';
import { setTitle } from '../core/router.js';
import { renderGameCard } from '../ui/GameCard.js';

/** @returns {HTMLElement} */
export function renderGamesPage() {
  setTitle('Jogos');

  const section = document.createElement('section');
  section.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Catálogo</p>
    <h1>Jogos</h1>
    <p class="page-lead">Quatro projetos no mesmo portal. Status e links refletem o que está publicado de verdade.</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'games-grid';
  grid.setAttribute('role', 'list');

  for (const game of GAMES) {
    const card = renderGameCard(game);
    card.setAttribute('role', 'listitem');
    grid.append(card);
  }

  section.append(head, grid);
  return section;
}
