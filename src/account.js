const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;

const ADMIN_ROLES = new Set(['best_capybara', 'developer', 'admin', 'head_admin', 'co_king', 'king']);

// Espelho client-side dos cargos do servidor (server/validation.js).
export const ROLE_LABELS = {
  king: '👑 Capybara_King',
  co_king: '💖 Capybara Co-King',
  head_admin: '👑 Capybara Head Admin',
  admin: '🛠️ Capybara Admin',
  developer: '💻 Capybara Developer',
  best_capybara: '✨ The Best Capybara',
  friend: '🦫 Capybara Friend',
  hazbin: '🔥 Hazbin Hotel',
  cool: '🦫🕶️ Capybara Cool',
  citizen: '🦫 Capybara Citizen',
  visitante: '👤 Visitante'
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

function friendlyError(ex) {
  if (ex instanceof TypeError && (ex.message === 'Failed to fetch' || ex.message === 'NetworkError when attempting to fetch resource.')) {
    return 'Servidor indisponível. Verifique sua conexão.';
  }
  return ex.message || 'Erro inesperado.';
}

const API = {
  async json(url, opts = {}) {
    let res;
    try {
      res = await fetch(url, {
        method: opts.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    } catch {
      throw new Error('Servidor indisponível. Verifique sua conexão.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error?.message || `Erro ${res.status}`);
    return data;
  }
};

// ---------- validações client-side (espelham o servidor) ----------

export function validateUsernameClient(raw) {
  const username = String(raw ?? '').trim();
  if (!username) return 'Informe um username.';
  if (username.length < 3) return 'Username deve ter no mínimo 3 caracteres.';
  if (username.length > 24) return 'Username deve ter no máximo 24 caracteres.';
  if (!USERNAME_RE.test(username)) return 'Use apenas letras, números, - e _.';
  return null;
}

export function validatePasswordClient(pw) {
  const p = String(pw ?? '');
  if (!p) return 'Informe uma senha.';
  if (p.length < 8) return 'Senha deve ter no mínimo 8 caracteres.';
  if (p.length > 128) return 'Senha muito longa.';
  return null;
}

export function validateRegisterClient({ username, password, confirm }) {
  return validateUsernameClient(username)
    || validatePasswordClient(password)
    || (password !== confirm ? 'As senhas não conferem.' : null);
}

export function validateChangePasswordClient({ current, next, confirm }) {
  if (!current) return 'Informe a senha atual.';
  return validatePasswordClient(next)
    || (next !== confirm ? 'A confirmação não confere com a nova senha.' : null)
    || (next === current ? 'A nova senha deve ser diferente da atual.' : null);
}

export const Account = {
  user: null,
  profile: null,
  capybara: null,

  async refresh() {
    try {
      const me = await API.json('/api/users/me');
      this.user = me.user;
      this.profile = me.profile;
      this.capybara = me.capybara;
      if (this.profile) {
        localStorage.setItem('capiquake_money', String(this.profile.coins));
        localStorage.setItem('capiquake_tokens', String(this.profile.tokens));
        const best = Number.parseInt(localStorage.getItem('capiquake_best_level'), 10) || 1;
        if (this.profile.level > best) {
          localStorage.setItem('capiquake_best_level', String(this.profile.level));
        }
      }
    } catch {
      this.user = null;
      this.profile = null;
      this.capybara = null;
    }
    this.render();
  },

  async login(username, password) {
    const problem = validateUsernameClient(username);
    if (problem) throw new Error(problem);
    if (!password) throw new Error('Informe a senha.');
    const r = await API.json('/api/auth/login', { method: 'POST', body: { username, password } });
    this.user = r.user;
    await this.refresh();
    return r.user;
  },

  async register(username, displayName, password, confirmPassword) {
    const problem = validateRegisterClient({ username, password, confirm: confirmPassword });
    if (problem) throw new Error(problem);
    const r = await API.json('/api/auth/register', {
      method: 'POST',
      body: { username, displayName, password, confirmPassword }
    });
    this.user = r.user;
    await this.refresh();
    return r.user;
  },

  async changePassword(currentPassword, newPassword, confirmPassword) {
    const problem = validateChangePasswordClient({
      current: currentPassword, next: newPassword, confirm: confirmPassword
    });
    if (problem) throw new Error(problem);
    const r = await API.json('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword, confirmPassword }
    });
    this.user = r.user;
    return r.user;
  },

  async logout() {
    try { await API.json('/api/auth/logout', { method: 'POST' }); } catch {}
    this.user = null;
    this.profile = null;
    this.capybara = null;
    this.render();
  },

  async reportMatch(stats) {
    if (!this.user) return null;
    try {
      const r = await API.json('/api/game/report', {
        method: 'POST',
        body: {
          moneyEarned: stats.moneyEarned || 0,
          tokensEarned: stats.tokensEarned || 0,
          xpEarned: stats.xpEarned || 0,
          kills: stats.kills || 0,
          damageDealt: stats.damageDealt || 0,
          playTimeSeconds: stats.survivalTime || 0,
          won: !stats._playerDead
        }
      });
      const result = r.result;
      localStorage.setItem('capiquake_money', String(result.coins));
      localStorage.setItem('capiquake_tokens', String(result.tokens));
      const best = Number.parseInt(localStorage.getItem('capiquake_best_level'), 10) || 1;
      if (result.level > best) localStorage.setItem('capiquake_best_level', String(result.level));
      this.profile = { ...this.profile, coins: result.coins, tokens: result.tokens, level: result.level, xp: result.xp };
      return result;
    } catch {
      return null;
    }
  },

  render() {
    const bar = document.getElementById('account-bar');
    if (!bar) return;
    bar.replaceChildren();
    if (this.user) {
      const info = document.createElement('span');
      info.className = 'acc-info';
      info.textContent = `👤 ${this.user.displayName} · ${roleLabel(this.user.role)} · Lv ${this.profile?.level ?? 1} · R$ ${(this.profile?.coins ?? 0).toLocaleString('pt-BR')}`;
      info.title = roleLabel(this.user.role);

      const pwdBtn = document.createElement('button');
      pwdBtn.id = 'btn-change-password';
      pwdBtn.className = 'ghost';
      pwdBtn.textContent = '🔑 TROCAR SENHA';
      pwdBtn.addEventListener('click', () => {
        document.getElementById('change-password-error').hidden = true;
        document.getElementById('form-change-password').reset();
        document.getElementById('change-password-dialog').showModal();
      });

      const out = document.createElement('button');
      out.id = 'btn-logout-account';
      out.className = 'ghost';
      out.textContent = 'SAIR';
      out.addEventListener('click', () => this.logout());

      bar.append(info, pwdBtn, out);

      if (ADMIN_ROLES.has(this.user.role)) {
        const onProd = location.hostname === 'm.zanona.com.br';
        const adminBtn = document.createElement('a');
        adminBtn.id = 'btn-admin-panel';
        adminBtn.href = onProd ? 'https://m.zanona.com.br/admin/login' : '/admin/login';
        adminBtn.target = '_blank';
        adminBtn.rel = 'noopener';
        adminBtn.textContent = '🔐 PAINEL ADMIN';
        adminBtn.style.cssText = 'background:linear-gradient(135deg,#ff9f43,#f97316);color:#161005;font-weight:800;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:12px;margin-left:6px;';
        bar.appendChild(adminBtn);
      }
    } else {
      const btn = document.createElement('button');
      btn.id = 'btn-open-auth';
      btn.className = 'ghost';
      btn.textContent = '👤 ENTRAR / CRIAR CONTA';
      btn.addEventListener('click', () => document.getElementById('auth-dialog').showModal());
      bar.appendChild(btn);
    }
  }
};

export function initAccount() {
  Account.render();
  Account.refresh();
  window.addEventListener('capyquake:match-end', (e) => Account.reportMatch(e.detail));

  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const cpForm = document.getElementById('form-change-password');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('login-error');
    err.hidden = true;
    const btn = loginForm.querySelector('.auth-btn');
    btn.disabled = true;
    btn.textContent = 'PROCESSANDO...';
    try {
      await Account.login(
        document.getElementById('login-username').value.trim(),
        document.getElementById('login-password').value
      );
      document.getElementById('auth-dialog').close();
      loginForm.reset();
    } catch (ex) {
      err.textContent = friendlyError(ex);
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'ENTRAR';
    }
  });

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('register-error');
    err.hidden = true;
    const btn = regForm.querySelector('.auth-btn');
    btn.disabled = true;
    btn.textContent = 'CRIANDO...';
    try {
      const username = document.getElementById('reg-username').value.trim();
      const display = document.getElementById('reg-display').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      // Validação completa no cliente antes de chamar o servidor.
      const problem = validateRegisterClient({ username, password, confirm });
      if (problem) throw new Error(problem);

      await Account.register(username, display || undefined, password, confirm);
      document.getElementById('auth-dialog').close();
      regForm.reset();
    } catch (ex) {
      err.textContent = friendlyError(ex);
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'CRIAR CONTA';
    }
  });

  cpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('change-password-error');
    err.hidden = true;
    const btn = cpForm.querySelector('.auth-btn');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'SALVANDO...';
    try {
      const current = document.getElementById('cp-current').value;
      const next = document.getElementById('cp-new').value;
      const confirm = document.getElementById('cp-confirm').value;
      await Account.changePassword(current, next, confirm);
      document.getElementById('change-password-dialog').close();
      cpForm.reset();
      btn.textContent = '✓ SENHA ALTERADA!';
      setTimeout(() => { btn.textContent = original; }, 1600);
    } catch (ex) {
      err.textContent = friendlyError(ex);
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}
