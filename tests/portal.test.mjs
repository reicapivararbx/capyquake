import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

test('portal central publica os três projetos nas rotas canônicas', async () => {
  const html = await read('portal/index.html');
  assert.match(html, /href="\/capyquake\/"/);
  assert.match(html, /href="\/capyrails\/"/);
  assert.match(html, /href="\/capyzen\/"/);
  assert.match(html, /2 JOGOS ONLINE/);
});

test('Capyzen informa que ainda não possui build público', async () => {
  const html = await read('portal/capyzen/index.html');
  assert.match(html, /não possui um build público/);
  assert.match(html, /EM DESENVOLVIMENTO/);
  assert.doesNotMatch(html, /Jogar Capyzen/i);
});

test('nginx preserva APIs e WebSockets ao separar os projetos', async () => {
  const config = await read('deploy/nginx-m-zanona.conf');
  assert.match(config, /location \/api\//);
  assert.match(config, /location = \/ws/);
  assert.match(config, /location = \/capyrails\/ws/);
  assert.match(config, /location \/capyquake\//);
  assert.match(config, /location \/railsgame\//);
  assert.match(config, /location = \/ \{ root \/var\/www\/html\/capyportal;/);
  assert.match(config, /location = \/capyzen\/ \{ root \/var\/www\/html\/capyportal;/);
  assert.doesNotMatch(config, /alias \/var\/www\/html\/capyportal\/index\.html/);
});
