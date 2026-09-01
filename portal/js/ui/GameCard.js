import { renderProjectStatus } from './ProjectStatus.js';

/**
 * @typedef {import('../data/games.js').Game} Game
 */

/**
 * @param {Game} game
 * @returns {HTMLElement}
 */
export function renderGameCard(game) {
  const article = document.createElement('article');
  article.className = `game-card game-card--${game.accent}`;
  article.dataset.gameId = game.id;

  const top = document.createElement('div');
  top.className = 'game-card__top';

  const symbol = document.createElement('div');
  symbol.className = 'game-card__symbol';
  symbol.textContent = game.symbol;
  symbol.setAttribute('aria-hidden', 'true');

  top.append(symbol, renderProjectStatus(game.status));

  const title = document.createElement('h3');
  title.className = 'game-card__title';
  title.textContent = game.name;

  const kind = document.createElement('span');
  kind.className = 'game-card__kind';
  kind.textContent = game.kind;

  const desc = document.createElement('p');
  desc.className = 'game-card__desc';
  desc.textContent = game.description;

  const tags = document.createElement('div');
  tags.className = 'game-card__tags';
  for (const tag of game.tags) {
    const span = document.createElement('span');
    span.textContent = tag;
    tags.append(span);
  }

  const actions = document.createElement('div');
  actions.className = 'game-card__actions';

  const canPlay = game.status === 'online' && game.playHref;

  if (canPlay) {
    const play = document.createElement('a');
    play.className = 'btn btn--primary';
    play.href = game.playHref;
    play.dataset.accent = '';
    play.textContent = playLabel(game.id);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    play.append(arrow);
    actions.append(play);
  }

  const more = document.createElement('a');
  more.className = 'btn';
  more.href = game.detailsHref || `/jogos/${game.id}`;
  more.textContent = 'Detalhes';
  actions.append(more);

  article.append(top, title, kind, desc, tags, actions);
  return article;
}

/**
 * @param {string} id
 * @returns {string}
 */
function playLabel(id) {
  switch (id) {
    case 'capyquake':
      return 'Entrar no Capyquake';
    case 'capyrails':
      return 'Viajar no Capyrails';
    case 'capyzen':
      return 'Jogar Capyzen';
    case 'find-the-markers':
      return 'Procurar os Markers';
    default:
      return 'Jogar';
  }
}
