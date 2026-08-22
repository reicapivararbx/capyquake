# Learnings - Animals 30x Realism

## Arquitetura atual (src/animals.js, 3176 linhas)
- `Animal.TYPES` com ~100 espécies; cada uma tem createMesh() procedural (Sphere/Cylinder/Cone + MeshLambertMaterial).
- Pipeline de realismo já existente (linhas 2572-2841):
  - `getSurfaceSettings()` → roughness/clearcoat por categoria (AQUATIC/SCALED/FURRED/FLYING).
  - `createRealisticMaterial()` → converte Lambert→MeshStandard/MeshPhysical (clearcoat p/ aquático+escamado). MeshBasic (olhos/magia) fica emissivo 0.16x.
  - `prepareRealisticMesh()` → categoriza por volume/posição: body, head, wings, legs, tails; adiciona sombra de contato e dorsal ridges.
  - `animateRealisticMesh()` → breath body, head bob, gait pernas (fase por diagonal), tails sway, wings flap.
- `update(delta, playerPos)` → wander/chase, rotação y, posição y (voadores 2±0.28, aquáticos 0.28±0.1, terrestres bob 0.022).
- Morte: die() → spawnBlood/spawnSkeleton/spawnBBQ. hitbox de ataque = esfera vermelha.

## Renderer (src/renderer.js, 58 linhas) - GARGALO PARA PBR
- antialias: false, setPixelRatio(1), BasicShadowMap, SEM toneMapping, SEM environment map.
- Luzes: Ambient 1.4 + Directional 0.7 (castShadow) + fill 0.3.
- Sem toneMapping, MeshPhysicalMaterial fica chapado → principal alavanca de realismo.
- three@0.164.1 tem RoomEnvironment.js em examples/jsm/environments/.

## Observações
- Texturas procedurais devem usar módulo-level cache (chave type+cor) - ~100 tipos, muitos animais simultâneos.
- Materiais compartilhados (uma instância por cor): materialCache dedupe por uuid do material antigo.
- Basline: npm run build passa (3s).

## [2026-08-20] Explorer: integração animals.js
- Único integrador: game.js `spawnAnimals()` — instancia `new Animal(scene, x, z, type, arena)` com posição aleatória de sala; chama `update(delta, playerPos)`, `takeDamage(amount)`, `getDropMoney()`, `getDropTokens()`, `.alive`, `.mesh`.
- Nenhum outro arquivo consome Animal/TYPES (matches de TYPES em node_modules são do three, irrelevantes).
- Renderer JÁ UPGRADED (task 1): ACESFilmic 1.1, sRGB, PCFSoft, antialias, pixelRatio≤2, IBL RoomEnvironment 0.55, ambient 0.8.

## [2026-08-20] Task 1 VERIFICADA (renderer.js)
- Diff conferido linha a linha: corrige antialias, pixelRatio, shadowMap, toneMapping, colorSpace, PMREM env, ambient 0.8 ✓
- Build passa, node --check OK. Mudanças player.js/index.html/dist são pré-existentes.

## [2026-08-20] Animals pipeline 30x realism
- Texturas procedurais centralizadas em `src/animals.js` com `skinTextureCache` por `type:corHex`; CanvasTexture 256x256, SRGB, anisotropy 4. Sem textura por frame; materiais continuam dedupados por `materialCache` de material antigo.
- Padrões por categoria: rosetas/fur noise/tigre/zebra/girafa/dapples; escamas/coral/diamantes/selas/casco/armadura; aquáticos com escamas e tubarão/boto; penas com gradiente arara/fenix.
- FURRED agora usa MeshPhysicalMaterial com sheen (0.7), sheenRoughness (0.9), envMapIntensity 0.55; aquático 1.2, escamado 1.0, voador/default 0.8.
- Olhos vivos detectados por material originalmente MeshBasic + volume pequeno + posição superior/frontal; adiciona geometrias/material compartilhados de pupila e glint como filhos do olho.
- Movimento central ganhou lean/bob de galope, gait por velocidade, slither para serpentes, ondulação tubarão/pirarucu, asas com chasing amplitude 0.45 e contra-rotação de corpo.
- Sombra de contato usa CanvasTexture radial 128x128 cacheada com opacity 0.32 mantendo posição/escala/renderOrder.
