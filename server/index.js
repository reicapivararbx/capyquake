import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map();
let roomIdCounter = 0;

class GameRoom {
  constructor() {
    this.id = roomIdCounter++;
    this.players = new Map();
    this.started = false;
    this.animalCount = 20;
    this.kills = {};
  }

  addPlayer(ws, name) {
    this.players.set(ws, { name, position: { x: 0, y: 1.7, z: 0 }, kills: 0 });
    this.kills[name] = 0;
    this.broadcastPlayers();
  }

  removePlayer(ws) {
    this.players.delete(ws);
    this.broadcastPlayers();
    if (this.players.size === 0) {
      rooms.delete(this.id);
    }
  }

  broadcastPlayers() {
    const playerList = Array.from(this.players.values()).map(p => ({ name: p.name }));
    this.broadcast({ type: 'players', players: playerList });
  }

  startGame(data) {
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

function getAvailableRoom() {
  for (const [, room] of rooms) {
    if (!room.started && room.players.size < 8) return room;
  }
  const room = new GameRoom();
  rooms.set(room.id, room);
  return room;
}

wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'join':
        currentRoom = getAvailableRoom();
        currentRoom.addPlayer(ws, msg.name || 'Anon');
        break;
      case 'startGame':
        if (currentRoom) currentRoom.startGame(msg);
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

console.log(`CapiQuake server running on ws://localhost:${PORT}`);

const lanIps = Object.values(networkInterfaces())
  .flat()
  .filter(i => i && i.family === 'IPv4' && !i.internal)
  .map(i => i.address);
if (lanIps.length) {
  console.log('Jogar na mesma rede (LAN): http://' + lanIps[0] + ':3000');
}
