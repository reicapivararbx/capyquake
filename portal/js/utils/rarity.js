/**
 * Single source of truth for achievement rarity by unlock rate (%).
 * Mandatory table from Portal Capy master prompt §30.
 *
 * @param {number} rate unlock percentage 0–100
 * @returns {'Brinde'|'Moleza'|'Fácil'|'Moderado'|'Desafiador'|'Difícil'|'Extremo'|'Insano'|'Lendário'}
 */
export function getAchievementRarity(rate) {
  const n = Number(rate);
  if (!Number.isFinite(n)) return 'Lendário';
  if (n >= 90) return 'Brinde';
  if (n >= 80) return 'Moleza';
  if (n >= 50) return 'Fácil';
  if (n >= 30) return 'Moderado';
  if (n >= 20) return 'Desafiador';
  if (n >= 10) return 'Difícil';
  if (n >= 5) return 'Extremo';
  if (n >= 1) return 'Insano';
  return 'Lendário';
}

/** @type {readonly { id: string, label: string, min: number, max: number, meaning: string }[]} */
export const RARITY_TABLE = Object.freeze([
  Object.freeze({
    id: 'brinde',
    label: 'Brinde',
    min: 90,
    max: 100,
    meaning: 'Dada a quase todos que acessam ou fazem a ação básica inicial',
  }),
  Object.freeze({
    id: 'moleza',
    label: 'Moleza',
    min: 80,
    max: 89.99,
    meaning: 'Exige pouco esforço ou poucos minutos de jogo',
  }),
  Object.freeze({
    id: 'facil',
    label: 'Fácil',
    min: 50,
    max: 79.99,
    meaning: 'Simples de conseguir, geralmente por tarefas básicas',
  }),
  Object.freeze({
    id: 'moderado',
    label: 'Moderado',
    min: 30,
    max: 49.99,
    meaning: 'Exige algum foco ou concluir objetivos iniciais',
  }),
  Object.freeze({
    id: 'desafiador',
    label: 'Desafiador',
    min: 20,
    max: 29.99,
    meaning: 'Exige esforço real, habilidade ou conhecimento do jogo',
  }),
  Object.freeze({
    id: 'dificil',
    label: 'Difícil',
    min: 10,
    max: 19.99,
    meaning: 'Exige prática, paciência ou superar obstáculo mais complicado',
  }),
  Object.freeze({
    id: 'extremo',
    label: 'Extremo',
    min: 5,
    max: 9.99,
    meaning: 'Apenas uma parcela pequena dos jogadores consegue',
  }),
  Object.freeze({
    id: 'insano',
    label: 'Insano',
    min: 1,
    max: 4.99,
    meaning: 'Reservado para desafios difíceis, segredos raros ou marcos altos',
  }),
  Object.freeze({
    id: 'lendario',
    label: 'Lendário',
    min: 0,
    max: 0.99,
    meaning: 'O mais raro; feitos excepcionalmente difíceis ou segredos muito raros',
  }),
]);

/**
 * CSS modifier from rarity label.
 * @param {string} label
 * @returns {string}
 */
export function rarityClass(label) {
  const map = {
    Brinde: 'brinde',
    Moleza: 'moleza',
    Fácil: 'facil',
    Moderado: 'moderado',
    Desafiador: 'desafiador',
    Difícil: 'dificil',
    Extremo: 'extremo',
    Insano: 'insano',
    Lendário: 'lendario',
  };
  return map[label] || 'lendario';
}

/**
 * @param {number} unlocked
 * @param {number} eligible
 * @returns {number} percentage 0–100
 */
export function computeUnlockRate(unlocked, eligible) {
  const u = Number(unlocked);
  const e = Number(eligible);
  if (!Number.isFinite(u) || !Number.isFinite(e) || e <= 0) return 0;
  return Math.max(0, Math.min(100, (u / e) * 100));
}
