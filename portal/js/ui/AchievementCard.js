import { formatPercent } from '../core/format.js';
import { getAchievementRarity, rarityClass } from '../utils/rarity.js';

/**
 * @typedef {import('../data/achievements.js').AchievementDef} AchievementDef
 */

/**
 * @param {AchievementDef & { unlocked?: boolean, unlockedAt?: string|number|null }} achievement
 * @returns {HTMLElement}
 */
export function renderAchievementCard(achievement) {
  const article = document.createElement('article');
  article.className = 'ach-card';
  article.dataset.id = achievement.id;

  const secret = Boolean(achievement.secret);
  const hasRate = Number.isFinite(Number(achievement.unlockRate));
  const rate = hasRate ? Number(achievement.unlockRate) : null;
  const rarity = rate != null ? getAchievementRarity(rate) : null;

  if (rarity) {
    article.classList.add(`ach-card--${rarityClass(rarity)}`);
  }
  if (secret) article.classList.add('ach-card--secret');
  if (achievement.unlocked) article.classList.add('ach-card--unlocked');

  const icon = document.createElement('div');
  icon.className = 'ach-card__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = secret && !achievement.unlocked ? '???' : '🏆';

  const body = document.createElement('div');
  body.className = 'ach-card__body';

  const title = document.createElement('h3');
  title.className = 'ach-card__title';
  title.textContent =
    secret && !achievement.unlocked ? 'Segredo' : achievement.name;

  const desc = document.createElement('p');
  desc.className = 'ach-card__desc';
  desc.textContent =
    secret && !achievement.unlocked
      ? 'Continue explorando para descobrir esta conquista.'
      : achievement.description;

  const meta = document.createElement('p');
  meta.className = 'ach-card__meta';
  if (rarity && rate != null) {
    meta.textContent = `${rarity} · ${formatPercent(rate)}`;
  } else if (achievement.legacyTier) {
    meta.textContent = `Categoria no jogo: ${achievement.legacyTier}`;
  } else {
    meta.textContent = 'Percentual global ainda não disponível';
  }

  const state = document.createElement('p');
  state.className = 'ach-card__state';
  if (achievement.unlocked) {
    state.textContent = '✓ Desbloqueada';
  } else {
    state.textContent = 'Bloqueada';
  }

  body.append(title, desc, meta, state);
  article.append(icon, body);
  return article;
}
