import { GAMES } from '../data/games.js';
import { features } from '../core/features.js';
import { renderGameCard } from './GameCard.js';

/**
 * Home: hero, 4 game cards, honest secondary panels with real links where ready.
 * @returns {DocumentFragment}
 */
export function renderHomePage() {
  const frag = document.createDocumentFragment();
  frag.append(buildHero(), buildGamesSection(), buildSecondary(), buildManifesto());
  return frag;
}

/** @returns {HTMLElement} */
function buildHero() {
  const section = document.createElement('section');
  section.className = 'shell home-hero';
  section.setAttribute('aria-labelledby', 'home-title');

  const copy = document.createElement('div');
  copy.innerHTML = `
    <p class="home-hero__eyebrow">m.zanona.com.br · portal oficial</p>
    <h1 class="home-hero__title" id="home-title">Bem-vindo ao Capy</h1>
    <p class="home-hero__lead">
      Jogos, servidores, conquistas e novidades do universo Capy — um endereço para todos os projetos.
    </p>
    <div class="home-hero__actions">
      <a class="btn btn--primary" href="/jogos">Explorar jogos <span aria-hidden="true">→</span></a>
      <a class="btn" href="/capyquake/">Jogar Capyquake <span aria-hidden="true">→</span></a>
    </div>
  `;

  const map = document.createElement('div');
  map.className = 'home-map';
  map.setAttribute('aria-label', 'Mapa visual dos quatro projetos');
  map.innerHTML = `
    <div class="home-map__orbit" aria-hidden="true">
      <svg viewBox="0 0 500 410" preserveAspectRatio="none">
        <path d="M92 104 C190 40 306 250 415 161 S300 368 214 314 S155 160 92 104"
          fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1.5" stroke-dasharray="5 8"/>
      </svg>
    </div>
  `;

  for (const g of GAMES) {
    const node = document.createElement('div');
    node.className = `home-map__node home-map__node--${g.accent}`;
    node.dataset.label = g.mapLabel;
    node.textContent = g.symbol;
    map.append(node);
  }

  const core = document.createElement('div');
  core.className = 'home-map__node home-map__node--core';
  core.dataset.label = 'PORTAL';
  core.textContent = 'CAPY';
  map.append(core);

  section.append(copy, map);
  return section;
}

/** @returns {HTMLElement} */
function buildGamesSection() {
  const section = document.createElement('section');
  section.className = 'home-section';
  section.id = 'jogos';

  const shell = document.createElement('div');
  shell.className = 'shell';

  const head = document.createElement('div');
  head.className = 'home-section__head';
  head.innerHTML = `
    <h2>Jogos</h2>
    <p>Cada projeto tem identidade própria. Status e links refletem o que está publicado de verdade.</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'games-grid';
  grid.setAttribute('role', 'list');

  for (const game of GAMES) {
    const card = renderGameCard(game);
    card.setAttribute('role', 'listitem');
    grid.append(card);
  }

  shell.append(head, grid);
  section.append(shell);
  return section;
}

/** @returns {HTMLElement} */
function buildSecondary() {
  const section = document.createElement('section');
  section.className = 'shell home-secondary';
  section.setAttribute('aria-label', 'Mais do portal');

  const servers = document.createElement('div');
  servers.className = 'home-panel';
  servers.id = 'servidores';
  servers.innerHTML = `
    <h3>Servidores</h3>
    <p>O browser de salas públicas ainda não está disponível. No Capyquake, multiplayer usa lobbies por código dentro do jogo.</p>
    <p style="margin-top:12px"><a class="btn btn--sm" href="/servidores">Ver status</a>
    <a class="btn btn--sm" href="/capyquake/" style="margin-left:8px">Abrir Capyquake</a></p>
  `;

  const wiki = document.createElement('div');
  wiki.className = 'home-panel';
  wiki.id = 'wiki';
  if (features.wiki) {
    wiki.innerHTML = `
      <h3>Wiki</h3>
      <p>Guias e artigos em markdown dos projetos Capy — raridades, controles e como jogar.</p>
      <p style="margin-top:12px"><a class="btn btn--sm" href="/wiki">Abrir wiki</a></p>
    `;
  } else {
    wiki.innerHTML = `
      <h3>Wiki</h3>
      <p>Guias e artigos do portal chegam em breve.</p>
    `;
  }

  const news = document.createElement('div');
  news.className = 'home-panel';
  news.id = 'novidades';
  news.innerHTML = `
    <h3>Novidades</h3>
    <div class="empty-state" style="margin-top:12px;border:0;padding:0;text-align:left">
      <strong>Nenhuma novidade publicada ainda.</strong>
      Quando houver changelog oficial, ele aparece aqui — sem inventar posts.
    </div>
    <p style="margin-top:12px"><a class="btn btn--sm" href="/novidades">Abrir novidades</a></p>
  `;

  const social = document.createElement('div');
  social.className = 'home-panel';
  social.innerHTML = `
    <h3>Amigos e conquistas</h3>
    <div class="empty-state" style="margin-top:12px;border:0;padding:0;text-align:left">
      <strong>Sem dados sociais no portal ainda.</strong>
      Conquistas documentadas já estão no catálogo; amigos dependem de API.
    </div>
    <p style="margin-top:12px"><a class="btn btn--sm" href="/conquistas">Ver conquistas</a>
    <a class="btn btn--sm" href="/perfil" style="margin-left:8px">Perfil</a></p>
  `;

  section.append(servers, wiki, news, social);
  return section;
}

/** @returns {HTMLElement} */
function buildManifesto() {
  const section = document.createElement('section');
  section.className = 'shell home-manifesto';
  section.id = 'universo';
  section.innerHTML = `
    <div class="home-manifesto__copy">
      <p class="home-hero__eyebrow">O universo Capy</p>
      <h2>Projetos diferentes. Uma casa só.</h2>
      <p>Este portal organiza os jogos, páginas e wikis. Nenhuma experiência fica perdida — e cada novo projeto tem um lugar claro para nascer.</p>
    </div>
    <div class="home-principles">
      <div class="home-principle"><b>Rotas estáveis</b><span>Cada jogo possui endereço próprio e links antigos continuam protegidos.</span></div>
      <div class="home-principle"><b>Status honesto</b><span>Online é online; o que ainda não existe no backend aparece vazio, não inventado.</span></div>
      <div class="home-principle"><b>Equipe distinta</b><span>Contas developer/admin abrem /admin e badges de staff — diferentes de jogadores comuns.</span></div>
      <div class="home-principle"><b>Uma navegação</b><span>Todos os jogos oferecem um caminho simples de volta para este portal.</span></div>
    </div>
  `;
  return section;
}
