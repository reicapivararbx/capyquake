export function xpNeededForLevel(level) {
  return level * 100;
}

export const MAX_LEVEL = 100;

// Formula oficial do jogo (src/game.js addXp): xp >= level*100 sobe de nivel.
export function applyXp(level, xp, gained) {
  let lvl = level;
  let cur = xp + Math.max(0, Math.floor(gained));
  while (lvl < MAX_LEVEL && cur >= xpNeededForLevel(lvl)) {
    cur -= xpNeededForLevel(lvl);
    lvl++;
  }
  if (lvl >= MAX_LEVEL) cur = Math.min(cur, xpNeededForLevel(MAX_LEVEL - 1));
  return { level: lvl, xp: cur, leveledUp: lvl > level };
}
