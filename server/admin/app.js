let ME = null;
let PERMS = [];
let META = { roles: [], labels: {}, adminViewRoles: [] };
let SELECTED_USER = null;
const content = document.getElementById('content');
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n ?? 0).toLocaleString('pt-BR');
const dt = (ts) => ts ? new Date(ts).toLocaleString('pt-BR') : '—';
const uuid = () => (globalThis.crypto && typeof crypto.randomUUID === 'function')
  ? crypto.randomUUID()
  : 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);

function roleLabel(role) { return META.labels[role] || role; }
function canAct() { return can('users.create'); } // cargos com ação vs. somente-visualização

function can(perm) { return PERMS.includes('*') || PERMS.includes(perm); }

async function api(path, opts = {}) {
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.idemKey ? { 'Idempotency-Key': opts.idemKey } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) { location.href = '/admin/login'; throw new Error('Sessão expirada.'); }
    throw new Error(data?.error?.message || `Erro ${res.status}`);
  }
  return data;
}

function btnState(btn, state, label) {
  if (!btn) return;
  btn.dataset.state = state;
  btn.disabled = state === 'loading';
  if (state === 'loading') { btn.textContent = 'PROCESSING...'; }
  else if (state === 'ok') { btn.textContent = label || '✓ OK'; setTimeout(() => { btn.disabled = false; btn.textContent = btn.dataset.label || ''; }, 1600); }
  else if (state === 'err') { btn.textContent = 'ERRO'; btn.classList.add('bad-msg'); setTimeout(() => { btn.disabled = false; btn.classList.remove('bad-msg'); btn.textContent = btn.dataset.label || ''; }, 1800); }
  else { btn.disabled = false; btn.textContent = label ?? btn.dataset.label ?? ''; }
}
function armBtn(btn) { btn.dataset.label = btn.textContent; btn.addEventListener('click', () => {}); return btn; }

function runAction(btn, fn, okLabel) {
  btnState(btn, 'loading');
  fn().then(() => btnState(btn, 'ok', okLabel)).catch((e) => {
    btnState(btn, 'err');
    toast(e.message, true);
  });
}

let toastTimer;
function toast(msg, isErr) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:18px;right:18px;background:#1b1b2a;border:1px solid #262637;padding:12px 16px;border-radius:10px;z-index:99;max-width:340px'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = isErr ? 'bad-msg' : 'ok-msg';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3500);
}

function confirmModal({ title, bodyHtml, requireUsername, onConfirm }) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">
    <h3>${esc(title)}</h3><div>${bodyHtml}</div>
    ${requireUsername ? `<label>Digite o username para confirmar</label><input id="cfm-user" autocomplete="off">` : ''}
    <div style="display:flex;gap:8px;margin-top:14px">
      <button id="cfm-go">CONFIRMAR</button>
      <button class="ghost" id="cfm-cancel">CANCELAR</button>
    </div></div></div>`;
  $('#cfm-cancel').onclick = () => { root.innerHTML = ''; };
  $('#cfm-go').onclick = () => {
    if (requireUsername && $('#cfm-user').value.trim() !== requireUsername) { toast('Username não confere.', true); return; }
    root.innerHTML = '';
    onConfirm();
  };
}

// ---------- aba USERS ----------

async function loadMeta() {
  try {
    const m = await api('/api/meta/roles');
    META = { roles: m.roles || [], labels: m.labels || {}, adminViewRoles: m.adminViewRoles || [] };
  } catch { META = { roles: [], labels: {}, adminViewRoles: [] }; }
}

function userActionsPanel(u) {
  if (!canAct()) {
    return `<div class="panel" id="user-actions"><h2>AÇÕES</h2>
      <p class="dim">✨ ${esc(roleLabel(ME.role))} possui acesso somente de visualização — ações administrativas estão desativadas.</p></div>`;
  }
  const myRank = roleRankOf(ME.role);
  const selectable = META.roles.filter(r => r !== 'king' ? true : ME.role === 'king')
    .filter(r => r !== u.username && !(r === 'king' && ME.role !== 'king'))
    .filter(r => (META.roles.indexOf(r) <= myRank) ? ME.role === 'king' : true);
  return `<div class="panel" id="user-actions"><h2>AÇÕES · #${u.id} ${esc(u.username)}</h2>
    <div class="row">
      <div><label>Novo cargo</label>
        <select id="ua-role">
          ${selectable.map(r => `<option value="${r}">${esc(roleLabel(r))}</option>`).join('')}
        </select>
      </div>
      <button id="ua-btn-role" data-label="CHANGE ROLE">CHANGE ROLE</button>
    </div>
    <div class="row">
      <div><label>Nova senha</label><input id="ua-pass" type="password" placeholder="mín. 8 caracteres"></div>
      <button id="ua-btn-pass" data-label="SET PASSWORD">SET PASSWORD</button>
    </div>
    <div class="row">
      <div><label>Motivo</label><input id="ua-reason" placeholder="opcional"></div>
      <div><label>Suspend (dias)</label><input id="ua-days" type="number" value="7" min="1" max="365"></div>
    </div>
    <div class="row">
      <button id="ua-btn-ban" style="background:var(--bad);color:#fff" data-label="BAN">BAN</button>
      <button id="ua-btn-kick" data-label="KICK">KICK</button>
      <button id="ua-btn-suspend" data-label="SUSPEND">SUSPEND</button>
      <button id="ua-btn-unban" data-label="UNBAN">UNBAN</button>
    </div>
  </div>`;
}

function roleRankOf(role) { return META.roles.indexOf(role); }

function wireUserActions(u, reload) {
  const panel = document.getElementById('user-actions');
  if (!panel) return;
  const reason = () => $('#ua-reason')?.value || undefined;
  $('#ua-btn-role')?.addEventListener('click', (e) => {
    const role = $('#ua-role').value;
    confirmModal({
      title: `CHANGE ROLE → ${roleLabel(role)}?`,
      bodyHtml: `Alvo: <b>#${u.id} ${esc(u.username)}</b><br>A sessão atual do alvo será encerrada.`,
      onConfirm: () => runAction(e.target, async () => {
        await api(`/api/admin/users/${u.id}/role`, { method: 'POST', idemKey: crypto.randomUUID(), body: { role, reason: reason() } });
        toast(`✓ ${esc(u.username)} agora é ${esc(roleLabel(role))}`);
        reload();
      })
    });
  });
  $('#ua-btn-pass')?.addEventListener('click', (e) => {
    const pass = $('#ua-pass').value;
    confirmModal({
      title: 'SET PASSWORD',
      bodyHtml: `Definir uma nova senha para <b>#${u.id} ${esc(u.username)}</b>?<br><span class="dim">A senha atual não pode ser lida — ela será substituída.</span>`,
      onConfirm: () => runAction(e.target, async () => {
        await api(`/api/admin/users/${u.id}/password`, { method: 'POST', idemKey: crypto.randomUUID(), body: { newPassword: pass } });
        toast('✓ Nova senha definida');
        $('#ua-pass').value = '';
      })
    });
  });
  $('#ua-btn-ban')?.addEventListener('click', (e) => {
    confirmModal({
      title: 'BANIR usuário?',
      bodyHtml: `<b>#${u.id} ${esc(u.username)}</b> perderá o acesso imediatamente.`,
      onConfirm: () => runAction(e.target, async () => {
        await api(`/api/admin/users/${u.id}/ban`, { method: 'POST', idemKey: crypto.randomUUID(), body: { reason: reason() } });
        toast(`✓ ${esc(u.username)} banido`);
        reload();
      })
    });
  });
  $('#ua-btn-kick')?.addEventListener('click', (e) => {
    confirmModal({
      title: 'KICK usuário?',
      bodyHtml: `Todas as sessões de <b>#${u.id} ${esc(u.username)}</b> serão encerradas agora (ele poderá logar de novo).`,
      onConfirm: () => runAction(e.target, async () => {
        await api(`/api/admin/users/${u.id}/kick`, { method: 'POST', idemKey: crypto.randomUUID(), body: { reason: reason() } });
        toast(`✓ ${esc(u.username)} kickado`);
      })
    });
  });
  $('#ua-btn-suspend')?.addEventListener('click', (e) => {
    const days = Number($('#ua-days').value) || 7;
    confirmModal({
      title: `SUSPENDER por ${days} dias?`,
      bodyHtml: `Alvo: <b>#${u.id} ${esc(u.username)}</b>`,
      onConfirm: () => runAction(e.target, async () => {
        await api(`/api/admin/users/${u.id}/suspend`, { method: 'POST', idemKey: crypto.randomUUID(), body: { days, reason: reason() } });
        toast(`✓ ${esc(u.username)} suspenso por ${days}d`);
        reload();
      })
    });
  });
  $('#ua-btn-unban')?.addEventListener('click', (e) => {
    runAction(e.target, async () => {
      await api(`/api/admin/users/${u.id}/unban`, { method: 'POST', idemKey: crypto.randomUUID(), body: { reason: reason() } });
      toast(`✓ ${esc(u.username)} reativado`);
      reload();
    }, '✓ UNBANNED');
  });
}

function createUserModal(reload) {
  const creatable = META.roles.filter(r =>
    r === 'king' ? ME.role === 'king'
      : (ME.role === 'king' ? true : META.roles.indexOf(r) < roleRankOf(ME.role)));
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">
    <h3>+ CREATE USER</h3>
    <label>Username</label><input id="cu-username" maxlength="24" autocomplete="off" placeholder="3-24: letras, números, - _">
    <label>Senha</label><input id="cu-pass" type="password" autocomplete="new-password" placeholder="mín. 8">
    <label>Confirmar senha</label><input id="cu-confirm" type="password" autocomplete="new-password">
    <label>Cargo</label>
    <select id="cu-role">${creatable.map(r => `<option value="${r}">${esc(roleLabel(r))}</option>`).join('')}</select>
    <p class="err" id="cu-err" hidden></p>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button id="cu-go">CRIAR</button>
      <button class="ghost" id="cu-cancel">CANCELAR</button>
    </div></div></div>`;
  $('#cu-cancel').onclick = () => { root.innerHTML = ''; };
  $('#cu-go').onclick = async () => {
    const errEl = $('#cu-err');
    errEl.hidden = true;
    const username = $('#cu-username').value.trim();
    const password = $('#cu-pass').value;
    const confirmPassword = $('#cu-confirm').value;
    let problem = null;
    if (!username) problem = 'Informe um username.';
    else if (username.length < 3 || username.length > 24) problem = 'Username deve ter entre 3 e 24 caracteres.';
    else if (!/^[a-zA-Z0-9_-]+$/.test(username)) problem = 'Use apenas letras, números, - e _.';
    else if (!password || password.length < 8) problem = 'Senha deve ter no mínimo 8 caracteres.';
    else if (password !== confirmPassword) problem = 'As senhas não conferem.';
    if (problem) { errEl.textContent = problem; errEl.hidden = false; return; }
    try {
      const r = await api('/api/admin/users', {
        method: 'POST', idemKey: crypto.randomUUID(),
        body: { username, password, confirmPassword, role: $('#cu-role').value }
      });
      root.innerHTML = '';
      toast(`✓ Usuário criado: #${r.user.id} ${esc(r.user.username)} · ${esc(roleLabel(r.user.role))}`);
      reload();
    } catch (e) { errEl.textContent = e.message; errEl.hidden = false; }
  };
}

async function pageUsers(offset = 0, q = '', role = '') {
  const qs = new URLSearchParams({ limit: 20, offset });
  if (q) qs.set('q', q);
  if (role) qs.set('role', role);
  const data = await api('/api/admin/users?' + qs);
  const reload = () => pageUsers(offset, q, role);
  content.innerHTML = `<h1>Users</h1>
    <form id="users-search-form" class="row">
      <div><label>Buscar username / ID / nome</label><input id="uq" value="${esc(q)}"></div>
      <div><label>Filtrar por cargo</label>
        <select id="urole"><option value="">— todos os cargos —</option>
          ${META.roles.map(r => `<option value="${r}" ${r === role ? 'selected' : ''}>${esc(roleLabel(r))}</option>`).join('')}
        </select></div>
      ${canAct() ? '<button type="button" id="btn-create-user">+ CREATE USER</button>' : ''}
      <button type="submit">BUSCAR / FILTRAR</button>
    </form>
    <table><thead><tr><th>ID</th><th>Username</th><th>Cargo</th><th>Status</th><th>Level</th><th>Coins</th><th>Último login</th></tr></thead><tbody>
    ${data.users.length ? data.users.map(u => `<tr class="clickable ${SELECTED_USER === u.id ? 'selected-row' : ''}" data-id="${u.id}">
      <td>${u.id}</td><td><b>${esc(u.username)}</b><br><span class="dim">${esc(u.displayName)}</span></td>
      <td>${esc(roleLabel(u.role))}</td><td><span class="pill ${u.status}">${u.status}</span></td>
      <td>${u.level ?? '—'}</td><td>${fmt(u.coins)}</td><td>${dt(u.lastLoginAt)}</td></tr>`).join('')
      : '<tr><td colspan="7" class="dim" style="text-align:center">Nenhum usuário encontrado.</td></tr>'}
    </tbody></table>
    <div class="row" style="margin-top:10px">
      <button class="ghost" id="uprev" ${offset <= 0 ? 'disabled' : ''}>← anterior</button>
      <span class="dim">total: ${fmt(data.total)}</span>
      <button class="ghost" id="unext" ${offset + 20 >= data.users.length ? 'disabled' : ''}>próxima →</button>
    </div>
    <div id="user-actions-slot"></div>`;

  $('#users-search-form').onsubmit = (e) => {
    e.preventDefault();
    SELECTED_USER = null;
    location.hash = `#/users?q=${encodeURIComponent($('#uq').value.trim())}&role=${encodeURIComponent($('#urole').value)}`;
  };
  $('#btn-create-user')?.addEventListener('click', () => createUserModal(reload));

  content.querySelectorAll('tr.clickable').forEach(tr => tr.onclick = async () => {
    SELECTED_USER = Number(tr.dataset.id);
    content.querySelectorAll('tr.clickable').forEach(t => t.classList.remove('selected-row'));
    tr.classList.add('selected-row');
    try {
      const acc = await api('/api/admin/users/' + SELECTED_USER);
      document.getElementById('user-actions-slot').innerHTML = userActionsPanel(acc.user);
      wireUserActions(acc.user, reload);
      document.getElementById('user-actions-slot').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) { toast(e.message, true); }
  });

  $('#uprev').onclick = () => location.hash = `#/users?offset=${Math.max(0, offset - 20)}${q ? '&q=' + encodeURIComponent(q) : ''}${role ? '&role=' + encodeURIComponent(role) : ''}`;
  $('#unext').onclick = () => location.hash = `#/users?offset=${offset + 20}${q ? '&q=' + encodeURIComponent(q) : ''}${role ? '&role=' + encodeURIComponent(role) : ''}`;
}

// ---------- pages ----------

async function pageDashboard() {
  const { stats } = await api('/api/admin/dashboard');
  content.innerHTML = `<h1>Dashboard</h1>
    <div class="cards">
      <div class="card"><b>${fmt(stats.totalUsers)}</b><span>Total users</span></div>
      <div class="card"><b>${fmt(stats.activeUsers)}</b><span>Active</span></div>
      <div class="card"><b>${fmt(stats.onlineUsers)}</b><span>Online (30min)</span></div>
      <div class="card"><b>${fmt(stats.totalCoins)}</b><span>Total coins</span></div>
      <div class="card"><b>${fmt(stats.totalTokens)}</b><span>Total tokens</span></div>
      <div class="card"><b>${fmt(stats.totalTransactions)}</b><span>Transactions</span></div>
    </div>
    <h1 style="font-size:15px;color:var(--dim)">RECENT ADMIN ACTIONS</h1>
    ${tableLogs(stats.recentActions)}`;
}

function tableLogs(logs) {
  if (!logs.length) return '<p class="dim">Nenhum registro.</p>';
  return `<table><thead><tr><th>Quando</th><th>Ação</th><th>Ator</th><th>Alvo</th><th>Detalhes</th><th>Status</th></tr></thead><tbody>
    ${logs.map(l => `<tr>
      <td>${dt(l.created_at)}</td><td><b>${esc(l.action)}</b></td>
      <td>${esc(l.actor_username || '—')}</td>
      <td>${l.target_user_id ? `<a href="#/players/${l.target_user_id}">${esc(l.target_username || l.target_user_id)}</a>` : '—'}</td>
      <td class="dim">${esc(JSON.stringify(l.metadata || {}).slice(0, 80))}</td>
      <td>${l.success ? '<span class="pill active">OK</span>' : '<span class="pill banned">FALHA</span>'}</td>
    </tr>`).join('')}</tbody></table>`;
}

async function pagePlayers(offset = 0, q = '') {
  const qs = new URLSearchParams({ limit: 20, offset });
  if (q) qs.set('q', q);
  const data = await api('/api/admin/users?' + qs);
  content.innerHTML = `<h1>Players</h1>
    <form id="search-form" class="row">
      <div><label>Buscar por username / displayName / ID</label><input id="q" value="${esc(q)}"></div>
      <button type="submit">BUSCAR</button>
    </form>
    <table><thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Status</th><th>Level</th><th>Coins</th><th>Último login</th></tr></thead><tbody>
    ${data.users.map(u => `<tr class="clickable" data-id="${u.id}">
      <td>${u.id}</td><td><b>${esc(u.username)}</b><br><span class="dim">${esc(u.displayName)}</span></td>
      <td><span class="pill ${u.role}">${u.role}</span></td><td><span class="pill ${u.status}">${u.status}</span></td>
      <td>${u.level ?? '—'}</td><td>${fmt(u.coins)}</td><td>${dt(u.lastLoginAt)}</td></tr>`).join('')}
    </tbody></table>
    <div class="row" style="margin-top:10px">
      <button class="ghost" id="prev" ${offset <= 0 ? 'disabled' : ''}>← anterior</button>
      <span class="dim">total: ${fmt(data.total)}</span>
      <button class="ghost" id="next" ${offset + 20 >= data.users.length ? 'disabled' : ''}>próxima →</button>
    </div>`;
  $('#search-form').onsubmit = (e) => { e.preventDefault(); location.hash = `#/players?q=${encodeURIComponent($('#q').value.trim())}`; };
  content.querySelectorAll('tr.clickable').forEach(tr => tr.onclick = () => location.hash = `#/players/${tr.dataset.id}`);
  $('#prev').onclick = () => location.hash = `#/players?offset=${Math.max(0, offset - 20)}${q ? '&q=' + encodeURIComponent(q) : ''}`;
  $('#next').onclick = () => location.hash = `#/players?offset=${offset + 20}${q ? '&q=' + encodeURIComponent(q) : ''}`;
}

async function pagePlayerDetail(id) {
  const acc = await api('/api/admin/users/' + id);
  const u = acc.user;
  content.innerHTML = `<h1>${esc(u.username)} <span class="pill ${u.role}">${u.role}</span> <span class="pill ${u.status}">${u.status}</span></h1>
  <div class="panel"><h2>ACCOUNT</h2>
    ID: <b>${u.id}</b> · displayName: ${esc(u.displayName)} · criado: ${dt(u.createdAt)} · último login: ${dt(u.lastLoginAt)}
    ${u.suspendedUntil ? ` · suspenso até ${dt(u.suspendedUntil)}` : ''}
  </div>
  <div class="panel"><h2>GAME</h2>
    Coins: <b>${fmt(acc.profile.coins)}</b> · Tokens: <b>${fmt(acc.profile.tokens)}</b> · Level: <b>${acc.profile.level}</b> (${fmt(acc.profile.xp)} xp)
    · Kills: ${fmt(acc.profile.kills)} · Dano: ${fmt(acc.profile.damageDealt)} · Partidas: ${fmt(acc.profile.matches)}
  </div>
  <div class="panel"><h2>CAPYBARA</h2>
    🐹 <b>${esc(acc.capybara.name)}</b> — ❤️ ${acc.capybara.health} ⚡ ${acc.capybara.energy} 🍖 ${acc.capybara.hunger} 😊 ${acc.capybara.happiness}
  </div>
  <div class="panel"><h2>INVENTÁRIO (${acc.inventory.length})</h2>
    ${acc.inventory.length ? acc.inventory.map(i => `${i.quantity}x ${esc(i.itemId)}`).join(' · ') : '<span class="dim">vazio</span>'}
  </div>
  <div class="panel"><h2>TRANSAÇÕES RECENTES</h2><div id="txs"><span class="dim">carregando…</span></div></div>
  <div class="panel"><h2>AÇÕES ADMIN SOBRE ESTE PLAYER</h2><div id="plogs"><span class="dim">carregando…</span></div></div>`;
  api(`/api/admin/users/${id}/transactions`).then(d =>
    $('#txs').innerHTML = d.transactions.length ? tableTxs(d.transactions) : '<span class="dim">nenhuma</span>');
  api(`/api/admin/logs?targetUserId=${id}&limit=20`).then(d =>
    $('#plogs').innerHTML = tableLogs(d.logs));
}

function tableTxs(txs) {
  return `<table><thead><tr><th>Quando</th><th>Tipo</th><th>Moeda</th><th>Qtd</th><th>Saldo</th><th>Motivo</th></tr></thead><tbody>
  ${txs.map(t => `<tr><td>${dt(t.createdAt)}</td><td>${t.type}</td><td>${t.currency}</td>
    <td>${t.amount >= 0 ? '+' : ''}${fmt(t.amount)}</td><td>${fmt(t.balanceAfter)}</td><td class="dim">${esc(t.reason || '')}</td></tr>`).join('')}</tbody></table>`;
}

let ITEMS = [];
async function pageTools(params) {
  if (!ITEMS.length) { try { ITEMS = (await api('/api/admin/items')).items; } catch { ITEMS = []; } }
  const pid = params.get('player') || '';
  content.innerHTML = `<h1>Game Tools</h1>
    <div class="panel">
      <label>Player ID</label>
      <input id="pid" value="${esc(pid)}" placeholder="ex: 3">
      <div class="dim" id="pinfo"></div>
    </div>
    <div id="tools">
    <div class="panel"><h2>ECONOMIA</h2>
      <div class="row"><div><label>Amount</label><input id="eco-amt" type="number" value="100"></div>
        <div><label>Motivo</label><input id="eco-reason" placeholder="opcional"></div></div>
      <div class="checks">
        <button data-q="100">+100</button><button data-q="500">+500</button>
        <button data-q="1000">+1000</button><button data-q="5000">+5000</button>
      </div>
      <div class="row">
        <button id="btn-give-coins" data-label="GIVE COINS">GIVE COINS</button>
        <button id="btn-remove-coins" data-label="REMOVE COINS">REMOVE COINS</button>
        <button id="btn-set-coins" data-label="SET COINS">SET COINS</button>
      </div>
    </div>
    <div class="panel"><h2>XP & LEVEL</h2>
      <div class="row"><div><label>XP amount</label><input id="xp-amt" type="number" value="500"></div>
        <div><label>Nível alvo (set)</label><input id="lvl-val" type="number" min="1" max="100" value="10"></div></div>
      <div class="row">
        <button id="btn-give-xp" data-label="GIVE XP">GIVE XP</button>
        <button id="btn-set-xp" data-label="SET XP">SET XP</button>
        <button id="btn-levelup" data-label="LEVEL UP">LEVEL UP +1</button>
        <button id="btn-set-level" data-label="SET LEVEL">SET LEVEL</button>
      </div>
    </div>
    <div class="panel"><h2>CAPYBARA</h2>
      <div class="row"><button id="btn-heal" data-label="HEAL">HEAL</button>
      <button id="btn-maxstats" data-label="MAX STATS">MAX STATS</button></div>
    </div>
    <div class="panel"><h2>ITENS</h2>
      <div class="row">
        <div style="flex:2"><label>Item</label><select id="item-sel">
          ${ITEMS.map(i => `<option value="${esc(i.id)}">${esc(i.name)} (${i.section})</option>`).join('')}
        </select></div>
        <div><label>Qtd</label><input id="item-qty" type="number" value="1" min="1"></div>
      </div>
      <div class="row"><button id="btn-give-item" data-label="GIVE ITEM">GIVE ITEM</button>
      <button id="btn-remove-item" data-label="REMOVE ITEM">REMOVE ITEM</button></div>
    </div>
    <div class="panel"><h2>MODERAÇÃO</h2>
      <div class="row"><div><label>Motivo</label><input id="mod-reason"></div>
        <div><label>Suspend (dias)</label><input id="mod-days" type="number" value="7" min="1" max="365"></div></div>
      <div class="row">
        <button id="btn-ban" data-label="BAN" style="background:var(--bad);color:#fff">BAN</button>
        <button id="btn-suspend" data-label="SUSPEND">SUSPEND</button>
        <button id="btn-unban" data-label="UNBAN">UNBAN</button>
        ${can('roles.manage') ? `<select id="role-sel">
          ${META.roles.map(r => `<option value="${r}">${esc(roleLabel(r))}</option>`).join('')}
        </select>
        <button id="btn-role" data-label="SET ROLE">SET ROLE</button>` : ''}
      </div>
    </div>
    <div class="panel"><h2>RESET PLAYER</h2>
      <div class="checks">
        ${['coins', 'xp', 'level', 'inventory', 'stats', 'capybara', 'all'].map(s =>
          `<label><input type="checkbox" value="${s}" class="rst"> ${s}</label>`).join('')}
      </div>
      <button id="btn-reset" data-label="RESET" style="background:var(--bad);color:#fff">RESET</button>
    </div>
    <div class="panel"><h2>GIVE ALL</h2>
      <div class="row"><div><label>Amount por player</label><input id="ga-amt" type="number" value="100"></div>
        <div><label>Moeda</label><select id="ga-cur"><option value="coins">coins</option><option value="tokens">tokens</option></select></div></div>
      <button id="btn-give-all" data-label="GIVE ALL">GIVE ALL…</button>
    </div></div>`;

  const loadInfo = async () => {
    const id = $('#pid').value.trim();
    if (!/^\d+$/.test(id)) { $('#pinfo').textContent = ''; return null; }
    try {
      const acc = await api('/api/admin/users/' + id);
      $('#pinfo').innerHTML = `→ <b>${esc(acc.user.username)}</b> <span class="pill ${acc.user.role}">${acc.user.role}</span> <span class="pill ${acc.user.status}">${acc.user.status}</span>`;
      return acc;
    } catch { $('#pinfo').textContent = ''; return null; }
  };
  $('#pid').addEventListener('change', loadInfo);
  if (pid) loadInfo();

  const needId = () => {
    const id = $('#pid').value.trim();
    if (!/^\d+$/.test(id)) { toast('Informe um Player ID válido.', true); return null; }
    return id;
  };
  const reason = () => $('#eco-reason') ? ($('#eco-reason').value || undefined) : undefined;

  content.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { $('#eco-amt').value = b.dataset.q; });

  $('#btn-give-coins')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'give-coins', { amount: Number($('#eco-amt').value), reason: reason() })); });
  $('#btn-remove-coins')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'give-coins', { amount: -Math.abs(Number($('#eco-amt').value)), reason: reason() })); });
  $('#btn-set-coins')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'set-coins', { amount: Number($('#eco-amt').value), reason: reason() })); });
  $('#btn-give-xp')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'give-xp', { amount: Number($('#xp-amt').value), reason: reason() }), '✓ XP GIVEN'); });
  $('#btn-set-xp')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'set-xp', { amount: Number($('#xp-amt').value), reason: reason() })); });
  $('#btn-levelup')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'level-up', { times: 1, reason: reason() }), '✓ LEVELED'); });
  $('#btn-set-level')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'set-level', { level: Number($('#lvl-val').value), reason: reason() })); });
  $('#btn-heal')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'heal', {}), '❤️ HEALED'); });
  $('#btn-maxstats')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'max-stats', {}), '✓ MAXED'); });
  $('#btn-give-item')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'give-item', { itemId: $('#item-sel').value, quantity: Number($('#item-qty').value), reason: reason() }), '✓ ITEM GIVEN'); });
  $('#btn-remove-item')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'remove-item', { itemId: $('#item-sel').value, quantity: Number($('#item-qty').value), reason: reason() }), '✓ REMOVED'); });

  $('#btn-ban')?.addEventListener('click', (e) => {
    const id = needId(); if (!id) return;
    confirmModal({ title: 'BANIR player?', bodyHtml: 'O player perderá o acesso imediatamente.', onConfirm: () => runAction(e.target, () => act(id, 'ban', { reason: $('#mod-reason').value })) });
  });
  $('#btn-suspend')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'suspend', { days: Number($('#mod-days').value), reason: $('#mod-reason').value })); });
  $('#btn-unban')?.addEventListener('click', (e) => { const id = needId(); if (!id) return; runAction(e.target, () => act(id, 'unban', { reason: $('#mod-reason').value })); });
  $('#btn-role')?.addEventListener('click', (e) => {
    const id = needId(); if (!id) return;
    const role = $('#role-sel').value;
    confirmModal({ title: `Definir role ${role}?`, bodyHtml: 'A sessão atual do alvo será encerrada.', onConfirm: () => runAction(e.target, () => act(id, 'role', { role, reason: $('#mod-reason').value })) });
  });
  $('#btn-reset')?.addEventListener('click', (e) => {
    const id = needId(); if (!id) return;
    const scopes = [...content.querySelectorAll('.rst:checked')].map(c => c.value);
    if (!scopes.length) { toast('Selecione ao menos um escopo.', true); return; }
    confirmModal({
      title: 'RESET PLAYER',
      bodyHtml: `Escopos: <b>${scopes.join(', ')}</b>. Operação destrutiva e irreversível.`,
      onConfirm: async () => {
        try {
          const acc = await api('/api/admin/users/' + id);
          const uname = acc.user.username;
          confirmModal({
            title: 'Digite o username do alvo',
            bodyHtml: `Para confirmar, digite: <b>${esc(uname)}</b>`,
            requireUsername: uname,
            onConfirm: () => runAction(e.target, () => act(id, 'reset', { scopes, confirmUsername: uname, reason: reason() }))
          });
        } catch (err) { toast(err.message, true); }
      }
    });
  });
  $('#btn-give-all')?.addEventListener('click', (e) => {
    const amount = Number($('#ga-amt').value);
    const currency = $('#ga-cur').value;
    confirmModal({
      title: 'GIVE ALL',
      bodyHtml: `Players afetados: todos os players ativos<br>Amount por player: <b>${fmt(amount)}</b><br>Moeda: <b>${currency}</b>`,
      onConfirm: () => runAction(e.target, async () => {
        const r = await api('/api/admin/economy/give-all', {
          method: 'POST', idemKey: crypto.randomUUID(),
          body: { amount, currency, confirmed: true, reason: 'painel' }
        });
        toast(`✓ ${r.affected} players receberam ${r.amountPerPlayer} ${r.currency}`);
      })
    });
  });
}

async function act(playerId, action, body) {
  const r = await api(`/api/admin/users/${playerId}/${action}`, {
    method: 'POST', idemKey: crypto.randomUUID(), body
  });
  toast('✓ Aplicado em #' + playerId);
  if ($('#pinfo')) loadInfoSafe();
  return r;
}
async function loadInfoSafe() { try { const e = new Event('change'); $('#pid').dispatchEvent(e); } catch {} }

async function pageLogs(offset = 0) {
  content.innerHTML = `<h1>Admin Logs</h1>
    <div class="panel row">
      <div><label>Ação</label><input id="f-action" placeholder="GIVE_COINS"></div>
      <div><label>Target user id</label><input id="f-target" type="number"></div>
      <div><label>Status</label><select id="f-success"><option value="">todos</option><option value="true">sucesso</option><option value="false">falha</option></select></div>
      <button id="f-go">FILTRAR</button>
    </div>
    <div id="log-table"><span class="dim">carregando…</span></div>
    <div class="row" style="margin-top:10px">
      <button class="ghost" id="prev" ${offset <= 0 ? 'disabled' : ''}>← anterior</button>
      <button class="ghost" id="next">próxima →</button>
    </div>`;
  const load = async () => {
    const qs = new URLSearchParams({ limit: 20, offset });
    if ($('#f-action').value.trim()) qs.set('action', $('#f-action').value.trim());
    if ($('#f-target').value.trim()) qs.set('targetUserId', $('#f-target').value.trim());
    if ($('#f-success').value) qs.set('success', $('#f-success').value);
    const d = await api('/api/admin/logs?' + qs);
    $('#log-table').innerHTML = tableLogs(d.logs);
  };
  $('#f-go').onclick = load;
  $('#prev').onclick = () => { location.hash = `#/logs?offset=${Math.max(0, offset - 20)}`; };
  $('#next').onclick = () => { location.hash = `#/logs?offset=${offset + 20}`; };
  await load();
}

function pageSettings() {
  content.innerHTML = `<h1>Settings</h1>
    <div class="panel"><h2>SESSÃO ATUAL</h2>
      Usuário: <b>${esc(ME.username)}</b> (#${ME.id}) · ${esc(roleLabel(ME.role))}<br>
      Permissões: <span class="dim">${PERMS.includes('*') ? 'todas (*)' : PERMS.join(', ')}</span>
    </div>
    <div class="panel"><h2>SEGURANÇA</h2>
      <ul>
        <li>Credenciais administrativas vêm de variáveis de ambiente no servidor (.env) — nunca do código.</li>
        <li>Sessões são cookies HttpOnly assinados pelo banco; logout revoga no servidor.</li>
        <li>Toda ação administrativa gera audit log com actor/alvo/metadata.</li>
      </ul>
    </div>`;
}

// ---------- router ----------

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/dashboard';
  const [pathPart, queryPart] = hash.split('?');
  const params = new URLSearchParams(queryPart || '');
  const parts = pathPart.split('/').filter(Boolean);
  content.querySelectorAll('button').forEach(b => b.disabled = false);
  try {
    if (parts[0] === 'dashboard' || !parts[0]) return await pageDashboard();
    if (parts[0] === 'users') return await pageUsers(intParam0(params.get('offset')), params.get('q') || '', params.get('role') || '');
    if (parts[0] === 'players' && parts[1]) return await pagePlayerDetail(parts[1]);
    if (parts[0] === 'players') return await pagePlayers(intParam0(params.get('offset')), params.get('q') || '');
    if (parts[0] === 'game-tools') return await pageTools(params);
    if (parts[0] === 'logs') return await pageLogs(intParam0(params.get('offset')));
    if (parts[0] === 'settings') return pageSettings();
    return await pageDashboard();
  } catch (e) { content.innerHTML = `<p class="bad-msg">${esc(e.message)}</p>`; }
}

function intParam0(v) { const n = Number.parseInt(v, 10); return Number.isSafeInteger(n) && n > 0 ? n : 0; }

window.addEventListener('hashchange', route);

(async function init() {
  try {
    const me = await api('/api/admin/me');
    ME = me.user;
    PERMS = me.permissions;
    await loadMeta();
    $('#me').textContent = `${ME.username} · ${roleLabel(ME.role)}`;
    if (ME.role === 'player') { location.href = '/admin/login'; return; }
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.add(a.getAttribute('href') === location.hash || (!location.hash && a.getAttribute('href') === '#/dashboard') ? 'active' : ''));
    window.addEventListener('hashchange', () => {
      document.querySelectorAll('[data-nav]').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === (location.hash.split('?')[0] || '#/dashboard')));
    });
    await route();
  } catch { /* redirect tratado em api() */ }
})();

document.getElementById('btn-logout').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  location.href = '/admin/login';
});
