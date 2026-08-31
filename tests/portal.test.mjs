import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

test('portal central publica os quatro jogos', async () => {
  const html = await read('portal/index.html');
  assert.match(html, /href="\/capyquake\/"/);
  assert.match(html, /href="\/capyrails\/"/);
  assert.match(html, /href="\/capyzen\/"/);
  assert.match(html, /4 JOGOS ONLINE/);
  assert.match(html, /Jogar Capyzen/);
  assert.match(html, /Simulação e cuidado/);
  assert.doesNotMatch(html, /Capyzen[\s\S]{0,500}EM BREVE/i);
  assert.match(html, /Find the Markers/);
  assert.match(html, /href="\/find-the-markers\/"/);
  assert.match(html, /Procurar os Markers/);
  assert.match(html, /Phaser 3/);
  assert.doesNotMatch(html, /Find the Markers[\s\S]{0,500}EM DEV/i);
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
