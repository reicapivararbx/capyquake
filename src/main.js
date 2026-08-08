import { Menu } from './menu.js';
import { Game } from './game.js';
import { Network } from './network.js';

const menu = new Menu();
const network = new Network();
let game = null;

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

function startGame(opts) {
  game = new Game(opts);
  game.start();
}

menu.onSingleplayer((playerName, map, purchases) => {
  showTutorial(() => startGame({ mode: 'singleplayer', botCount: 5, animalCount: 300, playerName, map, shopPurchases: purchases }));
});

document.getElementById('btn-test-mode').addEventListener('click', () => {
  const playerName = menu.getPlayerName();
  menu.hide();
  showTutorial(() => startGame({ mode: 'test', botCount: 5, animalCount: 300, playerName, map: null }));
});

menu.onMultiplayer(() => {
  menu.showLobby();
  network.connect();
});

menu.onStartGame(() => {
  const name = document.getElementById('lobby-player-name').value.trim() || 'Jogador';
  network.setPlayerInfo(name);
  if (network.connected) network.sendJoin(name);
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

document.getElementById('btn-repeat-tutorial').addEventListener('click', () => {
  localStorage.removeItem('capiquake_tutorial_done');
  settingsScreen.style.display = 'none';
  showTutorial(null);
});

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
  };
  Object.keys(defaults).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = defaults[id];
  });
});

document.getElementById('btn-play-again').addEventListener('click', () => {
  document.getElementById('celebration').style.display = 'none';
  if (game) game.destroy();
  game = null;
  menu.show();
});
