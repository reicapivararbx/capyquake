import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, normalize, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';

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
    this.players.set(ws, { name, position: { x: 0, y: 1.7, z: 0 }, rotation: 0, kills: 0 });
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
    const playerList = Array.from(this.players.values()).map(p => ({ name: p.name }));
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

async function serveStatic(req, res) {
  let pathname;
  try {
    pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    sendNotFound(res);
    return;
  }

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

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  serveStatic(req, res);
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

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  let currentRoom = null;

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
      case 'testMode':
        ws.send(JSON.stringify({ type: 'testModeAck', ok: true }));
        break;
    }
  });

  ws.on('close', () => {
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
