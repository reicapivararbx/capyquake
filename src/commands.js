const commandState = {
  list: [],
  loaded: false,
  sendFn: null,
  activeBox: null
};

export function initCommands(sendFn) {
  commandState.sendFn = sendFn;
  refreshCommandList(sendFn);
}

function refreshCommandList(sendFn) {
  if (!sendFn) return;
  try {
    sendFn({ type: 'listCommands' });
    commandState.loaded = true;
  } catch {}
}

export function handleCommandSocketMessage(msg) {
  if (msg.type === 'commandList') {
    commandState.list = Array.isArray(msg.data) ? msg.data : [];
    commandState.loaded = true;
  } else if (msg.type === 'commandResult') {
    showCommandToast(msg.data?.ok, msg.data?.message || '');
  }
}

let toastEl = null;
function showCommandToast(ok, message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'cmd-toast';
    toastEl.style.cssText = [
      'position:fixed', 'top:64px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:2250', 'padding:10px 22px', 'border-radius:999px',
      "font:800 13px 'Segoe UI',system-ui,sans-serif", 'letter-spacing:.5px',
      'box-shadow:0 8px 24px rgba(0,0,0,.4)', 'transition:opacity .25s', 'opacity:0', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = (ok ? '✓ ' : '✗ ') + message;
  toastEl.style.background = ok ? 'linear-gradient(135deg,#166534,#14532d)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)';
  toastEl.style.color = '#fff';
  toastEl.style.opacity = '1';
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; }, 3200);
}

const PARAM_LABELS = {
  user: 'User ID ou @username',
  amount: 'Quantidade',
  days: 'Duração (dias)',
  level: 'Nível (1-100)'
};

export function attachCommandAutocomplete(inputEl) {
  if (!inputEl || inputEl._cmdAttached) return;
  inputEl._cmdAttached = true;

  const box = document.createElement('div');
  box.className = 'cmd-autocomplete';
  box.style.display = 'none';
  const anchorParent = inputEl.parentElement;
  if (anchorParent && getComputedStyle(anchorParent).position === 'static') {
    anchorParent.style.position = 'relative';
  }
  (anchorParent || document.body).appendChild(box);

  const renderSuggestions = (filterText) => {
    const q = filterText.toLowerCase();
    const matches = commandState.list.filter(c => c.name.startsWith(q));
    if (!matches.length) {
      box.style.display = 'none';
      return;
    }
    box.innerHTML = '';
    for (const cmd of matches) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'cmd-suggestion';
      const title = document.createElement('b');
      title.textContent = `/${cmd.name}`;
      const desc = document.createElement('span');
      desc.textContent = ` ${cmd.desc} (${cmd.params.join(', ')})`;
      item.append(title, desc);
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        hideSuggestions();
        openCommandDialog(cmd);
      });
      box.appendChild(item);
    }
    box.style.display = 'block';
  };

  const hideSuggestions = () => { box.style.display = 'none'; };

  inputEl.addEventListener('input', () => {
    const v = inputEl.value;
    if (v.startsWith('/') && v.length >= 1) {
      renderSuggestions(v.slice(1).split(' ')[0]);
      if (!commandState.loaded) refreshCommandList(commandState.sendFn);
    } else {
      hideSuggestions();
    }
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { hideSuggestions(); return; }
    if (e.key === 'Tab' && inputEl.value.startsWith('/')) {
      e.preventDefault();
      const first = box.querySelector('.cmd-suggestion');
      if (first) first.dispatchEvent(new Event('mousedown'));
    }
  });

  inputEl.addEventListener('blur', () => setTimeout(hideSuggestions, 150));

  const origSendGuard = inputEl._cmdSendInterceptor;
  inputEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const v = inputEl.value.trim();
    if (!v.startsWith('/')) return;
    e.preventDefault();
    e.stopPropagation();
    const parts = v.slice(1).split(/\s+/);
    const cmdName = (parts[0] || '').toLowerCase();
    const cmd = commandState.list.find(c => c.name === cmdName)
      || { name: cmdName, params: [], destructive: false };
    hideSuggestions();
    inputEl.value = '';
    if (cmd.params && cmd.params.length) {
      openCommandDialog(cmd, parts.slice(1));
    } else {
      executeCommand(cmd.name, []);
    }
  }, true);
}

function executeCommand(name, args) {
  if (!commandState.sendFn) return;
  try {
    commandState.sendFn({ type: 'command', name, args });
    refreshCommandList(commandState.sendFn);
  } catch {}
}

function openCommandDialog(cmd, prefill = []) {
  document.getElementById('cmd-dialog-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cmd-dialog-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2300;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.8);padding:16px;';
  const isDestructive = !!cmd.destructive;

  const fieldsHtml = (cmd.params || []).map((p, i) => `
    <label style="display:block;color:#9aa0b4;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:12px 0 4px;">${PARAM_LABELS[p] || p}</label>
    <input id="cmdf-${p}" data-param="${p}" value="${prefill[i] ? String(prefill[i]).replace(/"/g, '&quot;') : ''}"
      style="width:100%;box-sizing:border-box;padding:11px 14px;font-size:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#fff;outline:none;" />`).join('');

  const reasonField = `
    <label style="display:block;color:#9aa0b4;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:12px 0 4px;">Motivo (opcional)</label>
    <input id="cmdf-reason" style="width:100%;box-sizing:border-box;padding:11px 14px;font-size:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:10px;color:#fff;outline:none;" />`;

  overlay.innerHTML = `<div style="background:linear-gradient(180deg,#16121f,#0e0c13);border:1px solid ${isDestructive ? '#f8717155' : '#3f3a52'};border-radius:16px;padding:22px;width:min(400px,94vw);max-height:88vh;overflow-y:auto;font-family:'Segoe UI',system-ui,sans-serif;">
    <h3 style="margin:0 0 4px;color:${isDestructive ? '#f87171' : '#c4b5fd'};font-size:15px;letter-spacing:2px;">/${cmd.name}</h3>
    <p style="margin:0 0 6px;color:#8b90a3;font-size:12px;">${cmd.desc || ''}${isDestructive ? ' · <b style="color:#f87171">AÇÃO DESTRUTIVA</b>' : ''}</p>
    <div id="cmd-step-params">${fieldsHtml}${reasonField}
      <div id="cmd-error" style="color:#ff7b7b;font-size:12px;min-height:16px;margin-top:8px;"></div>
      <button id="cmd-go" style="margin-top:6px;width:100%;padding:12px;background:${isDestructive ? 'linear-gradient(160deg,#ef4444,#991b1b)' : 'linear-gradient(160deg,#8b5cf6,#6d28d9)'};border:none;border-radius:10px;color:#fff;font-weight:800;font-family:inherit;font-size:14px;cursor:pointer;">${isDestructive ? 'CONTINUAR...' : 'EXECUTAR'}</button>
      <button id="cmd-cancel" style="margin-top:8px;width:100%;padding:9px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#9aa0b4;font-family:inherit;font-size:12px;cursor:pointer;">Cancelar</button>
    </div>
    <div id="cmd-step-confirm" style="display:none;">
      <p style="margin:8px 0;color:#d6d8e4;font-size:13px;" id="cmd-confirm-text"></p>
      <button id="cmd-confirm" style="margin-top:6px;width:100%;padding:12px;background:linear-gradient(160deg,#ef4444,#991b1b);border:none;border-radius:10px;color:#fff;font-weight:800;font-family:inherit;font-size:14px;cursor:pointer;">CONFIRMAR EXECUÇÃO</button>
      <button id="cmd-back" style="margin-top:8px;width:100%;padding:9px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#9aa0b4;font-family:inherit;font-size:12px;cursor:pointer;">Voltar</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
  document.getElementById('cmd-cancel').addEventListener('click', close);

  const collectArgs = () => (cmd.params || []).map(p => document.getElementById(`cmdf-${p}`).value.trim());
  const errEl = document.getElementById('cmd-error');

  const validateAndRun = () => {
    const args = collectArgs();
    for (let i = 0; i < args.length; i++) {
      if (!args[i]) {
        errEl.textContent = `Preencha: ${PARAM_LABELS[cmd.params[i]] || cmd.params[i]}`;
        return;
      }
    }
    const reason = document.getElementById('cmdf-reason')?.value.trim() || '';
    executeCommand(cmd.name, [...args, ...(reason ? [reason] : [])]);
    close();
  };

  document.getElementById('cmd-go').addEventListener('click', () => {
    if (isDestructive) {
      const args = collectArgs();
      const stepParams = document.getElementById('cmd-step-params');
      const stepConfirm = document.getElementById('cmd-step-confirm');
      document.getElementById('cmd-confirm-text').innerHTML =
        `Executar <b style="color:#f87171">/${cmd.name}</b> em <b>${args[0] || '?'}</b>?<br><span style="color:#8b90a3;font-size:12px;">Essa ação será registrada nos logs administrativos.</span>`;
      stepParams.style.display = 'none';
      stepConfirm.style.display = 'block';
    } else {
      validateAndRun();
    }
  });

  document.getElementById('cmd-confirm')?.addEventListener('click', () => {
    const args = collectArgs();
    const reason = document.getElementById('cmdf-reason')?.value.trim() || '';
    executeCommand(cmd.name, [...args, ...(reason ? [reason] : [])]);
    close();
  });
  document.getElementById('cmd-back')?.addEventListener('click', () => {
    document.getElementById('cmd-step-confirm').style.display = 'none';
    document.getElementById('cmd-step-params').style.display = 'block';
  });

  const firstField = overlay.querySelector('#cmdf-' + (cmd.params?.[0] || 'user'));
  setTimeout(() => firstField?.focus(), 50);
}
