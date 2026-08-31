import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

test('portal central publica os três jogos e o projeto em desenvolvimento', async () => {
  const html = await read('portal/index.html');
  assert.match(html, /href="\/capyquake\/"/);
  assert.match(html, /href="\/capyrails\/"/);
  assert.match(html, /href="\/capyzen\/"/);
  assert.match(html, /3 JOGOS ONLINE/);
  assert.match(html, /Jogar Capyzen/);
  assert.match(html, /Simulação e cuidado/);
  assert.doesNotMatch(html, /Capyzen[\s\S]{0,500}EM BREVE/i);
  assert.match(html, /Find the Markers/);
  assert.match(html, /href="https:\/\/github\.com\/reicapivararbx\/find-the-markers"/);
  assert.match(html, /<span class="badge">EM DEV<\/span>/);
  assert.match(html, /Repositório público/);
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
  assert.doesNotMatch(config, /location = \/capyzen\/ \{ root \/var\/www\/html\/capyportal;/);
  assert.doesNotMatch(config, /alias \/var\/www\/html\/capyportal\/index\.html/);
});
