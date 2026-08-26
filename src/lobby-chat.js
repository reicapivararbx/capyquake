import { ROLE_LABELS } from './account.js';
import { initCommands, handleCommandSocketMessage, attachCommandAutocomplete } from './commands.js';
const STAFF_ROLES = new Set(['king', 'co_king', 'head_admin', 'admin', 'developer', 'best_capybara']);
const ROLE_COLORS = {
  king: '#ffd700',
  co_king: '#ff9f43',
  head_admin: '#ffb26b',
  admin: '#c4b5fd',
  developer: '#7dd3fc',
  best_capybara: '#e8e8f2'
};
const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 30000;
const CLIENT_FLOOD_MS = 1500;

export class LobbyChat {
  constructor() {
    this.ws = null;
    this.status = 'offline';
    this._shouldReconnect = true;
    this._reconnectTimer = null;
    this._attempts = 0;
    this._lastSendAt = 0;
    this._built = false;
    this.visible = false;
  }

  build() {
    if (this._built) return;
    this._built = true;

    const wrap = document.createElement('div');
    wrap.id = 'lobby-chat';
    wrap.innerHTML = `
      <div id="lc-header">
        <span class="lc-title">💬 CHAT</span>
        <span class="lc-status" id="lc-status"><i class="lc-dot"></i><em>OFFLINE</em></span>
        <button type="button" id="lc-toggle" title="Minimizar">—</button>
      </div>
      <div id="lc-messages" aria-live="polite"></div>
      <form id="lc-form" autocomplete="off">
        <input id="lc-input" maxlength="150" placeholder="Digite sua mensagem..." enterkeyhint="send">
        <button type="submit" id="lc-send">➤</button>
      </form>`;
    document.body.appendChild(wrap);

    const form = document.getElementById('lc-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('lc-input');
      this.send(input.value);
      input.value = '';
    });

    document.getElementById('lc-toggle').addEventListener('click', () => {
      wrap.classList.toggle('minimized');
      const btn = document.getElementById('lc-toggle');
      btn.textContent = wrap.classList.contains('minimized') ? '+' : '—';
    });

    initCommands((obj) => {
      if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj));
    });
    attachCommandAutocomplete(document.getElementById('lc-input'));
  }

  sendRaw(obj) {
    if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(obj));
  }

  connect() {
    this.build();
    if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) return;
    this.setStatus('connecting');
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    let ws;
    try {
      ws = new WebSocket(`${proto}//${location.host}/ws`);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this._attempts = 0;
      this.setStatus('online');
    };
    ws.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      handleCommandSocketMessage(msg);
      if (msg.type === 'globalChatHistory' || msg.type === 'globalChat') {
        const entries = msg.type === 'globalChatHistory' ? (msg.data || []) : [msg.data];
        for (const entry of entries) this.appendMessage(entry);
      } else if (msg.type === 'globalChatError') {
        this.appendSystem(msg.data?.message || 'Mensagem recusada.');
      }
    };
    ws.onclose = () => {
      this.setStatus('offline');
      this.scheduleReconnect();
    };
    ws.onerror = () => {
      try { ws.close(); } catch {}
    };
  }

  scheduleReconnect() {
    if (!this._shouldReconnect || !this.visible) return;
    clearTimeout(this._reconnectTimer);
    const delay = Math.min(RECONNECT_BASE_MS * Math.pow(1.6, this._attempts++), RECONNECT_MAX_MS);
    this._reconnectTimer = setTimeout(() => {
      if (this.visible) this.connect();
    }, delay);
  }

  disconnect() {
    this._shouldReconnect = false;
    clearTimeout(this._reconnectTimer);
    if (this.ws) {
      this.ws.onclose = null;
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.setStatus('offline');
    this._shouldReconnect = true;
  }

  setStatus(status) {
    this.status = status;
    const el = document.getElementById('lc-status');
    if (!el) return;
    const dot = el.querySelector('.lc-dot');
    const label = el.querySelector('em');
    dot.className = 'lc-dot';
    if (status === 'online') { dot.classList.add('on'); label.textContent = 'ONLINE'; }
    else if (status === 'connecting') { dot.classList.add('wait'); label.textContent = 'CONECTANDO...'; }
    else label.textContent = 'OFFLINE';
  }

  send(text) {
    const message = String(text ?? '').trim();
    if (!message) return;
    const now = Date.now();
    if (now - this._lastSendAt < CLIENT_FLOOD_MS) {
      this.appendSystem('Calma lá! Aguarde um pouco para enviar de novo.');
      return;
    }
    this._lastSendAt = now;
    if (!this.ws || this.ws.readyState !== 1) {
      this.appendSystem('Sem conexão com o chat. Reconectando...');
      this.connect();
      return;
    }
    this.ws.send(JSON.stringify({ type: 'globalChat', message: message.slice(0, 150) }));
  }

  appendSystem(text) {
    this.appendLine({ system: true, message: text, ts: Date.now() });
  }

  appendMessage(entry) {
    if (!entry) return;
    const box = document.getElementById('lc-messages');
    if (!box) return;
    const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40;

    const line = document.createElement('div');
    line.className = 'lc-line';

    const name = document.createElement('b');
    if (entry.system) {
      line.classList.add('lc-system');
      name.textContent = '⚙';
    } else if (entry.role && STAFF_ROLES.has(entry.role)) {
      name.textContent = `[${ROLE_LABELS[entry.role] || entry.role}] ${entry.name}`;
      name.style.color = ROLE_COLORS[entry.role] || '#ffd000';
    } else {
      name.textContent = `${entry.name}:`;
    }

    const text = document.createElement('span');
    text.textContent = ` ${String(entry.message ?? '').slice(0, 150)}`;

    line.append(name, text);
    box.appendChild(line);

    while (box.childElementCount > 60) box.removeChild(box.firstChild);
    if (atBottom) box.scrollTop = box.scrollHeight;
  }

  show() {
    this.visible = true;
    this.build();
    document.getElementById('lobby-chat').style.display = 'flex';
    if (!this.ws || this.ws.readyState > 1) this.connect();
  }

  hide() {
    this.visible = false;
    const el = document.getElementById('lobby-chat');
    if (el) el.style.display = 'none';
    this.disconnect();
  }
}
