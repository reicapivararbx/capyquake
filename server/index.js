import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, normalize, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';
import { handleApi, ensureAdminSeed, attachSession, hasPermission } from './api.js';
import {
  getUserById, findByUsername, banUser, suspendUser, unbanUser,
  giveCoins, giveXp, setLevel, heal, logAdminAction, revokeTargetSessions,
  setCoins, giveTokens, setTokens, setXp, maxStats, addItemToInventory,
  removeItemFromInventory, resetPlayer, changeRole
} from './services.js';

ensureAdminSeed();

const ADMIN_DIR = resolve(fileURLToPath(new URL('.', import.meta.url)), 'admin');
const ADMIN_FILES = new Set(['login.html', 'index.html', 'app.js', 'admin.css']);

// Sub-subdominio do painel administrativo (ex.: admin.m.zanona.com.br).
// Em dev local usa-se admin.localhost:<porta>.
function isAdminHost(req) {
  const host = String(req.headers.host || '').toLowerCase().split(':')[0];
  return host === 'admin.localhost' || host.endsWith('.m.zanona.com.br') && host.startsWith('admin.');
}

const HOST = '0.0.0.0';
const PORT = Number.parseInt(process.env.PORT || '8080', 10);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.obj': 'text/plain; charset=utf-8',
  '.mtl': 'text/plain; charset=utf-8'
};

const rooms = new Map();
let roomIdCounter = 0;

// ---------- chat global (menus, fora do gameplay) ----------

const GLOBAL_CHAT_HISTORY_LIMIT = 40;
const globalChatHistory = [];
const globalChatClients = new Map();

function sanitizeChatText(value, maxLen) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function broadcastGlobalChat(payload) {
  const data = JSON.stringify({ type: 'globalChat', data: payload });
  for (const [ws] of globalChatClients) {
    if (ws.readyState === 1) ws.send(data);
  }
}

function handleGlobalChat(ws, msg) {
  const client = globalChatClients.get(ws);
  if (!client) return;
  const now = Date.now();
  client.times = (client.times || []).filter(t => now - t < 15000);
  if (client.lastMsgAt && now - client.lastMsgAt < 1000) return;
  if (client.times.length >= 6) return;
  const message = sanitizeChatText(msg.message, 150);
  if (!message) return;
  client.lastMsgAt = now;
  client.times.push(now);
  const payload = {
    name: client.name || 'Anon',
    role: client.role || null,
    message,
    ts: now
  };
  globalChatHistory.push(payload);
  if (globalChatHistory.length > GLOBAL_CHAT_HISTORY_LIMIT) globalChatHistory.shift();
  broadcastGlobalChat(payload);
}

const CHAT_COMMANDS = [
  { name: 'kick', params: ['user'], perm: 'users.suspend', destructive: true, desc: 'Desconecta o jogador agora' },
  { name: 'ban', params: ['user'], perm: 'users.ban', destructive: true, desc: 'Bane permanentemente' },
  { name: 'tempban', params: ['user', 'days'], perm: 'users.suspend', destructive: true, desc: 'Ban temporário em dias' },
  { name: 'unban', params: ['user'], perm: 'users.suspend', destructive: false, desc: 'Reativa a conta' },
  { name: 'givecoins', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá moedas' },
  { name: 'removecoins', params: ['user', 'amount'], perm: 'economy.remove', destructive: true, desc: 'Remove moedas' },
  { name: 'setcoins', params: ['user', 'amount'], perm: 'economy.set', destructive: false, desc: 'Define o saldo de moedas' },
  { name: 'givetokens', params: ['user', 'amount'], perm: 'economy.give', destructive: false, desc: 'Dá tokens' },
  { name: 'removetokens', params: ['user', 'amount'], perm: 'economy.remove', destructive: true, desc: 'Remove tokens' },
  { name: 'settokens', params: ['user', 'amount'], perm: 'economy.set', destructive: false, desc: 'Define o saldo de tokens' },
  { name: 'givexp', params: ['user', 'amount'], perm: 'game.giveXp', destructive: false, desc: 'Dá XP' },
  { name: 'setxp', params: ['user', 'amount'], perm: 'game.giveXp', destructive: false, desc: 'Define o XP total' },
  { name: 'setlevel', params: ['user', 'level'], perm: 'game.setLevel', destructive: false, desc: 'Define o nível' },
  { name: 'levelup', params: ['user'], perm: 'game.levelUp', destructive: false, desc: 'Sobe 1 nível' },
  { name: 'heal', params: ['user'], perm: 'game.heal', destructive: false, desc: 'Cura a capivara' },
  { name: 'maxstats', params: ['user'], perm: 'game.maxStats', destructive: false, desc: 'Stats máximos da capivara' },
  { name: 'giveitem', params: ['user', 'item'], perm: 'inventory.give', destructive: false, desc: 'Dá item (ex: ak47 x5)' },
  { name: 'removeitem', params: ['user', 'item'], perm: 'inventory.remove', destructive: true, desc: 'Remove item' },
  { name: 'role', params: ['user', 'role'], perm: 'roles.manage', destructive: true, desc: 'Altera cargo do jogador' },
  { name: 'reset', params: ['user'], perm: 'game.reset', destructive: true, desc: 'Reseta todo progresso do jogador' }
];

function commandsForUser(user) {
  if (!user) return [];
  return CHAT_COMMANDS.filter(c => hasPermission(user, c.perm))
    .map(({ name, params, desc, destructive }) => ({ name, params, desc, destructive }));
}

function resolveTargetUser(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return null;
  if (/^\d+$/.test(value)) return getUserById(Number(value));
  const byName = findByUsername(value.replace(/^@/, ''));
  return byName ? getUserById(byName.id) : null;
}

async function handleChatCommand(ws, msg) {
  const user = ws.chatUser;
  const reply = (ok, message) => {
    try { ws.send(JSON.stringify({ type: 'commandResult', data: { ok, message } })); } catch {}
  };
  if (!user) return reply(false, 'Faça login para usar comandos.');
  if (!hasPermission(user, 'admin.view')) return reply(false, 'Sem permissão.');

  const name = String(msg.name || '').replace(/^\//, '').toLowerCase().trim();
  const command = CHAT_COMMANDS.find(c => c.name === name);
  if (!command) return reply(false, `Comando desconhecido: /${name}`);
  if (!hasPermission(user, command.perm)) {
    logAdminAction(user.id, null, 'COMMAND_DENIED', { command: name }, false);
    return reply(false, `Você não tem permissão para /${name}.`);
  }

  const args = Array.isArray(msg.args) ? msg.args.map(String) : [];
  const target = resolveTargetUser(args[0]);
  if (!target) return reply(false, `Jogador não encontrado: ${args[0] || '(vazio)'}`);
  if (target.id !== user.id && ROLE_RANK_CHECK(target.role, user.role)) {
    return reply(false, 'Alvo com cargo igual ou superior ao seu.');
  }

  const actor = getUserById(user.id);
  const reasonBase = args.slice(command.params.length).join(' ').slice(0, 120) || `/${name} por ${actor.username}`;
  const numArg = (idx, min, max) => {
    const n = Math.trunc(Number(args[idx]));
    if (!Number.isSafeInteger(n) || n < min || n > max) return null;
    return n;
  };

  try {
    switch (command.name) {
      case 'kick':
        revokeTargetSessions(target.id);
        logAdminAction(actor.id, target.id, 'KICK', { reason: reasonBase, via: 'chat-command' }, true);
        return reply(true, `${target.username} foi kickado.`);
      case 'ban':
        banUser(actor, target.id, reasonBase);
        return reply(true, `${target.username} foi banido.`);
      case 'tempban': {
        const days = numArg(1, 1, 365);
        if (!days) return reply(false, 'Dias inválido (1-365).');
        suspendUser(actor, target.id, reasonBase, days * 86400000);
        return reply(true, `${target.username} suspenso por ${days} dias.`);
      }
      case 'unban':
        unbanUser(actor, target.id, reasonBase);
        return reply(true, `${target.username} reativado.`);
      case 'givecoins': {
        const amount = numArg(1, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveCoins(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} moedas para ${target.username}.`);
      }
      case 'removecoins': {
        const amount = numArg(1, 1, 1e12);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveCoins(actor, target.id, -amount, reasonBase);
        return reply(true, `-${amount} moedas de ${target.username}.`);
      }
      case 'setcoins': {
        const amount = numArg(1, 0, 1e12);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setCoins(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem R$ ${amount.toLocaleString('pt-BR')}.`);
      }
      case 'givetokens': {
        const amount = numArg(1, 1, 1e9);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveTokens(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} tokens para ${target.username}.`);
      }
      case 'removetokens': {
        const amount = numArg(1, 1, 1e9);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveTokens(actor, target.id, -amount, reasonBase);
        return reply(true, `-${amount} tokens de ${target.username}.`);
      }
      case 'settokens': {
        const amount = numArg(1, 0, 1e9);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setTokens(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem ${amount} tokens.`);
      }
      case 'givexp': {
        const amount = numArg(1, 1, 1e10);
        if (!amount) return reply(false, 'Quantidade inválida.');
        giveXp(actor, target.id, amount, reasonBase);
        return reply(true, `+${amount} XP para ${target.username}.`);
      }
      case 'setxp': {
        const amount = numArg(1, 0, 1e10);
        if (amount === null) return reply(false, 'Quantidade inválida.');
        setXp(actor, target.id, amount, reasonBase);
        return reply(true, `${target.username} agora tem ${amount} XP.`);
      }
      case 'setlevel': {
        const level = numArg(1, 1, 100);
        if (!level) return reply(false, 'Nível inválido (1-100).');
        setLevel(actor, target.id, level, reasonBase);
        return reply(true, `${target.username} agora é nível ${level}.`);
      }
      case 'levelup': {
        giveXp(actor, target.id, 1, reasonBase);
        return reply(true, `${target.username} subiu de nível.`);
      }
      case 'heal':
        heal(actor, target.id, reasonBase);
        return reply(true, `${target.username} curado.`);
      case 'maxstats':
        maxStats(actor, target.id, reasonBase);
        return reply(true, `Stats de ${target.username} maxados.`);
      case 'giveitem': {
        const itemId = String(args[1] || '').trim();
        if (!itemId) return reply(false, 'Informe o ID do item.');
        const quantity = numArg(2, 1, 999) || 1;
        addItemToInventory(actor, target.id, itemId, quantity, reasonBase);
        return reply(true, `+${quantity}x ${itemId} para ${target.username}.`);
      }
      case 'removeitem': {
        const itemId = String(args[1] || '').trim();
        if (!itemId) return reply(false, 'Informe o ID do item.');
        const quantity = numArg(2, 1, 999) || 1;
        removeItemFromInventory(actor, target.id, itemId, quantity, reasonBase);
        return reply(true, `-${quantity}x ${itemId} de ${target.username}.`);
      }
      case 'role': {
        const newRole = String(args[1] || '').trim().toLowerCase();
        if (!newRole) return reply(false, 'Informe o cargo (ex: citizen, admin, king).');
        changeRole(actor, target.id, newRole, reasonBase);
        return reply(true, `${target.username} agora é ${newRole}.`);
      }
      case 'reset': {
        resetPlayer(actor, target.id, ['coins', 'tokens', 'xp', 'level', 'kills', 'damage', 'matches', 'inventory', 'capybara'], null, reasonBase);
        return reply(true, `Progresso de ${target.username} resetado.`);
      }
      default:
        return reply(false, 'Comando não implementado.');
    }
  } catch (err) {
    return reply(false, err.message || 'Falha ao executar comando.');
  }
}

import { ROLE_RANK as ROLE_RANK_MAP } from './validation.js';
function ROLE_RANK_CHECK(targetRole, actorRole) {
  return (ROLE_RANK_MAP[targetRole] ?? 0) >= (ROLE_RANK_MAP[actorRole] ?? 0);
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateRoomCode() {
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  } while ([...rooms.values()].some(r => r.code === code));
  return code;
}

class GameRoom {
  constructor() {
    this.id = roomIdCounter++;
    this.code = generateRoomCode();
    this.players = new Map();
    this.host = null;
    this.started = false;
    this.animalCount = 20;
    this.kills = {};
  }

  addPlayer(ws, name) {
    const isFirst = this.players.size === 0;
    this.players.set(ws, {
      name,
      position: { x: 0, y: 1.7, z: 0 },
      rotation: 0,
      kills: 0,
      country: ws.country || null
    });
    this.kills[name] = 0;
    if (isFirst || !this.host || !this.players.has(this.host)) {
      this.host = ws;
    }
    this.broadcastLobby();
  }

  removePlayer(ws) {
    const wasHost = this.host === ws;
    this.players.delete(ws);
    if (wasHost) {
      const next = this.players.keys().next();
      this.host = next.done ? null : next.value;
      if (!next.done && !this.started) {
        this.broadcast({ type: 'chat', data: { name: '[SERVIDOR]', color: '#a78bfa', message: 'O host saiu. Novo host: ' + this.players.get(this.host).name, ts: Date.now() } });
      }
    }
    this.broadcastLobby();
    if (this.players.size === 0) {
      rooms.delete(this.id);
    }
  }

  isHost(ws) {
    return this.host === ws;
  }

  broadcastLobby() {
    const playerList = Array.from(this.players.values()).map(p => ({
      name: p.name,
      kills: p.kills || 0,
      country: p.country || null
    }));
    const hostName = this.host && this.players.get(this.host) ? this.players.get(this.host).name : '';
    for (const [socket] of this.players) {
      if (socket.readyState !== 1) continue;
      socket.send(JSON.stringify({
        type: 'lobby',
        code: this.code,
        hostName,
        players: playerList,
        maxPlayers: 6,
        started: this.started,
        youAreHost: this.isHost(socket)
      }));
    }
  }

  startGame(data, ws) {
    if (!this.isHost(ws)) return false;
    this.started = true;
    const d = data || {};
    this.broadcast({
      type: 'gameStart',
      data: {
        map: d.map || null,
        gameMode: d.gameMode || 'normal',
        animalCount: d.animalCount || this.animalCount,
        bots: ['UmLegalGaucho', 'Bot_Mineiro', 'Bot_Paulista', 'Bot_Carioca', 'Bot_Baiano']
      }
    });
    return true;
  }

  handleChat(ws, data) {
    const name = String((data && data.name) || 'Anon').trim().slice(0, 30);
    const color = String((data && data.color) || '#ffffff').slice(0, 20);
    const message = String((data && data.message) || '').trim().slice(0, 150);
    if (!message) return;
    this.broadcast({ type: 'chat', data: { name, color, message, ts: Date.now() } });
  }

  handleKill(ws, targetId) {
    const player = this.players.get(ws);
    if (player) {
      player.kills++;
      this.kills[player.name] = player.kills;
      this.broadcast({ type: 'kill', data: { player: player.name, targetId } });
    }
  }

  handlePosition(ws, position, rotation) {
    const player = this.players.get(ws);
    if (player) {
      player.position = position;
      player.rotation = rotation;
      const state = {};
      state[player.name] = { position: player.position, rotation: player.rotation };
      for (const [socket] of this.players) {
        if (socket !== ws && socket.readyState === 1) {
          socket.send(JSON.stringify({ type: 'stateUpdate', state }));
        }
      }
    }
  }

  broadcast(msg) {
    const data = JSON.stringify(msg);
    for (const [socket] of this.players) {
      if (socket.readyState === 1) {
        socket.send(data);
      }
    }
  }
}

function findRoomByCode(code) {
  const wanted = String(code || '').trim().toUpperCase();
  for (const [, room] of rooms) {
    if (room.code === wanted) return room;
  }
  return null;
}

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function getStaticFilePath(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname.split('?')[0]);
  } catch {
    return null;
  }

  const requestPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = normalize(requestPath).replace(/^[/\\]+/, '');
  const filePath = resolve(join(DIST_DIR, normalizedPath));
  const rel = relative(DIST_DIR, filePath);

  if (rel.startsWith('..') || rel === '..' || filePath === DIST_DIR) {
    return null;
  }

  return filePath;
}

async function serveStatic(res, pathname) {
  const filePath = getStaticFilePath(pathname);
  if (!filePath) {
    sendNotFound(res);
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    sendNotFound(res);
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      sendNotFound(res);
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': body.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(body);
  } catch {
    sendNotFound(res);
  }
}

async function serveAdmin(req, res, pathname) {
  let file;
  if (pathname === '/login' || pathname === '/admin/login') file = 'login.html';
  else if (pathname === '/app.js' || pathname === '/admin/app.js') file = 'app.js';
  else if (pathname === '/admin.css' || pathname === '/admin/admin.css') file = 'admin.css';
  else if (pathname === '/' || pathname === '/index.html' || pathname === '/admin' || pathname === '/admin/') file = 'index.html';
  else { sendNotFound(res); return; }
  try {
    const body = await readFile(join(ADMIN_DIR, file));
    res.writeHead(200, {
      'Content-Type': file.endsWith('.js') ? 'text/javascript; charset=utf-8'
        : file.endsWith('.css') ? 'text/css; charset=utf-8'
        : 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD' && !req.url.startsWith('/api/')) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  let pathname = '/';
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {}

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname, new URL(req.url, 'http://x').searchParams);
    return;
  }

  // Painel administrativo no sub-subdominio dedicado (ex.: admin.m.zanona.com.br).
  if (isAdminHost(req)) {
    serveAdmin(req, res, pathname);
    return;
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    serveAdmin(req, res, pathname);
    return;
  }

  serveStatic(res, pathname);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  let pathname;
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    socket.destroy();
    return;
  }

  if (pathname !== '/ws') {
    socket.destroy();
    return;
  }

  const fakeReq = { headers: req.headers };
  attachSession(fakeReq);

  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.chatUser = fakeReq.user || null;
    // País via Cloudflare em produção; nunca expõe o IP bruto.
    const cf = req.headers['cf-ipcountry'];
    if (typeof cf === 'string' && /^[A-Za-z]{2}$/.test(cf)) {
      ws.country = cf.toUpperCase();
    } else {
      const lang = String(req.headers['accept-language'] || '').match(/[a-z]{2}-([A-Z]{2})/);
      ws.country = lang ? lang[1] : null;
    }
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  let currentRoom = null;

  const chatName = sanitizeChatText(ws.chatUser?.displayName || ws.chatUser?.username || '', 24);
  globalChatClients.set(ws, {
    name: chatName || null,
    role: ws.chatUser?.role || null,
    userId: ws.chatUser?.id ?? null
  });
  ws.send(JSON.stringify({ type: 'globalChatHistory', data: [...globalChatHistory] }));

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'createLobby': {
        if (currentRoom) currentRoom.removePlayer(ws);
        const room = new GameRoom();
        rooms.set(room.id, room);
        currentRoom = room;
        room.addPlayer(ws, String(msg.name || 'Anon').slice(0, 12));
        ws.send(JSON.stringify({ type: 'lobbyCreated', code: room.code }));
        break;
      }
      case 'joinLobby': {
        if (currentRoom) currentRoom.removePlayer(ws);
        const room = findRoomByCode(msg.code);
        if (!room) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Lobby nao encontrado. Confira o codigo.' }));
          currentRoom = null;
          break;
        }
        if (room.started) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Essa partida ja comecou.' }));
          break;
        }
        if (room.players.size >= 6) {
          ws.send(JSON.stringify({ type: 'lobbyError', message: 'Lobby cheio (6/6).' }));
          break;
        }
        currentRoom = room;
        room.addPlayer(ws, String(msg.name || 'Anon').slice(0, 12));
        break;
      }
      case 'startGame': {
        if (!currentRoom) break;
        const ok = currentRoom.startGame(msg, ws);
        if (!ok) ws.send(JSON.stringify({ type: 'lobbyError', message: 'Apenas o host pode iniciar a partida.' }));
        break;
      }
      case 'leaveLobby':
        if (currentRoom) currentRoom.removePlayer(ws);
        currentRoom = null;
        break;
      case 'position':
        if (currentRoom) currentRoom.handlePosition(ws, msg.position, msg.rotation);
        break;
      case 'kill':
        if (currentRoom) currentRoom.handleKill(ws, msg.targetId);
        break;
      case 'chat':
        if (currentRoom) currentRoom.handleChat(ws, msg);
        break;
      case 'globalChat':
        handleGlobalChat(ws, msg);
        break;
      case 'listCommands':
        ws.send(JSON.stringify({ type: 'commandList', data: commandsForUser(ws.chatUser) }));
        break;
      case 'command':
        handleChatCommand(ws, msg);
        break;
      case 'setChatName': {
        const client = globalChatClients.get(ws);
        if (client && !client.userId) {
          client.name = sanitizeChatText(msg.name, 12) || 'Anon';
        }
        break;
      }
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', t: msg.t }));
        break;
      case 'testMode':
        ws.send(JSON.stringify({ type: 'testModeAck', ok: true }));
        break;
    }
  });

  ws.on('close', () => {
    globalChatClients.delete(ws);
    if (currentRoom) currentRoom.removePlayer(ws);
  });
});

server.listen(PORT, HOST, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : PORT;
  console.log(`CapiQuake server running on http://localhost:${actualPort}`);
  console.log(`CapiQuake WebSocket available on ws://localhost:${actualPort}/ws`);

  const lanIps = Object.values(networkInterfaces())
    .flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal)
    .map(i => i.address);
  if (lanIps.length) {
    console.log('Jogar na mesma rede (LAN): http://' + lanIps[0] + ':' + actualPort);
  }
});
