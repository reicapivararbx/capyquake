import { Menu } from './menu.js';
import { Game } from './game.js';
import { Network } from './network.js';
import { setupDevice } from './device.js';
import { MobileControls } from './controls-mobile.js';
import { invalidateKeyBindings } from './keybindings.js';

const currentDevice = setupDevice();
const menu = new Menu();
const network = new Network();
let game = null;
let mobileControls = null;
let shopPreviousScreen = 'menu';

const TUTORIAL_STEPS = [
  'Bem-vindo ao CapiQuake! Use [W][A][S][D] para se mover e o MOUSE para atirar.',
  'Aproxime-se de um baú e pressione [E] para pegar armas e munição.',
  'Pressione [F] para usar a habilidade Void (se tiver).',
  'Pressione [F3] para alternar a câmera.',
  'Pressione [T] para soltar o peido!',
  'Segure [CTRL] para mirar com a sniper.',
  'Pressione [ESC] para abrir o inventário.',
];

let tutorialStep = 0;
let tutorialOnDone = null;

function showTutorial(onDone) {
  if (localStorage.getItem('capiquake_tutorial_done')) {
    if (onDone) onDone();
    return;
  }
  tutorialStep = 0;
  tutorialOnDone = onDone;
  const text = document.getElementById('tutorial-text');
  text.textContent = TUTORIAL_STEPS[0];
  document.getElementById('tutorial').style.display = 'flex';
}

function hideTutorial(completed) {
  document.getElementById('tutorial').style.display = 'none';
  if (completed) localStorage.setItem('capiquake_tutorial_done', '1');
}

function finishTutorial() {
  const cb = tutorialOnDone;
  tutorialOnDone = null;
  if (cb) cb();
}

document.getElementById('btn-skip-tutorial').addEventListener('click', () => {
  hideTutorial(true);
  finishTutorial();
});

document.getElementById('btn-tutorial-next').addEventListener('click', () => {
  tutorialStep += 1;
  if (tutorialStep >= TUTORIAL_STEPS.length) {
    hideTutorial(true);
    finishTutorial();
  } else {
    document.getElementById('tutorial-text').textContent = TUTORIAL_STEPS[tutorialStep];
  }
});

let _startingGame = false;
function startGame(opts) {
  if (_startingGame) return;
  _startingGame = true;
  setTimeout(() => { _startingGame = false; }, 1000);
  if (mobileControls) {
    mobileControls.destroy();
    mobileControls = null;
  }
  game = new Game(opts);
  window.__game = game;
  game.start();
  if (document.body.dataset.device === 'mobile' && game.player) {
    mobileControls = new MobileControls(game.player);
  }
  document.getElementById('btn-ingame-shop').style.display = 'block';
  document.getElementById('btn-hud-camera').style.display = 'block';
  document.getElementById('btn-hud-inventory').style.display = 'block';
}

function hideAllScreens() {
  document.getElementById('achievements-screen').style.display = 'none';
  menu.hideStandaloneShop();
}

function showMenu() {
  hideAllScreens();
  menu.show();
  document.getElementById('btn-ingame-shop').style.display = 'none';
  document.getElementById('btn-hud-camera').style.display = 'none';
  document.getElementById('btn-hud-inventory').style.display = 'none';
}

window.returnToMainMenu = function() {
  if (game) {
    game.destroy();
    game = null;
  }
  if (mobileControls) {
    mobileControls.destroy();
    mobileControls = null;
  }
  showMenu();
};

menu.onSingleplayer((playerName, map, purchases) => {
  showTutorial(() => startGame({ mode: 'singleplayer', botCount: 5, animalCount: 300, playerName, map, shopPurchases: purchases }));
});

function getLobbyPlayerName() {
  const lobbyInput = document.getElementById('lobby-player-name');
  const lobbyName = lobbyInput ? lobbyInput.value.trim() : '';
  return lobbyName || menu.getPlayerName();
}

function setLobbyStatus(text, state) {
  const dot = document.querySelector('.lobby-status .status-dot');
  const label = document.getElementById('lobby-status-text');
  if (label) label.textContent = text;
  if (dot) {
    dot.classList.remove('online', 'offline');
    if (state) dot.classList.add(state);
  }
}

menu.onMultiplayer(() => {
  const playerName = getLobbyPlayerName();
  const lobbyInput = document.getElementById('lobby-player-name');
  if (lobbyInput && !lobbyInput.value.trim()) lobbyInput.value = playerName;
  network.setPlayerInfo(playerName);
  menu.showLobby();
  setLobbyStatus('Conectando...', null);
  network.connect(playerName);
});

network.onOpen(() => setLobbyStatus('Conectado - aguardando jogadores', 'online'));
network.onClose(() => {
  const lobbyEl = document.getElementById('lobby');
  if (lobbyEl && lobbyEl.style.display === 'flex') {
    setLobbyStatus('Servidor offline - rode node server/index.js', 'offline');
  }
});

menu.onStartGame(() => {
  const name = getLobbyPlayerName();
  network.setPlayerInfo(name);
  if (network.connected && !network.joined) {
    network.joined = true;
    network.sendJoin(name);
  }
  menu.showMapVote((map) => {
    network.send('startGame', { map, animalCount: 20 });
  });
});

menu.onBackToMenu(() => {
  network.disconnect();
  menu.hideLobby();
  menu.show();
});

network.onGameStart((data) => {
  menu.hideLobby();
  menu.hideMapVote();
  game = new Game({ mode: 'multiplayer', network, playerName: network.playerName, ...data });
  game.start();
});

network.onPlayersUpdate((players) => {
  menu.updatePlayersList(players);
});

network.onChat((data) => {
  if (game && typeof game.addChatMessage === 'function') {
    game.addChatMessage(data.name, data.color, data.message);
  }
});

const chatInput = document.getElementById('chat-input');
const closeChat = () => {
  chatInput.value = '';
  chatInput.style.display = 'none';
  chatInput.blur();
};

chatInput.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') {
    if (network.sendChat(chatInput.value)) {
      chatInput.value = '';
    }
    closeChat();
  } else if (e.key === 'Escape') {
    closeChat();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  if (!game || game.mode !== 'multiplayer' || !game.running) return;
  const active = document.activeElement;
  if (active && active.tagName === 'INPUT') return;
  e.preventDefault();
  chatInput.style.display = 'block';
  chatInput.focus();
});

function rbMultipliers(level) {
  return {
    money: 'x' + (1 + level),
    tokens: 'x' + (1 + level * 0.5),
    xp: 'x' + (1 + level),
    hp: 'x' + Math.pow(2, level)
  };
}

function readRbBalances() {
  const int = (k) => {
    const v = Number.parseInt(localStorage.getItem(k), 10);
    return Number.isSafeInteger(v) && v >= 0 ? v : 0;
  };
  return { tokens: int('capiquake_tokens'), money: int('capiquake_money') };
}

function refreshRebirthPanel() {
  const level = Number.parseInt(localStorage.getItem('capiquake_rebirth'), 10) || 0;
  const mult = rbMultipliers(level);
  document.getElementById('rb-current').textContent = level;
  document.getElementById('rb-rt').textContent = Number.parseInt(localStorage.getItem('capiquake_rt'), 10) || 0;
  document.getElementById('rb-mult-money').textContent = mult.money;
  document.getElementById('rb-mult-tokens').textContent = mult.tokens;
  document.getElementById('rb-mult-xp').textContent = mult.xp;
  document.getElementById('rb-mult-hp').textContent = mult.hp;

  const bal = readRbBalances();
  const bestLevel = Number.parseInt(localStorage.getItem('capiquake_best_level'), 10) || 1;
  const reqs = [
    { el: 'rb-req-level', val: 'rb-val-level', ok: bestLevel >= 100, text: bestLevel + ' / 100' },
    { el: 'rb-req-tokens', val: 'rb-val-tokens', ok: bal.tokens >= 10000, text: bal.tokens.toLocaleString('pt-BR') + ' / 10.000' },
    { el: 'rb-req-money', val: 'rb-val-money', ok: bal.money >= 1000000, text: bal.money.toLocaleString('pt-BR') + ' / 1.000.000' }
  ];
  let allOk = true;
  for (const r of reqs) {
    const reqEl = document.getElementById(r.el);
    reqEl.classList.toggle('done', r.ok);
    document.getElementById(r.val).textContent = r.text;
    if (!r.ok) allOk = false;
  }
  const goBtn = document.getElementById('btn-do-rebirth');
  goBtn.disabled = !allOk;
  goBtn.textContent = allOk ? 'FAZER REBIRTH' : 'REQUISITOS INCOMPLETOS';
  document.getElementById('rb-warning').style.display = allOk ? 'block' : 'none';
}

document.getElementById('btn-rebirth-menu').addEventListener('click', () => {
  refreshRebirthPanel();
  document.getElementById('rebirth-screen').style.display = 'flex';
});

document.getElementById('btn-rebirth-close').addEventListener('click', () => {
  document.getElementById('rebirth-screen').style.display = 'none';
});

let rbConfirmPending = false;
document.getElementById('btn-do-rebirth').addEventListener('click', function() {
  if (this.disabled) return;
  if (!rbConfirmPending) {
    rbConfirmPending = true;
    this.textContent = 'TEM CERTEZA? ZERA DINHEIRO E TOKENS!';
    setTimeout(() => {
      rbConfirmPending = false;
      if (this && document.getElementById('btn-do-rebirth')) refreshRebirthPanel();
    }, 4000);
    return;
  }
  rbConfirmPending = false;
  const level = (Number.parseInt(localStorage.getItem('capiquake_rebirth'), 10) || 0) + 1;
  const rt = (Number.parseInt(localStorage.getItem('capiquake_rt'), 10) || 0) + 1;
  localStorage.setItem('capiquake_rebirth', String(level));
  localStorage.setItem('capiquake_rt', String(rt));
  localStorage.setItem('capiquake_tokens', '0');
  localStorage.setItem('capiquake_money', '0');
  refreshRebirthPanel();
  this.textContent = '🔄 REBIRTH ' + level + ' FEITO! BÔNUS PERMANENTES ATIVOS';
});

const settingsScreen = document.getElementById('settings-screen');
document.getElementById('btn-settings').addEventListener('click', () => {
  settingsScreen.style.display = settingsScreen.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('btn-settings-quit').addEventListener('click', () => {
  settingsScreen.style.display = 'none';
});

document.getElementById('btn-pause').addEventListener('click', () => {
  if (!game || !game.running) return;
  if (game.mode !== 'singleplayer' && game.mode !== 'test') return;
  game.togglePause();
});

const _seq = [];
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key !== '1' && e.key !== '2') { _seq.length = 0; return; }
  _seq.push(e.key);
  if (_seq.length > 4) _seq.shift();
  if (_seq.length === 4 && _seq.join('') === '2112') {
    _seq.length = 0;
    let toast = document.getElementById('easter-egg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'easter-egg-toast';
      toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:2000;background:linear-gradient(135deg,#7c3aed,#4c1d95);color:#fff;padding:12px 26px;border-radius:999px;font-family:\'Segoe UI\',system-ui,sans-serif;font-weight:800;letter-spacing:2px;font-size:15px;box-shadow:0 10px 30px rgba(124,58,237,.5);opacity:0;transition:opacity .3s;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = 'EASTER EGG!';
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    const g = window.__game;
    if (g) {
      g.money += 1000000;
      g.tokens += 1000000;
      g.saveBalance();
      if (g.hud) g.hud.updateResources(g.tokens, g.money, g.armor);
    } else {
      const int = (k) => {
        const v = Number.parseInt(localStorage.getItem(k), 10);
        return Number.isSafeInteger(v) && v >= 0 ? v : 0;
      };
      localStorage.setItem('capiquake_money', String(int('capiquake_money') + 1000000));
      localStorage.setItem('capiquake_tokens', String(int('capiquake_tokens') + 1000000));
    }
  }
});

document.getElementById('btn-hud-camera').addEventListener('click', () => {
  if (!game || !game.player || !game.running) return;
  game.player.toggleCamera();
});

document.getElementById('btn-hud-inventory').addEventListener('click', () => {
  if (!game || !game.running) return;
  game.toggleInventoryScreen();
});

document.getElementById('btn-repeat-tutorial').addEventListener('click', () => {
  localStorage.removeItem('capiquake_tutorial_done');
  settingsScreen.style.display = 'none';
  showTutorial(null);
});

function saveSettings() {
  const settings = {};
  document.querySelectorAll('.key-bindings input').forEach(input => {
    settings[input.id] = input.value;
  });
  localStorage.setItem('capiquake_settings', JSON.stringify(settings));
  invalidateKeyBindings();
}

function loadSettings() {
  const saved = localStorage.getItem('capiquake_settings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      Object.keys(settings).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = settings[id];
      });
    } catch (e) {
      console.warn('Erro ao carregar configurações:', e);
    }
  }
}

function keyLabelFromEvent(e) {
  if (e.code === 'Space') return ' ';
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') return 'SHIFT';
  if (e.code === 'ControlLeft' || e.code === 'ControlRight') return 'CTRL';
  if (e.code === 'AltLeft' || e.code === 'AltRight') return 'ALT';
  if (e.code === 'Escape') return 'ESC';
  if (/^F\d{1,2}$/.test(e.code)) return e.code;
  if (e.key.length === 1) return e.key.toUpperCase();
  return null;
}

function checkKeyConflicts() {
  const values = [...document.querySelectorAll('.key-bindings input')]
    .map(i => i.value.trim().toUpperCase());
  const dup = values.some((v, i) => v && values.indexOf(v) !== i);
  const warn = document.getElementById('key-conflict-warning');
  if (warn) warn.style.display = dup ? 'block' : 'none';
}

document.querySelectorAll('.key-bindings input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.code === 'Escape') {
      input.blur();
      return;
    }
    const label = keyLabelFromEvent(e);
    if (!label) return;
    input.value = label;
    input.blur();
    checkKeyConflicts();
    saveSettings();
  });
});

loadSettings();

document.getElementById('btn-reset-keys').addEventListener('click', () => {
  const defaults = {
    'key-move-forward': 'W',
    'key-move-back': 'S',
    'key-move-left': 'A',
    'key-move-right': 'D',
    'key-jump': ' ',
    'key-sprint': 'SHIFT',
    'key-pickup': 'E',
    'key-void': 'F',
    'key-camera': 'F3',
    'key-fart': 'T',
    'key-emotes': 'B',
    'key-sniper': 'CTRL',
    'key-inventory': 'ESC',
    'key-drop': 'Z',
    'key-grenade': 'G',
    'key-speedrush': 'H',
    'key-pause': 'F2',
  };
  Object.keys(defaults).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = defaults[id];
  });
  document.getElementById('key-conflict-warning').style.display = 'none';
  saveSettings();
  document.getElementById('settings-saved').style.display = 'block';
  setTimeout(() => {
    document.getElementById('settings-saved').style.display = 'none';
  }, 2000);
});

document.getElementById('btn-settings-quit').addEventListener('click', () => {
  saveSettings();
  settingsScreen.style.display = 'none';
});

document.getElementById('btn-test-mode').addEventListener('click', () => {
  settingsScreen.style.display = 'none';
  const playerName = menu.getPlayerName();
  menu.hide();
  showTutorial(() => startGame({ mode: 'test', botCount: 5, animalCount: 50, playerName, map: null }));
});

document.getElementById('btn-play-again').addEventListener('click', () => {
  document.getElementById('celebration').style.display = 'none';
  if (game) game.destroy();
  game = null;
  document.getElementById('btn-ingame-shop').style.display = 'none';
  menu.show();
});

document.getElementById('btn-shop-menu').addEventListener('click', () => {
  shopPreviousScreen = 'menu';
  window.__shopPreviousScreen = 'menu';
  menu.hide();
  menu.showStandaloneShop();
});

document.getElementById('btn-achievements-menu').addEventListener('click', () => {
  menu.hide();
  showAchievementsScreen();
});

document.getElementById('btn-ingame-shop').addEventListener('click', () => {
  if (!game || !game.running) return;
  shopPreviousScreen = game.mode;
  window.__shopPreviousScreen = game.mode;
  menu.showStandaloneShop();
});

document.getElementById('btn-close-achievements').addEventListener('click', () => {
  document.getElementById('achievements-screen').style.display = 'none';
  showMenu();
});

function showAchievementsScreen() {
  const screen = document.getElementById('achievements-screen');
  const list = document.getElementById('achievements-list');
  const countEl = document.getElementById('achievements-count');
  if (!screen || !list) return;

  const saved = JSON.parse(localStorage.getItem('capiquake_achievements') || '[]');
  const unlockedSet = new Set(saved);
  const allAchievements = window.__ACHIEVEMENTS_DATA || [];
  const unlockedCount = allAchievements.filter(a => unlockedSet.has(a.id)).length;
  if (countEl) countEl.textContent = unlockedCount + ' / ' + allAchievements.length + ' DESBLOQUEADAS';

  const rarityFilters = document.getElementById('achievements-rarity-filters');
  if (rarityFilters && !rarityFilters.hasChildNodes()) {
    const rarities = ['all', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIVINE', 'CURSED'];
    const rarityLabels = { all: 'TODAS', COMMON: 'Comum', UNCOMMON: 'Incomum', RARE: 'Raro', EPIC: 'Épico', LEGENDARY: 'Lendário', MYTHIC: 'Mítico', DIVINE: 'Divino', CURSED: 'Amaldiçoado' };
    rarities.forEach(r => {
      const btn = document.createElement('button');
      btn.textContent = rarityLabels[r] || r;
      btn.dataset.rarity = r;
      if (r === 'all') btn.classList.add('active');
      btn.addEventListener('click', () => {
        rarityFilters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAchievements(unlockedSet, getActiveStatusFilter(), r === 'all' ? null : r);
      });
      rarityFilters.appendChild(btn);
    });
  }

  const filtersEl = document.getElementById('achievements-filters');
  if (filtersEl && !filtersEl._bound) {
    filtersEl._bound = true;
    filtersEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const activeRarity = getActiveRarityFilter();
        renderAchievements(unlockedSet, btn.dataset.filter, activeRarity);
      });
    });
  }

  renderAchievements(unlockedSet, 'all', null);
  screen.style.display = 'flex';
}

function getActiveStatusFilter() {
  const btn = document.querySelector('#achievements-filters button.active');
  return btn ? btn.dataset.filter : 'all';
}

function getActiveRarityFilter() {
  const btn = document.querySelector('#achievements-rarity-filters button.active');
  if (!btn || btn.dataset.rarity === 'all') return null;
  return btn.dataset.rarity;
}

function renderAchievements(unlockedSet, statusFilter, rarityFilter) {
  const list = document.getElementById('achievements-list');
  if (!list) return;
  list.innerHTML = '';
  const allAchievements = window.__ACHIEVEMENTS_DATA || [];
  let filtered = allAchievements;

  if (statusFilter === 'unlocked') filtered = filtered.filter(a => unlockedSet.has(a.id));
  else if (statusFilter === 'locked') filtered = filtered.filter(a => !unlockedSet.has(a.id));
  if (rarityFilter) filtered = filtered.filter(a => a.rarity === rarityFilter);

  filtered.forEach(a => {
    const unlocked = unlockedSet.has(a.id);
    const card = document.createElement('div');
    card.className = 'achievement-card' + (unlocked ? ' unlocked' : '');

    const top = document.createElement('div');
    top.className = 'achievement-top';
    const name = document.createElement('span');
    name.className = 'achievement-name';
    name.textContent = a.name;
    const rarity = document.createElement('span');
    rarity.className = 'achievement-rarity rarity-' + (a.rarity || 'common').toLowerCase();
    rarity.textContent = a.rarity || 'COMMON';
    top.appendChild(name);
    top.appendChild(rarity);
    card.appendChild(top);

    const desc = document.createElement('div');
    desc.className = 'achievement-desc';
    desc.textContent = a.description || '';
    card.appendChild(desc);

    if (a.reward) {
      const parts = [];
      if (a.reward.money) parts.push('💰 R$' + a.reward.money.toLocaleString('pt-BR'));
      if (a.reward.tokens) parts.push('🪙 ' + a.reward.tokens);
      if (parts.length) {
        const rewardEl = document.createElement('div');
        rewardEl.className = 'achievement-reward';
        rewardEl.textContent = 'Recompensa: ' + parts.join(' + ');
        card.appendChild(rewardEl);
      }
    }

    if (a.target && a.target > 1) {
      const saved = JSON.parse(localStorage.getItem('capiquake_achievement_progress') || '{}');
      const progress = unlocked ? a.target : (saved[a.id] || 0);
      const progressEl = document.createElement('div');
      progressEl.className = 'achievement-progress';
      progressEl.textContent = Math.min(progress, a.target) + ' / ' + a.target;
      card.appendChild(progressEl);

      const barBg = document.createElement('div');
      barBg.className = 'achievement-progress-bar';
      const barFill = document.createElement('div');
      barFill.className = 'achievement-progress-fill';
      barFill.style.width = Math.min(100, (progress / a.target) * 100) + '%';
      barBg.appendChild(barFill);
      card.appendChild(barBg);
    }

    const status = document.createElement('div');
    status.className = 'achievement-status ' + (unlocked ? 'unlocked' : 'locked');
    status.textContent = unlocked ? '✓ DESBLOQUEADA' : '🔒 BLOQUEADA';
    card.appendChild(status);

    list.appendChild(card);
  });
}
