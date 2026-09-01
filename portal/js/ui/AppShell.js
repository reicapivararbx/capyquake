import { renderTopNav } from './TopNav.js';

/**
 * @param {{
 *   onlineCount?: number,
 *   currentPath?: string,
 *   mainId?: string,
 *   account?: import('../services/auth.js').Account|null,
 *   onLogin?: () => void,
 *   onProfile?: () => void,
 *   onSearch?: () => void,
 * }} [opts]
 * @returns {{ root: HTMLElement, main: HTMLElement, header: HTMLElement }}
 */
export function renderAppShell(opts = {}) {
  const root = document.createElement('div');
  root.className = 'app-shell';

  const header = renderTopNav({
    onlineCount: opts.onlineCount,
    currentPath: opts.currentPath,
    account: opts.account,
    onLogin: opts.onLogin,
    onProfile: opts.onProfile,
    onSearch: opts.onSearch,
  });

  const main = document.createElement('main');
  main.className = 'app-main';
  main.id = opts.mainId ?? 'conteudo';

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="shell site-footer__row">
      <span>© <span data-year></span> Capy</span>
      <span>Capyquake · Capyrails · Capyzen · Find the Markers</span>
    </div>
  `;
  const year = footer.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  root.append(header, main, footer);
  return { root, main, header };
}
