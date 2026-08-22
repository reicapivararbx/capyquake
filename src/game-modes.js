// Modos de jogo: variantes de gameplay aplicadas ao iniciar a partida.

export const GAME_MODES = [
  { id: 'normal', name: 'Normal', icon: '🎯', desc: 'A experiencia classica, sem alteracoes.' },
  { id: 'chaos', name: 'Chaos Mode', icon: '🌀', desc: 'Tudo acelerado e instavel. Drops em dobro.', apply: { speedMul: 1.6, animalSpeedMul: 1.8, moneyMul: 2, gravity: 10 } },
  { id: 'reverse', name: 'Reverse', icon: '🔁', desc: 'Controles invertidos. Boa sorte.', apply: { reverseControls: true } },
  { id: 'oneshot', name: 'One Shot', icon: '💀', desc: 'Animais morrem com 1 hit. Voce tambem.', apply: { oneShotAnimals: true, playerHp: 1 } },
  { id: 'turbo', name: 'Turbo', icon: '⚡', desc: 'Tudo 2x mais rapido.', apply: { speedMul: 2, animalSpeedMul: 2 } },
  { id: 'giant', name: 'Gigante', icon: '🐘', desc: 'Animais enormes com o dobro de vida.', apply: { scale: 2.4, hpMul: 2 } },
  { id: 'mini', name: 'Mini', icon: '🐜', desc: 'Alvos minusculos e rapidos.', apply: { scale: 0.45, animalSpeedMul: 1.7 } },
  { id: 'ghost', name: 'Fantasma', icon: '👻', desc: 'Inimigos quase invisiveis.', apply: { invisible: true } },
  { id: 'horde', name: 'Horda', icon: '🧟', desc: 'Reposicao instantanea de animais.', apply: { horde: true } },
  { id: 'moon', name: 'Gravidade Zero', icon: '🌙', desc: 'Pulos lunares.', apply: { gravity: 7 } },
  { id: 'vampire', name: 'Vampiro', icon: '🩸', desc: 'Recupere 30 HP por abate.', apply: { lifesteal: 30 } },
  { id: 'gold', name: 'Dourado', icon: '💰', desc: 'Drops de dinheiro 5x maiores.', apply: { moneyMul: 5 } },
  { id: 'bossrush', name: 'Boss Rush', icon: '🐲', desc: 'Um boss em TODAS as waves.', apply: { bossRush: true } },
  { id: 'vidro', name: 'Vidro', icon: '🥃', desc: 'Voce tem 1 de vida. Nao tome hit.', apply: { playerHp: 1 } },
  { id: 'tanque', name: 'Tanque', icon: '🚜', desc: 'Muita vida, pouco movimento.', apply: { playerHpMul: 5, speedMul: 0.75 } },
  { id: 'pedra', name: 'Pedra', icon: '🪨', desc: 'Lento e resistente como uma rocha.', apply: { speedMul: 0.6, playerHpMul: 3 } },
  { id: 'slowmo', name: 'Slow-mo', icon: '🐌', desc: 'Tudo em camera lenta.', apply: { speedMul: 0.65, animalSpeedMul: 0.6 } },
  { id: 'canguru', name: 'Canguru', icon: '🦘', desc: 'Pulos gigantes na lua.', apply: { gravity: 5, jumpMul: 1.8 } },
  { id: 'regenerador', name: 'Regenerador', icon: '💚', desc: 'Regenera 5 HP por segundo.', apply: { regen: 5 } },
  { id: 'maratonista', name: 'Maratonista', icon: '🏃', desc: 'Estamina infinita e passos largos.', apply: { infiniteStamina: true, speedMul: 1.25 } },
  { id: 'pesadelo', name: 'Pesadelo', icon: '😱', desc: 'Inimigos rapidos, resistentes e valiosos.', apply: { animalSpeedMul: 1.6, hpMul: 3, moneyMul: 4 } },
  { id: 'sortudo', name: 'Sortudo', icon: '🍀', desc: '+1 token por abate.', apply: { tokenPerKill: 1 } },
  { id: 'megasortudo', name: 'Mega Sortudo', icon: '🎰', desc: '+3 tokens e dinheiro em dobro.', apply: { tokenPerKill: 3, moneyMul: 2 } },
  { id: 'titan', name: 'Titan', icon: '🗿', desc: '10x vida bruta, passos pesados.', apply: { playerHpMul: 10, speedMul: 0.85 } },
  { id: 'furia', name: 'Furia', icon: '😤', desc: 'Inimigos furiosos pagam bem.', apply: { animalSpeedMul: 1.4, moneyMul: 3 } },
  { id: 'elastico', name: 'Elastico', icon: '🤸', desc: 'Gravidade elastica e agilidade alta.', apply: { gravity: 14, jumpMul: 1.5, speedMul: 1.3 } },
  { id: 'formigueiro', name: 'Formigueiro', icon: '🐜', desc: 'Enxame minusculo e veloz.', apply: { scale: 0.35, animalSpeedMul: 2, hpMul: 0.5 } },
  { id: 'colosso', name: 'Colosso', icon: '🗿', desc: 'Bestas colossais que valem fortuna.', apply: { scale: 3.2, hpMul: 4, moneyMul: 3 } },
  { id: 'zumbi', name: 'Zumbi', icon: '🧟', desc: 'Vida dobrada e suga 15 HP por abate.', apply: { lifesteal: 15, playerHpMul: 2 } },
  { id: 'ninja', name: 'Ninja', icon: '🥷', desc: 'Rapido e leve como o vento.', apply: { speedMul: 1.7, gravity: 12 } },
  { id: 'rochaviva', name: 'Rocha Viva', icon: '⛰️', desc: 'Gravidade esmagadora, corpo de ferro.', apply: { playerHpMul: 4, gravity: 30 } },
  { id: 'cacique', name: 'Cacique', icon: '👑', desc: 'Dinheiro 6x, mas a selva acorda.', apply: { moneyMul: 6, animalSpeedMul: 1.2 } },
  { id: 'imortal', name: 'Imortal', icon: '✨', desc: 'Regeneracao massiva de 25 HP/s.', apply: { regen: 25 } }
];

export function getGameMode(id) {
  return GAME_MODES.find(m => m.id === id) || GAME_MODES[0];
}
