export class Network {
  constructor() {
    this.ws = null;
    this.callbacks = {};
    this.connected = false;
    this.joined = false;
    this.playerName = '';
    this.color = '#ffffff';
    this.lastChatTime = 0;
    this._serverUrl = null;
    this._shouldReconnect = true;
    this._reconnectTimer = null;
    this.ping = null;
    this._pingInterval = null;
    this.rawListeners = [];
  }

  onRawMessage(fn) {
    if (typeof fn === 'function') this.rawListeners.push(fn);
  }

  connect(name) {
    if (name) this.setPlayerInfo(name);
    const intendedPlayerName = this.playerName || 'Jogador';
    this.playerName = intendedPlayerName;

    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    this._shouldReconnect = true;
    if (!this._serverUrl) {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      this._serverUrl = `${protocol}//${location.host}/ws`;
    }
    this.ws = new WebSocket(this._serverUrl);

    this.ws.onopen = () => {
      this.connected = true;
      if (!this._pingInterval) {
        this._pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === 1) this.send('ping', { t: Date.now() });
        }, 4000);
      }
      if (this.callbacks.open) this.callbacks.open();

    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'players':
          if (this.callbacks.playersUpdate) this.callbacks.playersUpdate(msg.players);
          break;
        case 'lobbyCreated':
          this.currentCode = msg.code;
          break;
        case 'lobby':
          this.currentCode = msg.code;
          this.isHost = !!msg.youAreHost;
          if (this.callbacks.lobby) this.callbacks.lobby(msg);
          break;
        case 'pong':
          if (msg.t) this.ping = Date.now() - msg.t;
          break;
        case 'lobbyError':
          if (this.callbacks.lobbyError) this.callbacks.lobbyError(msg.message || 'Erro no lobby');
          break;
        case 'gameStart':
          if (this.callbacks.gameStart) this.callbacks.gameStart(msg.data);
          break;
        case 'stateUpdate':
          if (this.callbacks.stateUpdate) this.callbacks.stateUpdate(msg.state);
          break;
        case 'kill':
          if (this.callbacks.kill) this.callbacks.kill(msg.data);
          break;
        case 'chat':
          if (this.callbacks.chat) this.callbacks.chat(msg.data);
          break;
        case 'testModeAck':
          if (this.callbacks.testModeAck) this.callbacks.testModeAck(msg);
          break;
      }
      for (const fn of this.rawListeners) {
        try { fn(msg); } catch {}
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.joined = false;
      if (this.callbacks.close) this.callbacks.close();
      if (this._shouldReconnect) {
        console.warn('[Network] Conexão perdida, tentando reconectar em 3s...');
        this._reconnectTimer = setTimeout(() => {
          this._reconnectTimer = null;
          this.connect();
        }, 3000);
      }
    };
  }

  disconnect() {
    this._shouldReconnect = false;
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.joined = false;
  }

  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  sendJoin(name) {
    this.send('join', { name });
  }

  sendPosition(position, rotation) {
    this.send('position', { position, rotation });
  }

  sendKill(targetId) {
    this.send('kill', { targetId });
  }

  sendChat(message) {
    const text = String(message || '').trim().slice(0, 150);
    if (!text) return false;
    if (Date.now() - this.lastChatTime <= 2000) return false;
    this.lastChatTime = Date.now();
    this.send('chat', { name: this.playerName, color: this.color, message: text });
    return true;
  }

  setPlayerInfo(name, color) {
    const nextName = String(name || '').trim();
    if (nextName) this.playerName = nextName;
    if (color) this.color = color;
  }

  onPlayersUpdate(cb) {
    this.callbacks.playersUpdate = cb;
  }

  onOpen(cb) {
    this.callbacks.open = cb;
  }

  onLobby(cb) {
    this.callbacks.lobby = cb;
  }

  onLobbyError(cb) {
    this.callbacks.lobbyError = cb;
  }

  createLobby(name) {
    this.send('createLobby', { name });
  }

  joinLobby(code, name) {
    this.send('joinLobby', { code, name });
  }

  startGameAsHost(map, gameMode) {
    this.send('startGame', { map, animalCount: 20, gameMode });
  }

  onClose(cb) {
    this.callbacks.close = cb;
  }

  onGameStart(cb) {
    this.callbacks.gameStart = cb;
  }

  onStateUpdate(cb) {
    this.callbacks.stateUpdate = cb;
  }

  onKill(cb) {
    this.callbacks.kill = cb;
  }

  onChat(cb) {
    this.callbacks.chat = cb;
  }

  onTestModeAck(cb) {
    this.callbacks.testModeAck = cb;
  }
}
