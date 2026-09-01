import { listAchievements } from '../data/achievements.js';
import { GAMES } from '../data/games.js';
import { setTitle } from '../core/router.js';
import { renderAchievementCard } from '../ui/AchievementCard.js';
import { RARITY_TABLE } from '../utils/rarity.js';
import { renderEmptyState } from '../ui/EmptyState.js';

/**
 * @param {string} [gameId]
 * @returns {HTMLElement}
 */
export function renderAchievementsPage(gameId) {
  const game = gameId ? GAMES.find((g) => g.id === gameId) : null;
  const title = game ? `Conquistas · ${game.name}` : 'Conquistas';
  setTitle(title);

  const section = document.createElement('section');
  section.className = 'shell page';

  const head = document.createElement('div');
  head.className = 'page-head';
  head.innerHTML = `
    <p class="page-eyebrow">Progresso</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="page-lead">Catálogo documentado. Raridade por percentual real via <code>getAchievementRarity</code> — sem inventar % de produção.</p>
  `;
  section.append(head);

  const rarity = document.createElement('details');
  rarity.className = 'rarity-panel';
  rarity.innerHTML = `<summary>Tabela oficial de raridades</summary>`;
  const table = document.createElement('table');
  table.className = 'rarity-table';
  table.innerHTML = `<thead><tr><th>Raridade</th><th>%</th><th>Significado</th></tr></thead>`;
  const tbody = document.createElement('tbody');
  for (const row of RARITY_TABLE) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(row.label)}</td><td>${row.min}–${row.max}</td><td>${escapeHtml(row.meaning)}</td>`;
    tbody.append(tr);
  }
  table.append(tbody);
  rarity.append(table);
  section.append(rarity);

  if (!gameId) {
    const filters = document.createElement('div');
    filters.className = 'chip-row';
    const all = document.createElement('a');
    all.className = 'chip chip--active';
    all.href = '/conquistas';
    all.textContent = 'Todas';
    filters.append(all);
    for (const g of GAMES) {
      const a = document.createElement('a');
      a.className = 'chip';
      a.href = `/${g.id}/conquistas`;
      a.textContent = g.name;
      filters.append(a);
    }
    section.append(filters);
  } else {
    const back = document.createElement('p');
    back.className = 'page-back';
    back.innerHTML = `<a href="/conquistas">← Todas as conquistas</a>`;
    section.append(back);
  }

  const items = listAchievements(gameId);
  if (!items.length) {
    section.append(
      renderEmptyState({
        title: 'Nenhuma conquista listada',
        body: 'Ainda não há catálogo documentado para este jogo no portal.',
      }),
    );
    return section;
  }

  const grid = document.createElement('div');
  grid.className = 'ach-grid';
  for (const ach of items) {
    grid.append(renderAchievementCard(ach));
  }
  section.append(grid);

  const note = document.createElement('p');
  note.className = 'page-note';
  note.textContent =
    'Desbloqueios pessoais dependem da API do jogo. O portal não marca conquistas como obtidas sem dados reais.';
  section.append(note);

  return section;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
