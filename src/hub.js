// hub.js — CAPYQUAKE Game Hub: sidebar + topbar + dashboard pages
// Consumes real data from /api/users/me, /api/game/capybara, etc.

import { Account, ROLE_LABELS } from './account.js';
import { ACHIEVEMENTS } from './achievements-data.js';
import { SHOP_SECTIONS, SHOP_ITEM_MAP } from './shop-data.js';
import { WEAPONS } from './weapon.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n ?? 0).toLocaleString('pt-BR');

let hubEl = null;
let currentPage = 'dashboard';
let _onPlay = null;
let _onMultiplayer = null;

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'VISÃO GERAL' },
  { id: 'capybara', icon: '🦫', label: 'MINHA CAPIVARA' },
  { id: 'inventory', icon: '🎒', label: 'INVENTÁRIO' },
  { id: 'shop', icon: '🛒', label: 'LOJA' },
  { id: 'achievements', icon: '🏆', label: 'CONQUISTAS' },
  { id: 'progress', icon: '📈', label: 'PROGRESSO' },
  { id: 'multiplayer', icon: '👥', label: 'MULTIPLAYER' },
  { id: 'chat', icon: '💬', label: 'CHAT' },
  { id: 'settings', icon: '⚙️', label: 'CONFIGURAÇÕES' },
];

export function initHub(opts = {}) {
  _onPlay = opts.onPlay || (() => {});
  _onMultiplayer = opts.onMultiplayer || (() => {});

  hubEl = document.getElementById('hub');
  if (!hubEl) {
    hubEl = document.createElement('div');
    hubEl.id = 'hub';
    document.body.appendChild(hubEl);
  }
  renderShell();
}

export async function showHub() {
  if (!hubEl) return;
  try { await Account.refresh(); } catch {}
  renderProfile();
  hubEl.style.display = 'flex';
  navigateTo('dashboard');
}

export function hideHub() {
  if (!hubEl) return;
  hubEl.style.display = 'none';
}

function renderShell() {
  hubEl.innerHTML = `
    <aside class="hub-sidebar" id="hub-sidebar">
      <div class="hub-brand">CAPYQUAKE<span>GAME HUB</span></div>
      <nav class="hub-nav" id="hub-nav">
        ${NAV_ITEMS.map(n => `<a class="hub-nav-item ${n.id === 'dashboard' ? 'active' : ''}" data-page="${n.id}" href="#${n.id}">
          <span class="hub-nav-icon">${n.icon}</span><span class="hub-nav-label">${n.label}</span>
        </a>`).join('')}
      </nav>
      <div class="hub-profile" id="hub-sidebar-profile"></div>
    </aside>
    <div class="hub-main">
      <header class="hub-topbar" id="hub-topbar">
        <button class="hub-menu-toggle" id="hub-menu-toggle" aria-label="Menu">☰</button>
        <div class="hub-search">
          <input type="text" id="hub-search" placeholder="Pesquisar..." aria-label="Pesquisar">
        </div>
        <div class="hub-topbar-right">
          <div class="hub-user-pill" id="hub-user-pill"></div>
        </div>
      </header>
      <main class="hub-content" id="hub-content"></main>
    </div>`;

  // nav click
  hubEl.querySelectorAll('.hub-nav-item').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(a.dataset.page);
    });
  });

  // mobile toggle
  document.getElementById('hub-menu-toggle').addEventListener('click', () => {
    hubEl.querySelector('.hub-sidebar').classList.toggle('open');
  });

  // close sidebar on content click (mobile)
  hubEl.querySelector('.hub-content').addEventListener('click', () => {
    hubEl.querySelector('.hub-sidebar').classList.remove('open');
  });

  renderProfile();
}

function renderProfile() {
  const user = Account.user;
  const profile = Account.profile;
  const bar = document.getElementById('hub-sidebar-profile');
  const pill = document.getElementById('hub-user-pill');
  if (!user) return;
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  if (bar) bar.innerHTML = `<div class="hub-avatar">${(user.displayName || user.username || '?')[0].toUpperCase()}</div>
    <div class="hub-profile-info">
      <div class="hub-profile-name">${esc(user.displayName || user.username)}</div>
      <div class="hub-profile-role"><span class="pill ${esc(user.role)}">${esc(roleLabel)}</span></div>
    </div>`;
  if (pill) pill.innerHTML = `<span class="pill ${esc(user.role)}" style="font-size:11px">${esc(user.displayName || user.username)}</span>`;
}

function navigateTo(page) {
  currentPage = page;
  hubEl.querySelectorAll('.hub-nav-item').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page));
  // close mobile sidebar
  hubEl.querySelector('.hub-sidebar').classList.remove('open');

  const content = document.getElementById('hub-content');
  switch (page) {
    case 'dashboard': renderDashboard(content); break;
    case 'capybara': renderCapybara(content); break;
    case 'inventory': renderInventory(content); break;
    case 'shop': renderShop(content); break;
    case 'achievements': renderAchievements(content); break;
    case 'progress': renderProgress(content); break;
    case 'multiplayer': renderMultiplayer(content); break;
    case 'chat': renderChat(content); break;
    case 'settings': renderSettings(content); break;
    default: renderDashboard(content);
  }
}

// ---- DASHBOARD ----
function renderDashboard(el) {
  const user = Account.user || {};
  const profile = Account.profile || {};
  const capy = Account.capybara || {};
  el.innerHTML = `
    <div class="hub-page-header">
      <h1>Bem-vindo de volta, ${esc(user.displayName || user.username || 'Jogador')}! 🦫</h1>
      <p class="hub-page-sub">Confira o estado atual da sua aventura no CAPYQUAKE.</p>
    </div>
    <div class="hub-stats-grid">
      <div class="hub-stat-card">
        <div class="hub-stat-icon">💰</div>
        <div class="hub-stat-info"><span class="hub-stat-label">MOEDAS</span><span class="hub-stat-value">${fmt(profile.coins)}</span></div>
      </div>
      <div class="hub-stat-card">
        <div class="hub-stat-icon">💎</div>
        <div class="hub-stat-info"><span class="hub-stat-label">TOKENS</span><span class="hub-stat-value">${fmt(profile.tokens)}</span></div>
      </div>
      <div class="hub-stat-card">
        <div class="hub-stat-icon">⭐</div>
        <div class="hub-stat-info"><span class="hub-stat-label">LEVEL</span><span class="hub-stat-value">${fmt(profile.level)}</span></div>
      </div>
      <div class="hub-stat-card">
        <div class="hub-stat-icon">⚡</div>
        <div class="hub-stat-info"><span class="hub-stat-label">XP</span><span class="hub-stat-value">${fmt(profile.xp)}</span></div>
      </div>
      <div class="hub-stat-card">
        <div class="hub-stat-icon">💀</div>
        <div class="hub-stat-info"><span class="hub-stat-label">ABATES</span><span class="hub-stat-value">${fmt(profile.kills)}</span></div>
      </div>
      <div class="hub-stat-card">
        <div class="hub-stat-icon">🔄</div>
        <div class="hub-stat-info"><span class="hub-stat-label">REBIRTHS</span><span class="hub-stat-value">${fmt(profile.rebirths)}</span></div>
      </div>
    </div>
    <div class="hub-row">
      <div class="hub-card hub-card-wide">
        <h3>🦫 MINHA CAPIVARA</h3>
        <div class="hub-capybara-mini">
          <div class="hub-capy-avatar">${(capy.name || 'C')[0].toUpperCase()}</div>
          <div class="hub-capy-info">
            <div class="hub-capy-name">${esc(capy.name || 'Capy')}</div>
            <div class="hub-capy-bars">
              ${renderBar('❤️', 'HP', capy.health)}
              ${renderBar('⚡', 'Energia', capy.energy)}
              ${renderBar('🍖', 'Fome', capy.hunger)}
              ${renderBar('😊', 'Felicidade', capy.happiness)}
            </div>
          </div>
        </div>
      </div>
      <div class="hub-card">
        <h3>🎮 AÇÕES RÁPIDAS</h3>
        <div class="hub-actions">
          <button class="hub-action-btn primary" id="hub-play-btn">🎮 JOGAR</button>
          <button class="hub-action-btn secondary" id="hub-multi-btn">👥 MULTIPLAYER</button>
        </div>
      </div>
    </div>`;

  document.getElementById('hub-play-btn')?.addEventListener('click', () => { hideHub(); _onPlay(); });
  document.getElementById('hub-multi-btn')?.addEventListener('click', () => { hideHub(); _onMultiplayer(); });
}

function renderBar(icon, label, value) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return `<div class="hub-bar-row"><span class="hub-bar-icon">${icon}</span><span class="hub-bar-label">${label}</span><div class="hub-bar-track"><div class="hub-bar-fill" style="width:${v}%"></div></div><span class="hub-bar-val">${v}</span></div>`;
}

// ---- CAPYBARA ----
function renderCapybara(el) {
  const capy = Account.capybara || {};
  el.innerHTML = `
    <div class="hub-page-header"><h1>🦫 MINHA CAPIVARA</h1><p class="hub-page-sub">Cuide da sua capivara!</p></div>
    <div class="hub-card hub-card-center">
      <div class="hub-capy-big-avatar">${(capy.name || 'C')[0].toUpperCase()}</div>
      <h2>${esc(capy.name || 'Capy')}</h2>
      <div class="hub-capy-bars-big">
        ${renderBar('❤️', 'Saúde', capy.health)}
        ${renderBar('⚡', 'Energia', capy.energy)}
        ${renderBar('🍖', 'Fome', capy.hunger)}
        ${renderBar('😊', 'Felicidade', capy.happiness)}
      </div>
    </div>`;
}

// ---- INVENTORY ----
function renderInventory(el) {
  const inv = Account.inventory || [];
  if (inv.length === 0) {
    el.innerHTML = `
      <div class="hub-page-header"><h1>🎒 INVENTÁRIO</h1><p class="hub-page-sub">Seus itens e armas.</p></div>
      <div class="hub-card"><p class="dim">Inventário vazio. Jogue para coletar itens!</p></div>`;
    return;
  }
  const items = inv.map(i => {
    const w = WEAPONS[i.itemId];
    const name = w ? w.name : i.itemId;
    const icon = w ? (w.icon || '🔫') : '📦';
    return `<div class="hub-inv-item">
      <div class="hub-inv-icon">${icon}</div>
      <div class="hub-inv-name">${esc(name)}</div>
      <div class="hub-inv-qty">×${i.quantity}</div>
    </div>`;
  }).join('');
  el.innerHTML = `
    <div class="hub-page-header"><h1>🎒 INVENTÁRIO</h1><p class="hub-page-sub">${inv.length} itens</p></div>
    <div class="hub-shop-grid">${items}</div>`;
}

// ---- SHOP ----
function renderShop(el) {
  const sections = SHOP_SECTIONS || [];
  let html = `<div class="hub-page-header"><h1>🛒 LOJA</h1><p class="hub-page-sub">Itens disponíveis para compra.</p></div>`;
  for (const sec of sections) {
    const items = (sec.items || []).slice(0, 4);
    html += `<div class="hub-card"><h3>${esc(sec.icon || '📦')} ${esc(sec.name)}</h3>
      <div class="hub-shop-grid">${items.map(item => {
        const info = SHOP_ITEM_MAP?.[item] || {};
        return `<div class="hub-shop-item"><div class="hub-shop-icon">${esc(info.icon || '📦')}</div><div class="hub-shop-name">${esc(info.name || item)}</div><div class="hub-shop-cost">R$ ${fmt(info.cost || 0)}</div></div>`;
      }).join('')}</div></div>`;
  }
  el.innerHTML = html;
}

// ---- ACHIEVEMENTS ----
function renderAchievements(el) {
  const list = (ACHIEVEMENTS || []).slice(0, 20);
  const rarityColors = { COMMON: '#9ca3af', UNCOMMON: '#4ade80', RARE: '#60a5fa', EPIC: '#c084fc', LEGENDARY: '#fbbf24', MYTHIC: '#f472b6', DIVINE: '#f97316', CURSED: '#ef4444', '???': '#fff' };
  el.innerHTML = `
    <div class="hub-page-header"><h1>🏆 CONQUISTAS</h1><p class="hub-page-sub">${list.length} conquistas disponíveis</p></div>
    <div class="hub-achievements-grid">${list.map(a => `
      <div class="hub-ach-card" style="border-color:${rarityColors[a.rarity] || '#333'}">
        <div class="hub-ach-rarity" style="color:${rarityColors[a.rarity] || '#999'}">${a.rarity}</div>
        <div class="hub-ach-name">${esc(a.name)}</div>
        <div class="hub-ach-desc">${esc(a.description)}</div>
      </div>`).join('')}</div>`;
}

// ---- PROGRESS ----
function renderProgress(el) {
  const profile = Account.profile || {};
  el.innerHTML = `
    <div class="hub-page-header"><h1>📈 PROGRESSO</h1><p class="hub-page-sub">Seu progresso no CAPYQUAKE.</p></div>
    <div class="hub-stats-grid">
      <div class="hub-stat-card"><div class="hub-stat-icon">🎮</div><div class="hub-stat-info"><span class="hub-stat-label">PARTIDAS</span><span class="hub-stat-value">${fmt(profile.matches)}</span></div></div>
      <div class="hub-stat-card"><div class="hub-stat-icon">💀</div><div class="hub-stat-info"><span class="hub-stat-label">ABATES</span><span class="hub-stat-value">${fmt(profile.kills)}</span></div></div>
      <div class="hub-stat-card"><div class="hub-stat-icon">🔥</div><div class="hub-stat-info"><span class="hub-stat-label">DANO TOTAL</span><span class="hub-stat-value">${fmt(profile.damageDealt)}</span></div></div>
      <div class="hub-stat-card"><div class="hub-stat-icon">⏱️</div><div class="hub-stat-info"><span class="hub-stat-label">TEMPO DE JOGO</span><span class="hub-stat-value">${Math.floor((profile.playTime || 0) / 3600)}h</span></div></div>
    </div>`;
}

// ---- MULTIPLAYER ----
function renderMultiplayer(el) {
  el.innerHTML = `
    <div class="hub-page-header"><h1>👥 MULTIPLAYER</h1><p class="hub-page-sub">Jogue com seus amigos!</p></div>
    <div class="hub-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <div style="width:10px;height:10px;border-radius:50%;background:#4ade80"></div>
        <span style="font-weight:700">Status: Online</span>
      </div>
      <p>Crie um lobby com código de 4 letras ou entre no de um amigo.</p>
      <p class="dim" style="margin-top:8px">Até 6 jogadores por partida.</p>
      <button class="hub-action-btn primary" id="hub-mp-play-btn" style="margin-top:12px">🎮 ENTRAR NO MULTIPLAYER</button>
    </div>`;
  document.getElementById('hub-mp-play-btn')?.addEventListener('click', () => { hideHub(); _onMultiplayer(); });
}

// ---- CHAT ----
function renderChat(el) {
  el.innerHTML = `
    <div class="hub-page-header"><h1>💬 CHAT</h1><p class="hub-page-sub">Chat do jogo.</p></div>
    <div class="hub-card"><p>O chat funciona durante o jogo e no lobby multiplayer.</p>
    <p class="dim" style="margin-top:8px">Use / no campo de chat para ver comandos disponíveis.</p></div>`;
}

// ---- SETTINGS ----
function renderSettings(el) {
  el.innerHTML = `
    <div class="hub-page-header"><h1>⚙️ CONFIGURAÇÕES</h1></div>
    <div class="hub-card">
      <h3>🔑 TROCAR SENHA</h3>
      <div class="hub-settings-form">
        <label>Senha Atual</label><input type="password" id="hub-cp-current" autocomplete="current-password">
        <label>Nova Senha</label><input type="password" id="hub-cp-new" autocomplete="new-password">
        <label>Confirmar</label><input type="password" id="hub-cp-confirm" autocomplete="new-password">
        <div id="hub-cp-error" class="hub-error"></div>
        <button id="hub-cp-btn" class="hub-action-btn primary" style="width:100%">SALVAR</button>
      </div>
    </div>
    <div class="hub-card">
      <h3>👤 CONTA</h3>
      <p><b>Username:</b> ${esc(Account.user?.username)}</p>
      <p><b>Cargo:</b> ${esc(ROLE_LABELS[Account.user?.role] || Account.user?.role)}</p>
      <button class="hub-action-btn danger" id="hub-logout-btn" style="margin-top:12px">SAIR</button>
    </div>`;

  document.getElementById('hub-cp-btn')?.addEventListener('click', async () => {
    const err = document.getElementById('hub-cp-error');
    const btn = document.getElementById('hub-cp-btn');
    err.textContent = '';
    btn.disabled = true; btn.textContent = 'SALVANDO...';
    try {
      await Account.changePassword(
        document.getElementById('hub-cp-current').value,
        document.getElementById('hub-cp-new').value,
        document.getElementById('hub-cp-confirm').value
      );
      btn.textContent = '✓ SALVO!';
      document.getElementById('hub-cp-current').value = '';
      document.getElementById('hub-cp-new').value = '';
      document.getElementById('hub-cp-confirm').value = '';
      setTimeout(() => { btn.textContent = 'SALVAR'; btn.disabled = false; }, 1600);
    } catch (e) { err.textContent = e.message; btn.textContent = 'SALVAR'; btn.disabled = false; }
  });

  document.getElementById('hub-logout-btn')?.addEventListener('click', async () => {
    await Account.logout();
    hideHub();
  });
}

