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
  }

  connect() {
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
      if (!this.joined) {
        this.joined = true;
        this.sendJoin(this.playerName || 'Jogador');
      }
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'players':
          if (this.callbacks.playersUpdate) this.callbacks.playersUpdate(msg.players);
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
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.joined = false;
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
    if (name) this.playerName = name;
    if (color) this.color = color;
  }

  onPlayersUpdate(cb) {
    this.callbacks.playersUpdate = cb;
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
