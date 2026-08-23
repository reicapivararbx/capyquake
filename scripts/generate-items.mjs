// Gera server/items.json a partir do catalogo real da loja (src/shop-data.js).
// Uso: node scripts/generate-items.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync(new URL('../src/shop-data.js', import.meta.url), 'utf8');
const sectionRe = /id:\s*'([a-z0-9-]+)',\s*icon:\s*'[^']*',\s*title:\s*'([^']+)',\s*currency:\s*'([a-z]+)'/g;
const itemRe = /\{ item:\s*'([a-z0-9-]+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']*)',\s*cost:\s*(\d+),\s*currency:\s*'([a-z]+)',\s*icon:\s*'([^']*)',\s*grant:\s*\{\s*type:\s*'([a-z]+)'/g;

const sections = [];
let m;
while ((m = sectionRe.exec(src)) !== null) {
  sections.push({ id: m[1], title: m[2], currency: m[3], start: m.index });
}
const items = [];
while ((m = itemRe.exec(src)) !== null) {
  const sec = sections.filter(s => s.start < m.index).at(-1);
  if (!sec || sec.id === 'rebirth') continue; // exclusivos RT nao sao give-item
  items.push({ id: m[1], name: m[2], section: sec.id, cost: Number(m[4]), currency: m[5] });
}
const seen = new Set();
const catalog = [];
for (const it of items) {
  if (seen.has(it.id)) continue;
  seen.add(it.id);
  catalog.push(it);
}
mkdirSync(new URL('../server/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../server/items.json', import.meta.url),
  JSON.stringify({ generatedFrom: 'src/shop-data.js', count: catalog.length, items: catalog }, null, 2) + '\n'
);
console.log(`OK: ${catalog.length} itens unicos -> server/items.json`);
