import { Menu } from './menu.js';
import { Game } from './game.js';
import { Network } from './network.js';
import { setupDevice } from './device.js';
import { MobileControls } from './controls-mobile.js';
import { invalidateKeyBindings } from './keybindings.js';
import { MAPS } from './maps.js';
import { GAME_MODES } from './game-modes.js';
import { WEAPONS } from './weapon.js';
import { ACHIEVEMENTS } from './achievements-data.js';

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

function openModeSelect() {
  const grid = document.getElementById('modes-grid');
  if (grid && !grid.childElementCount) {
    for (const mode of GAME_MODES) {
      const card = document.createElement('button');
      card.className = 'mode-card';
      card.innerHTML = `<span class="mc-icon">${mode.icon}</span><span class="mc-name">${mode.name}</span><span class="mc-desc">${mode.desc}</span>`;
      card.addEventListener('click', () => {
        document.getElementById('mode-select').style.display = 'none';
        if (window.__modeFlow === 'test') {
          startGame({ mode: 'test', botCount: 5, animalCount: 50, playerName: window.__testPlayerName || 'Jogador', map: null, gameMode: mode.id });
        } else {
          const ctx = window.__spCtx || {};
          startGame({ mode: 'singleplayer', botCount: 5, animalCount: 300, playerName: ctx.playerName || menu.getPlayerName(), map: ctx.map, shopPurchases: ctx.purchases, gameMode: mode.id });
        }
      });
      grid.appendChild(card);
    }
  }
  document.getElementById('mode-select').style.display = 'flex';
}

document.getElementById('btn-mode-back').addEventListener('click', () => {
  document.getElementById('mode-select').style.display = 'none';
  menu.show();
});

menu.onSingleplayer((playerName, map, purchases) => {
  window.__spCtx = { playerName, map, purchases };
  window.__modeFlow = 'singleplayer';
  showTutorial(() => openModeSelect());
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

function setMpStatus(text, state) {
  const dot = document.getElementById('mp-dot');
  const label = document.getElementById('mp-status-text');
  if (label) label.textContent = text;
  if (dot) {
    dot.classList.remove('online', 'offline');
    if (state) dot.classList.add(state);
  }
}

menu.onMultiplayer(() => {
  const nameInput = document.getElementById('player-name');
  const mpName = document.getElementById('mp-name');
  if (mpName && !mpName.value.trim() && nameInput) mpName.value = nameInput.value;
  menu.hide();
  document.getElementById('mp-setup').style.display = 'flex';
  setMpStatus(network.connected ? 'Conectado' : 'Conectando...', network.connected ? 'online' : null);
  if (!network.connected) network.connect(mpName ? mpName.value : '');
});

document.getElementById('btn-mp-back').addEventListener('click', () => {
  document.getElementById('mp-setup').style.display = 'none';
  menu.show();
});

document.getElementById('btn-create-lobby').addEventListener('click', () => {
  const name = (document.getElementById('mp-name').value || 'Jogador').trim().slice(0, 12);
  network.setPlayerInfo(name);
  network.createLobby(name);
});

document.getElementById('btn-join-lobby').addEventListener('click', () => {
  const code = (document.getElementById('mp-code').value || '').trim().toUpperCase();
  const errEl = document.getElementById('mp-error');
  if (code.length !== 4) {
    errEl.textContent = 'Digite o codigo de 4 letras.';
    errEl.style.display = 'block';
    return;
  }
  const name = (document.getElementById('mp-name').value || 'Jogador').trim().slice(0, 12);
  network.setPlayerInfo(name);
  network.joinLobby(code, name);
});

network.onLobbyError((message) => {
  const errEl = document.getElementById('mp-error');
  errEl.textContent = message;
  errEl.style.display = 'block';
});

network.onOpen(() => setMpStatus('Conectado', 'online'));
network.onClose(() => {
  const setup = document.getElementById('mp-setup');
  if (setup && setup.style.display === 'flex') setMpStatus('Servidor offline - rode node server/index.js', 'offline');
});

function hueFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

network.onLobby((state) => {
  document.getElementById('mp-setup').style.display = 'none';
  document.getElementById('lobby').style.display = 'flex';
  document.getElementById('lobby-code').textContent = state.code;

  const list = document.getElementById('players-list');
  list.replaceChildren();
  const countEl = document.getElementById('lobby-count');
  if (countEl) countEl.textContent = `${state.players.length}/${state.maxPlayers}`;

  for (let i = 0; i < state.maxPlayers; i++) {
    const slot = document.createElement('div');
    slot.className = 'player-slot';
    const avatar = document.createElement('span');
    avatar.className = 'slot-avatar';
    const info = document.createElement('span');
    info.className = 'slot-info';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'slot-name';
    const sub = document.createElement('span');
    sub.className = 'slot-sub';
    const tag = document.createElement('span');
    tag.className = 'slot-tag';

    const p = state.players[i];
    if (p) {
      const isHost = p.name === state.hostName;
      slot.classList.add('filled');
      const hue = hueFromString(p.name);
      avatar.style.background = `hsl(${hue}, 45%, 38%)`;
      avatar.textContent = p.name.charAt(0).toUpperCase();
      nameSpan.textContent = p.name;
      if (isHost) {
        sub.textContent = 'host · pronto pra cacar';
        tag.textContent = 'HOST';
        tag.classList.add('host');
      } else {
        sub.textContent = 'pronto · na sala';
        tag.textContent = 'READY';
        tag.classList.add('ready');
      }
    } else {
      avatar.textContent = '?';
      nameSpan.textContent = 'Slot aberto';
      sub.textContent = i % 2 === 0 ? 'aguardando capivara' : 'convite por codigo';
      tag.textContent = 'VAZIO';
      tag.classList.add('empty');
    }
    info.appendChild(nameSpan);
    info.appendChild(sub);
    slot.appendChild(avatar);
    slot.appendChild(info);
    slot.appendChild(tag);
    list.appendChild(slot);
  }

  const sb = document.getElementById('lobby-scoreboard');
  if (sb) {
    sb.replaceChildren();
    for (const p of state.players) {
      const entry = document.createElement('div');
      entry.className = 'lr-score-entry';
      const nm = document.createElement('span');
      nm.textContent = p.name.toUpperCase().slice(0, 10);
      const sc = document.createElement('b');
      sc.textContent = String(p.kills || 0).padStart(2, '0');
      entry.appendChild(nm);
      entry.appendChild(sc);
      sb.appendChild(entry);
    }
    const me = state.players.find(pp => pp.name === network.playerName);
    const fragEl = document.getElementById('hud-frag');
    if (fragEl && me) fragEl.textContent = String(me.kills || 0).padStart(2, '0');
  }

  const hostControls = document.getElementById('host-controls');
  const guestWaiting = document.getElementById('guest-waiting');
  if (state.youAreHost) {
    hostControls.style.display = 'flex';
    guestWaiting.style.display = 'none';
  } else {
    hostControls.style.display = 'none';
    guestWaiting.style.display = 'block';
  }
});

setInterval(() => {
  const pingEl = document.getElementById('hud-ping');
  if (pingEl && network.connected && network.ping !== null) {
    pingEl.textContent = network.ping;
  }
  const fpsEl = document.getElementById('hud-fps');
  if (fpsEl && window.__fpsValue) fpsEl.textContent = window.__fpsValue;
}, 1000);

(function fpsMeter() {
  let last = performance.now();
  let frames = 0;
  function tick(now) {
    frames++;
    if (now - last >= 500) {
      window.__fpsValue = Math.round(frames * 1000 / (now - last));
      frames = 0;
      last = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

const hostMapSelLive = document.getElementById('host-map-select');
if (hostMapSelLive) {
  hostMapSelLive.addEventListener('change', () => {
    const prev = document.getElementById('lobby-map-preview');
    if (prev) prev.textContent = 'Mapa: ' + hostMapSelLive.value;
  });
}

const hostMapSelect = document.getElementById('host-map-select');
if (hostMapSelect && !hostMapSelect.options.length) {
  for (const map of MAPS) {
    const opt = document.createElement('option');
    opt.value = map.name;
    opt.textContent = map.name;
    hostMapSelect.appendChild(opt);
  }
}
const hostModeSelect = document.getElementById('host-mode-select');
if (hostModeSelect && !hostModeSelect.options.length) {
  for (const mode of GAME_MODES) {
    const opt = document.createElement('option');
    opt.value = mode.id;
    opt.textContent = mode.icon + ' ' + mode.name;
    hostModeSelect.appendChild(opt);
  }
}

document.getElementById('btn-copy-code').addEventListener('click', function() {
  const code = document.getElementById('lobby-code').textContent;
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
  this.innerHTML = 'CODIGO: <b id="lobby-code">' + code + '</b> ✓';
  setTimeout(() => { this.innerHTML = 'CODIGO: <b id="lobby-code">' + code + '</b> ⧉'; }, 1500);
});

document.getElementById('btn-back-menu').addEventListener('click', () => {
  network.send('leaveLobby', {});
  document.getElementById('lobby').style.display = 'none';
  menu.show();
});

document.getElementById('btn-start-game').addEventListener('click', () => {
  const mapName = document.getElementById('host-map-select').value || null;
  const mapObj = MAPS.find(mp => mp.name === mapName) || null;
  const modeSel = document.getElementById('host-mode-select');
  const gameMode = modeSel ? modeSel.value : 'normal';
  network.startGameAsHost(mapObj, gameMode);
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

const _seqReset = [];
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  if (!'reset'.includes(k) || k === '') { _seqReset.length = 0; return; }
  _seqReset.push(k);
  if (_seqReset.length > 5) _seqReset.shift();
  if (_seqReset.join('') === 'reset') {
    _seqReset.length = 0;
    localStorage.setItem('capiquake_rebirth', '0');
    localStorage.setItem('capiquake_rt', '0');
    localStorage.setItem('capiquake_best_level', '1');
    localStorage.setItem('capiquake_money', '0');
    localStorage.setItem('capiquake_tokens', '0');
    localStorage.setItem('capiquake_purchases', '{"items":[],"revive":0}');
    const g = window.__game;
    if (g) {
      g.money = 0;
      g.tokens = 0;
      g.rebirthLevel = 0;
      g.rebirthMultiplier = 1;
      g.level = 1;
      g.xp = 0;
      g.playerMaxHealth = 200;
      g.playerHealth = 200;
      if (g.hud) {
        g.hud.updateResources(g.tokens, g.money, g.armor);
        g.hud.updateHealth(g.playerHealth, g.playerMaxHealth);
      }
      g.saveBalance && g.saveBalance();
    }
    showToastMessage('RESETADO!');
  }
});

function showToastMessage(text) {
  let toast = document.getElementById('easter-egg-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'easter-egg-toast';
    toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:2200;background:linear-gradient(135deg,#7c3aed,#4c1d95);color:#fff;padding:12px 26px;border-radius:999px;font-family:\'Segoe UI\',system-ui,sans-serif;font-weight:800;letter-spacing:2px;font-size:15px;box-shadow:0 10px 30px rgba(124,58,237,.5);opacity:0;transition:opacity .3s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

const _seqInf = [];
const INF_WORD = 'infmuni';
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  if (!INF_WORD.includes(k) || k === '') { _seqInf.length = 0; return; }
  _seqInf.push(k);
  if (_seqInf.length > INF_WORD.length) _seqInf.shift();
  if (_seqInf.join('') === INF_WORD) {
    _seqInf.length = 0;
    const g = window.__game;
    if (g) {
      g.setLevel && g.setLevel(100);
    g.infiniteAmmo = true;
      const infBtn = document.getElementById('btn-inf-ammo');
      if (infBtn) infBtn.textContent = 'INFINITA: TRUE';
    }
    showToastMessage('MUNICAO INFINITA!');
  }
});

const _seqMg = [];
const MG_WORD = 'minigun';
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  if (!MG_WORD.includes(k) || k === '') { _seqMg.length = 0; return; }
  _seqMg.push(k);
  if (_seqMg.length > MG_WORD.length) _seqMg.shift();
  if (_seqMg.join('') === MG_WORD) {
    _seqMg.length = 0;
    const g = window.__game;
    if (g && g.weapon) {
      if (!g.weapon.inventory.includes('minigun')) g.weapon.addWeapon('minigun', 9999);
      g.updateHotbar && g.updateHotbar();
    }
    showToastMessage('MINIGUN!');
  }
});

const _seqLv = [];
const LV_WORD = 'levelup';
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  if (!LV_WORD.includes(k) || k === '') { _seqLv.length = 0; return; }
  _seqLv.push(k);
  if (_seqLv.length > LV_WORD.length) _seqLv.shift();
  if (_seqLv.join('') === LV_WORD) {
    _seqLv.length = 0;
    const g = window.__game;
    if (g) {
      g.xp = 0;
      g.setLevel(Math.min(100, g.level + 100));
      g.checkAchievements && g.checkAchievements();
    } else {
      const best = Number.parseInt(localStorage.getItem('capiquake_best_level'), 10) || 1;
      localStorage.setItem('capiquake_best_level', String(Math.min(100, best + 100)));
    }
    showToastMessage('LEVEL UP!');
  }
});

const _seqKill = [];
const KILL_WORD = 'kill';
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  if (!KILL_WORD.includes(k) || k === '') { _seqKill.length = 0; return; }
  _seqKill.push(k);
  if (_seqKill.length > KILL_WORD.length) _seqKill.shift();
  if (_seqKill.join('') === KILL_WORD) {
    _seqKill.length = 0;
    openKillAllConfirm();
  }
});

function openKillAllConfirm() {
  let overlay = document.getElementById('killall-overlay');
  if (overlay) { overlay.remove(); }
  overlay = document.createElement('div');
  overlay.id = 'killall-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2100;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.8);';
  overlay.innerHTML = '<div style="background:linear-gradient(180deg,#1c0a12,#12060c);border:1px solid #7f1d1d;border-radius:16px;padding:28px 32px;width:min(380px,90vw);font-family:\'Segoe UI\',system-ui,sans-serif;text-align:center;color:#fff;">' +
    '<h3 style="margin:0 0 14px;color:#f87171;font-size:16px;letter-spacing:2px;">TEM CERTEZA?</h3>' +
    '<div id="killall-step1" style="display:flex;gap:10px;justify-content:center;">' +
    '<button id="killall-yes" style="padding:12px 30px;background:linear-gradient(160deg,#ef4444,#991b1b);border:none;border-radius:10px;color:#fff;font-weight:800;font-family:inherit;font-size:14px;cursor:pointer;">SIM</button>' +
    '<button id="killall-no" style="padding:12px 30px;background:transparent;border:1px solid rgba(255,255,255,.25);border-radius:10px;color:#9aa0b4;font-family:inherit;font-size:13px;cursor:pointer;">NAO</button>' +
    '</div>' +
    '<div id="killall-step2" style="display:none;">' +
    '<p style="margin:0 0 10px;font-size:13px;color:#9aa0b4;">Escreva <b style="color:#f87171;">kill all</b> pra confirmar:</p>' +
    '<input id="killall-input" type="text" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px 18px;font-size:15px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:999px;color:#fff;outline:none;" />' +
    '<button id="killall-confirm" style="margin-top:10px;width:100%;padding:12px;background:linear-gradient(160deg,#ef4444,#991b1b);border:none;border-radius:10px;color:#fff;font-weight:800;font-family:inherit;font-size:14px;cursor:pointer;">CONFIRMAR</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  const step1 = document.getElementById('killall-step1');
  const step2 = document.getElementById('killall-step2');
  document.getElementById('killall-no').addEventListener('click', close);
  document.getElementById('killall-yes').addEventListener('click', () => {
    step1.style.display = 'none';
    step2.style.display = 'block';
    setTimeout(() => document.getElementById('killall-input').focus(), 50);
  });
  const tryConfirm = () => {
    const val = document.getElementById('killall-input').value.trim().toLowerCase();
    if (val !== 'kill all') {
      document.getElementById('killall-input').value = '';
      document.getElementById('killall-input').placeholder = 'exatamente: kill all';
      return;
    }
    close();
    const g = window.__game;
    if (!g) { showToastMessage('SEM PARTIDA ATIVA'); return; }
    let killed = 0;
    for (const t of [...g.targets]) {
      if (t.alive && !t.isProtectedAlly) {
        t.takeDamage(999999);
        if (!t.alive) {
          g.resolveKill(t, g.playerName);
          killed++;
        }
      }
    }
    g.checkAchievements && g.checkAchievements();
    showToastMessage('KILL ALL! ' + killed + ' ABATIDOS');
  };
  document.getElementById('killall-confirm').addEventListener('click', tryConfirm);
  document.getElementById('killall-input').addEventListener('keydown', (ev) => {
    ev.stopPropagation();
    if (ev.key === 'Enter') tryConfirm();
    if (ev.key === 'Escape') close();
  });
}

const _seq7 = [];
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key !== '7') { if (e.key !== '1' && e.key !== '2') _seq7.length = 0; return; }
  _seq7.push(e.key);
  if (_seq7.length > 3) _seq7.shift();
  if (_seq7.length === 3) {
    _seq7.length = 0;
    openAdminPrompt();
  }
});

function openAdminPrompt() {
  let overlay = document.getElementById('admin-code-overlay');
  if (overlay) { overlay.style.display = 'flex'; const inp = document.getElementById('admin-code-input'); if (inp) inp.focus(); return; }
  overlay = document.createElement('div');
  overlay.id = 'admin-code-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2100;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.8);';
  overlay.innerHTML = '<div style="background:linear-gradient(180deg,#16121f,#0e0c13);border:1px solid #3f3a52;border-radius:16px;padding:28px 32px;width:min(380px,90vw);font-family:\'Segoe UI\',system-ui,sans-serif;text-align:center;">' +
    '<h3 style="margin:0 0 14px;color:#a78bfa;font-size:15px;letter-spacing:2px;">DIGITE O CODIGO:</h3>' +
    '<input id="admin-code-input" type="password" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px 18px;font-size:15px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:999px;color:#fff;outline:none;" />' +
    '<div id="admin-code-error" style="color:#ff7b7b;font-size:12px;min-height:16px;margin-top:8px;"></div>' +
    '<button id="admin-code-ok" style="margin-top:6px;width:100%;padding:12px;background:linear-gradient(160deg,#8b5cf6,#6d28d9);border:none;border-radius:10px;color:#fff;font-weight:800;font-family:inherit;font-size:14px;cursor:pointer;">CONFIRMAR</button>' +
    '<button id="admin-code-cancel" style="margin-top:8px;width:100%;padding:9px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#9aa0b4;font-family:inherit;font-size:12px;cursor:pointer;">Cancelar</button>' +
    '</div>';
  document.body.appendChild(overlay);
  const input = document.getElementById('admin-code-input');
  const err = document.getElementById('admin-code-error');
  const close = () => { overlay.style.display = 'none'; input.value = ''; err.textContent = ''; };
  document.getElementById('admin-code-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
  const tryCode = () => {
    if (input.value.trim() === 'IAMADMINOFGAME') {
      close();
      grantAdminPowers();
    } else {
      err.textContent = 'Codigo invalido.';
      input.value = '';
      input.focus();
    }
  };
  document.getElementById('admin-code-ok').addEventListener('click', tryCode);
  input.addEventListener('keydown', (ev) => {
    ev.stopPropagation();
    if (ev.key === 'Enter') tryCode();
    if (ev.key === 'Escape') close();
  });
  setTimeout(() => input.focus(), 50);
}

function grantAdminPowers() {
  const g = window.__game;
  if (!g) return;
  try {
    if (g.weapon) {
      for (const id of Object.keys(WEAPONS)) {
        if (!g.weapon.inventory.includes(id)) g.weapon.addWeapon(id, 9999);
      }
      g.weapon.updateInventoryDisplay();
      g.updateHotbar && g.updateHotbar();
    }
    if (ACHIEVEMENTS.length) {
      for (const def of ACHIEVEMENTS) g.achievements.add(def.id);
      localStorage.setItem('capiquake_achievements', JSON.stringify([...g.achievements]));
    }
    g.infiniteAmmo = true;
    const infBtn = document.getElementById('btn-inf-ammo');
    if (infBtn) infBtn.textContent = 'INFINITA: TRUE';
    g.invincible = true;
    g.invincibleTimer = Infinity;
    g.playerHealth = g.playerMaxHealth;
    if (g.hud) g.hud.updateHealth(g.playerHealth, g.playerMaxHealth);
    g.checkAchievements && g.checkAchievements();
  } catch (err) { console.warn(err); }
  showToastMessage('MODO ADMIN ATIVADO');
}

const _seq = [];
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key !== '1' && e.key !== '2') { _seq.length = 0; return; }
  _seq.push(e.key);
  if (_seq.length > 4) _seq.shift();
  if (_seq.length === 4 && _seq.join('') === '2112') {
    _seq.length = 0;
    showToastMessage('EASTER EGG!');
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
  window.__testPlayerName = menu.getPlayerName();
  window.__modeFlow = 'test';
  menu.hide();
  showTutorial(() => openModeSelect());
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
