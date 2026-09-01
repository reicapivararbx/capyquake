import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

test('portal central publica os quatro jogos', async () => {
  const html = await read('portal/index.html');
  const games = await read('portal/js/data/games.js');
  const home = await read('portal/js/ui/HomePage.js');
  const card = await read('portal/js/ui/GameCard.js');
  const corpus = [html, games, home, card].join('\n');

  assert.match(corpus, /href="\/capyquake\/"/);
  assert.match(corpus, /href="\/capyrails\/"/);
  assert.match(corpus, /href="\/capyzen\/"/);
  assert.match(corpus, /4 JOGOS ONLINE/);
  assert.match(corpus, /Jogar Capyzen/);
  assert.match(corpus, /Simulação e cuidado/);
  assert.doesNotMatch(corpus, /Capyzen[\s\S]{0,500}EM BREVE/i);
  assert.match(corpus, /Find the Markers/);
  assert.match(corpus, /href="\/find-the-markers\/"/);
  assert.match(corpus, /Procurar os Markers/);
  assert.match(corpus, /Phaser 3/);
  assert.doesNotMatch(corpus, /Find the Markers[\s\S]{0,500}EM DEV/i);
});

test('portal modular usa /capy-portal/ e não invade /assets/ do Capyquake', async () => {
  const html = await read('portal/index.html');
  assert.match(html, /href="\/capy-portal\/css\/tokens\.css"/);
  assert.match(html, /href="\/capy-portal\/css\/pages\.css"/);
  assert.match(html, /src="\/capy-portal\/js\/app\.js"/);
  assert.doesNotMatch(html, /href="\/assets\//);
  assert.doesNotMatch(html, /src="\/assets\//);

  const cssFiles = await readdir(join(root, 'portal/css'));
  for (const name of [
    'tokens.css',
    'base.css',
    'shell.css',
    'components.css',
    'home.css',
    'pages.css',
  ]) {
    assert.ok(cssFiles.includes(name), `missing portal/css/${name}`);
  }

  const app = await read('portal/js/app.js');
  assert.match(app, /renderAppShell/);
  assert.match(app, /renderHomePage/);
  assert.match(app, /startRouter/);
  assert.match(app, /fetchMe/);
  assert.match(app, /createLoginModal/);
  assert.match(app, /createProfileDrawer/);

  const games = await read('portal/js/data/games.js');
  assert.match(games, /status:\s*'online'/);
  assert.match(games, /id:\s*'capyquake'/);
  assert.match(games, /id:\s*'capyrails'/);
  assert.match(games, /id:\s*'capyzen'/);
  assert.match(games, /id:\s*'find-the-markers'/);
  const onlineCount = (games.match(/status:\s*'online'/g) || []).length;
  assert.equal(onlineCount, 4);
});

test('portal home não inventa dados sociais ou de servidores', async () => {
  const home = await read('portal/js/ui/HomePage.js');
  assert.match(home, /Nenhuma novidade publicada ainda/);
  assert.match(home, /Sem dados sociais no portal ainda/);
  assert.match(home, /browser de salas públicas ainda não está disponível/i);
  assert.doesNotMatch(home, /\bMiku\b/i);
  assert.doesNotMatch(home, /Roblox/i);
});

test('rarity SSOT getAchievementRarity cobre a tabela oficial', async () => {
  const mod = await import(
    pathToFileURL(join(root, 'portal/js/utils/rarity.js')).href
  );
  const { getAchievementRarity, RARITY_TABLE, computeUnlockRate } = mod;

  assert.equal(getAchievementRarity(100), 'Brinde');
  assert.equal(getAchievementRarity(90), 'Brinde');
  assert.equal(getAchievementRarity(89.99), 'Moleza');
  assert.equal(getAchievementRarity(50), 'Fácil');
  assert.equal(getAchievementRarity(30), 'Moderado');
  assert.equal(getAchievementRarity(20), 'Desafiador');
  assert.equal(getAchievementRarity(10), 'Difícil');
  assert.equal(getAchievementRarity(5), 'Extremo');
  assert.equal(getAchievementRarity(1), 'Insano');
  assert.equal(getAchievementRarity(0.7), 'Lendário');
  assert.equal(getAchievementRarity(0), 'Lendário');
  assert.equal(RARITY_TABLE.length, 9);
  assert.equal(computeUnlockRate(143, 20428).toFixed(2), '0.70');
});

test('roles staff/admin distintas de jogador e apontam /admin', async () => {
  const roles = await read('portal/js/core/roles.js');
  assert.match(roles, /ADMIN_VIEW_ROLES/);
  assert.match(roles, /developer/);
  assert.match(roles, /head_admin/);
  assert.match(roles, /ADMIN_HREF\s*=\s*'\/admin\/'/);
  assert.match(roles, /canViewAdmin/);
  assert.match(roles, /isStaff/);

  const mod = await import(pathToFileURL(join(root, 'portal/js/core/roles.js')).href);
  assert.equal(mod.canViewAdmin('admin'), true);
  assert.equal(mod.canViewAdmin('developer'), true);
  assert.equal(mod.canViewAdmin('king'), true);
  assert.equal(mod.canViewAdmin('citizen'), false);
  assert.equal(mod.canActAdmin('best_capybara'), false);
  assert.equal(mod.canActAdmin('developer'), true);
  assert.equal(mod.isStaff('admin'), true);
  assert.equal(mod.isStaff('visitante'), false);
  assert.equal(mod.roleTone('developer'), 'dev');
  assert.equal(mod.roleTone('king'), 'king');
  assert.equal(mod.roleTone('citizen'), 'player');

  const drawer = await read('portal/js/ui/ProfileDrawer.js');
  assert.match(drawer, /ADMIN_HREF/);
  assert.match(drawer, /Abrir painel admin|Conta da equipe/);
  assert.match(drawer, /canViewAdmin/);

  const topnav = await read('portal/js/ui/TopNav.js');
  assert.match(topnav, /topnav__admin|ADMIN_HREF/);
  assert.match(topnav, /canViewAdmin/);
});

test('router trata jogos e /admin como foreign paths', async () => {
  const mod = await import(pathToFileURL(join(root, 'portal/js/core/router.js')).href);
  assert.equal(mod.isForeignPath('/capyquake/'), true);
  assert.equal(mod.isForeignPath('/capyrails/'), true);
  assert.equal(mod.isForeignPath('/admin/'), true);
  assert.equal(mod.isForeignPath('/api/users/me'), true);
  assert.equal(mod.isForeignPath('/capy-portal/js/app.js'), true);
  assert.equal(mod.isForeignPath('/jogos'), false);
  assert.equal(mod.isForeignPath('/wiki/capyquake/inicio'), false);
  assert.equal(mod.isForeignPath('/perfil'), false);
  // SPA overlays under game prefixes stay in-portal
  assert.equal(mod.isForeignPath('/capyquake/conquistas'), false);
  assert.equal(mod.isForeignPath('/capyquake/servidores'), false);
  assert.equal(mod.isForeignPath('/capyrails/conquistas/'), false);

  assert.equal(mod.matchRoute('/').name, 'home');
  assert.equal(mod.matchRoute('/jogos').name, 'games');
  assert.equal(mod.matchRoute('/jogos/capyquake').name, 'game');
  assert.equal(mod.matchRoute('/jogos/capyquake').params.gameId, 'capyquake');
  assert.equal(mod.matchRoute('/wiki').name, 'wiki');
  assert.equal(mod.matchRoute('/wiki/capyquake/raridades').name, 'wiki-article');
  assert.equal(mod.matchRoute('/capyquake/conquistas').name, 'game-achievements');
  assert.equal(mod.matchRoute('/servidores').name, 'servers');
  assert.equal(mod.matchRoute('/xyz-nope').name, 'not-found');
});

test('nginx preserva APIs e WebSockets ao separar os projetos', async () => {
  const config = await read('deploy/nginx-m-zanona.conf');
  assert.match(config, /location \/api\//);
  assert.match(config, /location = \/ws/);
  assert.match(config, /location = \/capyrails\/ws/);
  assert.match(config, /location \/capyquake\//);
  assert.match(config, /location \/railsgame\//);
  assert.match(config, /location = \/ \{ root \/var\/www\/html\/capyportal;/);
  assert.match(config, /location \/capyzen\/ \{ root \/var\/www\/html;/);
  assert.match(config, /location \/find-the-markers\/ \{ root \/var\/www\/html;/);
  assert.match(config, /location = \/find-the-markers \{ return 308 \/find-the-markers\/; \}/);
  assert.doesNotMatch(config, /location = \/capyzen\/ \{ root \/var\/www\/html\/capyportal;/);
  assert.doesNotMatch(config, /alias \/var\/www\/html\/capyportal\/index\.html/);
});

test('nginx serve assets do portal em /capy-portal/ e SPA deep links', async () => {
  const config = await read('deploy/nginx-m-zanona.conf');
  assert.match(config, /location \/capy-portal\/ \{/);
  assert.match(config, /alias \/var\/www\/html\/capyportal\/;/);
  assert.match(config, /location \/assets\/ \{ proxy_pass http:\/\/127\.0\.0\.1:8080;/);
  const portalAssetBlocks = config.match(/location \/capy-portal\//g) || [];
  assert.ok(portalAssetBlocks.length >= 2, 'expected /capy-portal/ in both server blocks');

  assert.match(config, /location \^~ \/jogos/);
  assert.match(config, /location \^~ \/wiki/);
  assert.match(config, /location \^~ \/conquistas/);
  assert.match(config, /location \^~ \/perfil/);
  assert.match(config, /location \^~ \/servidores/);
  assert.match(config, /location \/admin/);
});

test('SPA pages e wiki/achievements existem sem Miku/Roblox', async () => {
  const pages = await readdir(join(root, 'portal/js/pages'));
  for (const name of [
    'GamesPage.js',
    'GameDetailPage.js',
    'ServersPage.js',
    'AchievementsPage.js',
    'WikiPage.js',
    'NewsPage.js',
    'ProfilePage.js',
    'FriendsPage.js',
    'NotFoundPage.js',
  ]) {
    assert.ok(pages.includes(name), `missing page ${name}`);
  }

  const rarityMd = await read('portal/content/wiki/capyquake/_raridades.md');
  assert.match(rarityMd, /Brinde/);
  assert.match(rarityMd, /Lendário/);
  assert.match(rarityMd, /getAchievementRarity/);

  const corpus = (
    await Promise.all(
      [
        'portal/js/app.js',
        'portal/js/ui/HomePage.js',
        'portal/js/ui/ProfileDrawer.js',
        'portal/js/data/achievements.js',
        'portal/js/data/wiki.js',
      ].map(read),
    )
  ).join('\n');
  assert.doesNotMatch(corpus, /\bMiku\b/i);
  assert.doesNotMatch(corpus, /Roblox/i);
});
