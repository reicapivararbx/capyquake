import { GAMES } from '../data/games.js';
import { setTitle } from '../core/router.js';
import { renderProjectStatus } from '../ui/ProjectStatus.js';
import { renderEmptyState } from '../ui/EmptyState.js';
import { WIKI_SECTIONS } from '../data/wiki.js';
import { listAchievements } from '../data/achievements.js';

/**
 * @param {string} gameId
 * @returns {HTMLElement}
 */
export function renderGameDetailPage(gameId) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) {
    setTitle('Jogo não encontrado');
    const wrap = document.createElement('section');
    wrap.className = 'shell page';
    wrap.append(
      renderEmptyState({
        title: 'Jogo não encontrado',
        body: 'Esse id não está no catálogo do portal.',
        actionHref: '/jogos',
        actionLabel: 'Ver jogos',
      }),
    );
    return wrap;
  }

  setTitle(game.name);

  const section = document.createElement('section');
  section.className = 'shell page game-detail';

  const head = document.createElement('div');
  head.className = 'game-detail__head';

  const symbol = document.createElement('div');
  symbol.className = `game-detail__symbol game-detail__symbol--${game.accent}`;
  symbol.textContent = game.symbol;

  const copy = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'page-eyebrow';
  eyebrow.textContent = game.kind;

  const h1 = document.createElement('h1');
  h1.textContent = game.name;

  const desc = document.createElement('p');
  desc.className = 'page-lead';
  desc.textContent = game.description;

  const statusRow = document.createElement('div');
  statusRow.className = 'game-detail__status';
  statusRow.append(renderProjectStatus(game.status));

  copy.append(eyebrow, h1, desc, statusRow);
  head.append(symbol, copy);

  const actions = document.createElement('div');
  actions.className = 'game-detail__actions';

  if (game.playHref && game.status === 'online') {
    const play = document.createElement('a');
    play.className = 'btn btn--primary';
    play.href = game.playHref;
    play.textContent = `Jogar ${game.name}`;
    actions.append(play);
  }

  const wikiSec = WIKI_SECTIONS.find((s) => s.gameId === game.id);
  if (wikiSec) {
    const wiki = document.createElement('a');
    wiki.className = 'btn';
    wiki.href = `/wiki/${game.id}`;
    wiki.textContent = 'Wiki';
    actions.append(wiki);
  }

  const achCount = listAchievements(game.id).length;
  if (achCount > 0) {
    const ach = document.createElement('a');
    ach.className = 'btn';
    ach.href = `/${game.id}/conquistas`;
    ach.textContent = 'Conquistas';
    actions.append(ach);
  }

  const servers = document.createElement('a');
  servers.className = 'btn';
  servers.href = `/${game.id}/servidores`;
  servers.textContent = 'Servidores';
  actions.append(servers);

  const tags = document.createElement('ul');
  tags.className = 'game-detail__tags';
  for (const t of game.tags) {
    const li = document.createElement('li');
    li.textContent = t;
    tags.append(li);
  }

  section.append(head, actions, tags);
  return section;
}
