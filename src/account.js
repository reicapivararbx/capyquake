const API = {
  async json(url, opts = {}) {
    const res = await fetch(url, {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error?.message || `Erro ${res.status}`);
    return data;
  }
};

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
    const r = await API.json('/api/auth/login', { method: 'POST', body: { username, password } });
    this.user = r.user;
    await this.refresh();
    return r.user;
  },

  async register(username, displayName, password, confirmPassword) {
    const r = await API.json('/api/auth/register', {
      method: 'POST',
      body: { username, displayName, password, confirmPassword }
    });
    this.user = r.user;
    await this.refresh();
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
      info.textContent = `👤 ${this.user.displayName} · Lv ${this.profile?.level ?? 1} · R$ ${(this.profile?.coins ?? 0).toLocaleString('pt-BR')}`;
      const out = document.createElement('button');
      out.id = 'btn-logout-account';
      out.className = 'ghost';
      out.textContent = 'SAIR';
      out.addEventListener('click', () => this.logout());
      bar.append(info, out);
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
    } catch (ex) {
      err.textContent = ex.message;
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
      if (password !== confirm) throw new Error('Senhas não conferem.');
      await Account.register(username, display || undefined, password);
      document.getElementById('auth-dialog').close();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'CRIAR CONTA';
    }
  });
}
