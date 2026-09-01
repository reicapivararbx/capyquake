import { login, register } from '../services/auth.js';

/**
 * Modal Entrar / Criar conta (API real cq_session).
 * @param {{ onSuccess?: () => void, onClose?: () => void, mode?: 'login'|'register' }} [opts]
 * @returns {{ root: HTMLElement, open: () => void, close: () => void, focus: () => void }}
 */
export function createLoginModal(opts = {}) {
  let mode = opts.mode || 'login';
  /** @type {Element|null} */
  let lastFocus = null;

  const root = document.createElement('div');
  root.className = 'modal';
  root.hidden = true;
  root.setAttribute('aria-hidden', 'true');

  root.innerHTML = `
    <div class="modal__backdrop" data-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="login-title" tabindex="-1">
      <button type="button" class="modal__close" data-close aria-label="Fechar">×</button>
      <h2 id="login-title" class="modal__title">Entrar</h2>
      <p class="modal__lead">Conta compartilhada do Capyquake. Sessão via cookie seguro.</p>
      <form class="login-form" novalidate>
        <label class="field">
          <span>Usuário</span>
          <input name="username" autocomplete="username" required minlength="3" maxlength="24" />
        </label>
        <label class="field field--display" hidden>
          <span>Nome exibido</span>
          <input name="displayName" autocomplete="nickname" maxlength="40" />
        </label>
        <label class="field">
          <span>Senha</span>
          <input name="password" type="password" autocomplete="current-password" required minlength="6" />
        </label>
        <label class="field field--confirm" hidden>
          <span>Confirmar senha</span>
          <input name="confirmPassword" type="password" autocomplete="new-password" minlength="6" />
        </label>
        <p class="form-error" role="alert" hidden></p>
        <div class="modal__actions">
          <button type="submit" class="btn btn--primary btn--block" data-submit>Entrar</button>
        </div>
      </form>
      <p class="modal__switch">
        <button type="button" class="linkish" data-toggle-mode>Criar conta</button>
      </p>
      <p class="modal__note">Contas de <strong>developer</strong>, <strong>admin</strong> e superiores têm acesso ao painel em <code>/admin</code> — distinto de jogadores comuns.</p>
    </div>
  `;

  const panel = root.querySelector('.modal__panel');
  const form = root.querySelector('form');
  const title = root.querySelector('#login-title');
  const err = root.querySelector('.form-error');
  const submitBtn = root.querySelector('[data-submit]');
  const toggle = root.querySelector('[data-toggle-mode]');
  const displayField = root.querySelector('.field--display');
  const confirmField = root.querySelector('.field--confirm');
  const passInput = root.querySelector('input[name="password"]');

  function setMode(next) {
    mode = next;
    const isReg = mode === 'register';
    title.textContent = isReg ? 'Criar conta' : 'Entrar';
    submitBtn.textContent = isReg ? 'Criar conta' : 'Entrar';
    toggle.textContent = isReg ? 'Já tenho conta' : 'Criar conta';
    displayField.hidden = !isReg;
    confirmField.hidden = !isReg;
    passInput.autocomplete = isReg ? 'new-password' : 'current-password';
    err.hidden = true;
    err.textContent = '';
  }

  function open() {
    lastFocus = document.activeElement;
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setMode(mode);
    queueMicrotask(() => {
      root.querySelector('input[name="username"]')?.focus();
    });
  }

  function close() {
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    err.hidden = true;
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
    opts.onClose?.();
  }

  root.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  toggle.addEventListener('click', () => {
    setMode(mode === 'login' ? 'register' : 'login');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) {
      e.preventDefault();
      close();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const fd = new FormData(form);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '');
    const displayName = String(fd.get('displayName') || '').trim();
    const confirmPassword = String(fd.get('confirmPassword') || '');

    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'login' ? 'Entrando…' : 'Criando…';

    try {
      const result =
        mode === 'login'
          ? await login(username, password)
          : await register({ username, password, confirmPassword, displayName: displayName || undefined });

      if (!result.ok) {
        err.textContent = result.error;
        err.hidden = false;
        return;
      }
      close();
      opts.onSuccess?.();
    } finally {
      submitBtn.disabled = false;
      setMode(mode);
    }
  });

  return { root, open, close, focus: () => panel?.focus() };
}
