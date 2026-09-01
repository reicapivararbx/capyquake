import { GAMES } from '../data/games.js';
import { WIKI_SECTIONS } from '../data/wiki.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { navigate } from '../core/router.js';

/**
 * Client-side search across games, wiki, achievements (no fake players).
 * @returns {{ root: HTMLElement, open: () => void, close: () => void }}
 */
export function createSearchModal() {
  /** @type {Element|null} */
  let lastFocus = null;

  const root = document.createElement('div');
  root.className = 'modal search-modal';
  root.hidden = true;
  root.innerHTML = `
    <div class="modal__backdrop" data-close></div>
    <div class="modal__panel search-modal__panel" role="dialog" aria-modal="true" aria-label="Buscar">
      <div class="search-modal__bar">
        <input type="search" class="search-modal__input" placeholder="Buscar jogos, guias, conquistas…" autocomplete="off" />
        <button type="button" class="modal__close" data-close aria-label="Fechar">×</button>
      </div>
      <div class="search-modal__results" data-results role="listbox" aria-label="Resultados"></div>
    </div>
  `;

  const input = root.querySelector('input');
  const results = root.querySelector('[data-results]');

  function open() {
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    render('');
    queueMicrotask(() => input.focus());
  }

  function close() {
    root.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  root.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) {
      e.preventDefault();
      close();
    }
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isTyping(e))) {
      // Ctrl+K handled in app; / optional
    }
  });

  input.addEventListener('input', () => render(input.value));

  function render(q) {
    const query = String(q || '').trim().toLowerCase();
    results.replaceChildren();

    if (!query) {
      const hint = document.createElement('p');
      hint.className = 'search-modal__hint';
      hint.textContent = 'Digite para buscar jogos, artigos da wiki e conquistas.';
      results.append(hint);
      return;
    }

    /** @type {{ group: string, label: string, href: string, sub?: string }[]} */
    const hits = [];

    for (const g of GAMES) {
      const hay = `${g.name} ${g.kind} ${g.description} ${g.tags.join(' ')}`.toLowerCase();
      if (hay.includes(query)) {
        hits.push({
          group: 'Jogos',
          label: g.name,
          href: `/jogos/${g.id}`,
          sub: g.kind,
        });
      }
    }

    for (const sec of WIKI_SECTIONS) {
      for (const a of sec.articles) {
        const hay = `${a.title} ${a.description} ${sec.title}`.toLowerCase();
        if (hay.includes(query)) {
          hits.push({
            group: 'Wiki',
            label: a.title,
            href: `/wiki/${sec.gameId}/${a.slug}`,
            sub: sec.title,
          });
        }
      }
    }

    for (const ach of ACHIEVEMENTS) {
      if (ach.secret) continue;
      const hay = `${ach.name} ${ach.description}`.toLowerCase();
      if (hay.includes(query)) {
        hits.push({
          group: 'Conquistas',
          label: ach.name,
          href: `/conquistas`,
          sub: ach.gameId,
        });
      }
    }

    if (!hits.length) {
      const empty = document.createElement('p');
      empty.className = 'search-modal__hint';
      empty.textContent = 'Nenhum resultado. Tente outro termo.';
      results.append(empty);
      return;
    }

    let lastGroup = '';
    for (const h of hits.slice(0, 40)) {
      if (h.group !== lastGroup) {
        lastGroup = h.group;
        const gh = document.createElement('p');
        gh.className = 'search-modal__group';
        gh.textContent = h.group;
        results.append(gh);
      }
      const a = document.createElement('a');
      a.className = 'search-modal__hit';
      a.href = h.href;
      a.setAttribute('role', 'option');
      a.innerHTML = `<strong>${escape(h.label)}</strong>${h.sub ? `<span>${escape(h.sub)}</span>` : ''}`;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        close();
        navigate(h.href);
      });
      results.append(a);
    }
  }

  return { root, open, close };
}

/** @param {KeyboardEvent} e */
function isTyping(e) {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || t.isContentEditable;
}

/** @param {string} s */
function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
