// Central key bindings: reads 'capiquake_settings' from localStorage.
// The settings screen saves display values ('W', 'SHIFT', 'CTRL', 'ESC', ' ', 'F3'...).
// This module converts them to KeyboardEvent.code values and is the single
// source of truth for configurable input across player.js / game.js / weapon.js.

const DEFAULTS = {
  'key-move-forward': 'W',
  'key-move-back': 'S',
  'key-move-left': 'A',
  'key-move-right': 'D',
  'key-jump': ' ',
  'key-sprint': 'SHIFT',
  'key-pickup': 'E',
  'key-void': 'F',
  'key-camera': 'F3',
  'key-fart': 'T',
  'key-emotes': 'B',
  'key-sniper': 'CTRL',
  'key-inventory': 'ESC',
  'key-drop': 'Z',
  'key-grenade': 'G',
  'key-speedrush': 'H',
  'key-pause': 'F2'
};

let cache = null;

export function getKeyBindings() {
  if (cache) return cache;
  let saved = {};
  try {
    const raw = localStorage.getItem('capiquake_settings');
    if (raw) saved = JSON.parse(raw) || {};
  } catch (e) {
    saved = {};
  }
  cache = { ...DEFAULTS, ...saved };
  return cache;
}

// Call after saving new settings so changes apply immediately (no reload).
export function invalidateKeyBindings() {
  cache = null;
}

function displayToCodes(display) {
  const v = String(display ?? '').trim().toUpperCase();
  if (!v) return [];
  switch (v) {
    case ' ': return ['Space'];
    case 'SPACE': return ['Space'];
    case 'SHIFT': return ['ShiftLeft', 'ShiftRight'];
    case 'CTRL': return ['ControlLeft', 'ControlRight'];
    case 'ALT': return ['AltLeft', 'AltRight'];
    case 'ESC': return ['Escape'];
    case 'ENTER': return ['Enter'];
    case 'TAB': return ['Tab'];
  }
  if (/^[A-Z]$/.test(v)) return ['Key' + v];
  if (/^F\d{1,2}$/.test(v)) return [v];
  if (/^DIGIT\d$/.test(v)) return [v];
  return [v];
}

export function codesFor(action) {
  const bindings = getKeyBindings();
  return displayToCodes(bindings[action]);
}

export function keyMatches(action, code) {
  return codesFor(action).indexOf(code) !== -1;
}
