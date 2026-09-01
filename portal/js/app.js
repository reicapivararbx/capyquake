import { countOnlineGames } from './data/games.js';
import { renderAppShell } from './ui/AppShell.js';
import { renderHomePage } from './ui/HomePage.js';
import { createLoginModal } from './ui/LoginModal.js';
import { createProfileDrawer } from './ui/ProfileDrawer.js';
import { createSearchModal } from './ui/SearchModal.js';
import {
  fetchMe,
  getCachedAccount,
  onAuthChange,
} from './services/auth.js';
import { matchRoute, setTitle, startRouter } from './core/router.js';
import { features } from './core/features.js';

import { renderGamesPage } from './pages/GamesPage.js';
import { renderGameDetailPage } from './pages/GameDetailPage.js';
import { renderServersPage } from './pages/ServersPage.js';
import { renderAchievementsPage } from './pages/AchievementsPage.js';
import { renderWikiHubPage, renderWikiArticlePage } from './pages/WikiPage.js';
import { renderNewsPage } from './pages/NewsPage.js';
import { renderProfilePage, renderUserPage } from './pages/ProfilePage.js';
import { renderFriendsPage } from './pages/FriendsPage.js';
import { renderNotFoundPage } from './pages/NotFoundPage.js';

/**
 * Portal SPA entry — shell, auth, router, pages.
 * Assets under /capy-portal/; games/API/admin are full navigations.
 */
function boot() {
  const mount = document.getElementById('app');
  if (!mount) {
    console.error('[capy-portal] #app mount missing');
    return;
  }

  const onlineCount = countOnlineGames();

  const loginModal = createLoginModal({
    onSuccess: () => {
      refreshChrome();
      renderRoute(matchRoute());
    },
  });

  const searchModal = createSearchModal();

  const profileDrawer = createProfileDrawer({
    onLoginRequest: () => loginModal.open(),
    onChange: () => {
      refreshChrome();
      renderRoute(matchRoute());
    },
  });

  /** @type {HTMLElement} */
  let headerEl;
  /** @type {HTMLElement} */
  let mainEl;
  /** @type {HTMLElement} */
  let rootEl;

  function buildShell(path) {
    const { root, main, header } = renderAppShell({
      onlineCount,
      currentPath: path,
      mainId: 'conteudo',
      account: getCachedAccount(),
      onLogin: () => loginModal.open(),
      onProfile: () => profileDrawer.open(getCachedAccount()),
      onSearch: features.search ? () => searchModal.open() : undefined,
    });
    rootEl = root;
    mainEl = main;
    headerEl = header;
    mount.replaceChildren(root, loginModal.root, profileDrawer.root, searchModal.root);
  }

  function refreshChrome() {
    const path = location.pathname;
    const account = getCachedAccount();
    profileDrawer.update(account);
    const { root, main, header } = renderAppShell({
      onlineCount,
      currentPath: path,
      mainId: 'conteudo',
      account,
      onLogin: () => loginModal.open(),
      onProfile: () => profileDrawer.open(getCachedAccount()),
      onSearch: features.search ? () => searchModal.open() : undefined,
    });
    // Keep main content; swap header only when possible
    const oldMain = rootEl?.querySelector('.app-main');
    const content = oldMain ? [...oldMain.childNodes] : [];
    rootEl = root;
    mainEl = main;
    headerEl = header;
    if (content.length) main.append(...content);
    mount.replaceChildren(root, loginModal.root, profileDrawer.root, searchModal.root);
  }

  /**
   * @param {import('./core/router.js').Route} route
   */
  function renderRoute(route) {
    if (!mainEl) buildShell(route.path);
    else {
      // Update nav current state cheaply by rebuilding shell header path
      const account = getCachedAccount();
      const { root, main, header } = renderAppShell({
        onlineCount,
        currentPath: location.pathname,
        mainId: 'conteudo',
        account,
        onLogin: () => loginModal.open(),
        onProfile: () => profileDrawer.open(getCachedAccount()),
        onSearch: features.search ? () => searchModal.open() : undefined,
      });
      rootEl = root;
      mainEl = main;
      headerEl = header;
      mount.replaceChildren(root, loginModal.root, profileDrawer.root, searchModal.root);
    }

    mainEl.replaceChildren();
    mainEl.append(pageFor(route));
    window.scrollTo(0, 0);
  }

  /**
   * @param {import('./core/router.js').Route} route
   * @returns {Node}
   */
  function pageFor(route) {
    switch (route.name) {
      case 'home':
        setTitle('');
        return renderHomePage();
      case 'games':
        return renderGamesPage();
      case 'game':
        return renderGameDetailPage(route.params.gameId);
      case 'servers':
        return renderServersPage();
      case 'game-servers':
        return renderServersPage(route.params.gameId);
      case 'achievements':
        return renderAchievementsPage();
      case 'game-achievements':
        return renderAchievementsPage(route.params.gameId);
      case 'wiki':
        return renderWikiHubPage();
      case 'wiki-game':
        return renderWikiHubPage(route.params.gameId);
      case 'wiki-article':
        return renderWikiArticlePage(route.params.gameId, route.params.slug);
      case 'news':
        return renderNewsPage();
      case 'news-item':
        return renderNewsPage(route.params.slug);
      case 'profile':
        return renderProfilePage({ onLoginRequest: () => loginModal.open() });
      case 'user':
        return renderUserPage(route.params.username);
      case 'friends':
        return renderFriendsPage();
      default:
        return renderNotFoundPage();
    }
  }

  buildShell(location.pathname);
  startRouter(renderRoute);

  onAuthChange(() => {
    profileDrawer.update(getCachedAccount());
    refreshChrome();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      if (!features.search) return;
      e.preventDefault();
      searchModal.open();
    }
  });

  document.documentElement.classList.add('js');

  fetchMe().catch(() => {
    /* guest */
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
