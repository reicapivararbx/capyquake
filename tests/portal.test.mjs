import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// A SPA do portal virou repositório próprio (../portal). Aqui ficam só os
// pontos de integração que pertencem ao Capyquake: nginx e painel admin.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

test('admin geral rebrand + módulos portal/messages', async () => {
  const index = await read('server/admin/index.html');
  const login = await read('server/admin/login.html');
  const app = await read('server/admin/app.js');
  assert.match(index, /Portal Capy · Admin Geral|PORTAL CAPY/);
  assert.match(index, /#\/messages/);
  assert.match(index, /#\/portal-news/);
  assert.match(index, /#\/portal-wiki/);
  assert.match(index, /#\/portal-achievements/);
  assert.match(login, /ADMIN GERAL/);
  assert.match(app, /pageMessages/);
  assert.match(app, /pagePortalNews/);
  assert.match(app, /messages\.global/);
  assert.match(app, /portal\.news/);
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
