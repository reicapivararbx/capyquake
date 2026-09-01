# ⚔️ Armas

O CapiQuake tem **mais de 75 armas**: um catálogo clássico de armas brancas e de fogo definidas no motor do jogo, mais as armas modernas (pistolas, rifles, snipers, energéticas) vendidas na [Loja](Loja-e-Economia.md).

O dano listado é o **valor base** — multiplicadores de rebirth e modos de jogo são aplicados por cima. DPS é calculado (dano ÷ cooldown), só para comparação.

## 🗡️ Catálogo clássico (`weapon.js`)

### Corpo a corpo (munição infinita)

| Arma | Dano | Alcance | Cooldown | DPS |
|---|---|---|---|---|
| ADAGA | 10 | 3,0 | 0,18s | 55,6 |
| CHICOTE | 9 | 5,5 | 0,35s | 25,7 |
| CLAVA | 13 | 3,5 | 0,40s | 32,5 |
| FLORETE | 14 | 4,5 | 0,22s | 63,6 |
| LANCA | 16 | 6,0 | 0,45s | 35,6 |
| RAPIEIRA | 16 | 4,5 | 0,20s | **80,0** |
| SABRE | 17 | 4,0 | 0,28s | 60,7 |
| ESPADA | 18 | 4,0 | 0,30s | 60,0 |
| TRIDENTE | 19 | 5,5 | 0,40s | 47,5 |
| MACA | 22 | 3,5 | 0,50s | 44,0 |
| MACHADO DE BATALHA | 24 | 3,5 | 0,55s | 43,6 |
| ALABARDA | 25 | 6,0 | 0,60s | 41,7 |
| MARTELO DE GUERRA | 26 | 3,5 | 0,65s | 40,0 |
| BASTAO | 12 | 4,0 | 0,30s | 40,0 |

> O golpe melee acerta **1 alvo** (raycast à frente). O MARTELO DE GUERRA não tem dano em área — é um golpe normal forte.

### À distância (consomem munição compartilhada)

| Arma | Tipo | Dano | Alcance | Cooldown | DPS |
|---|---|---|---|---|---|
| PISTOLA | hitscan | 20 | 40 | 0,12s | 166,7 |
| FUNDA | projétil | 8 | 50 | 0,50s | 16,0 |
| BUMERANGUE | projétil | 11 | 30 | 0,60s | 18,3 |
| ARCO | projétil | 15 | 70 | 0,60s | 25,0 |
| BESTA | projétil | 20 | 80 | 0,80s | 25,0 |
| AK-47 | hitscan | 30 | 60 | 0,40s | 75,0 |
| CAJADO DE FOGO | hitscan | 25 | 30 | 2,30s | 10,9 (auto-fire segurando o botão) |
| SNIPER | hitscan | 120 | 150 | 2,00s | 60,0 |
| MINIGUN | hitscan | 1000 ×2 tiros | 80 | 0,03s | ~66.700 · **munição infinita** |
| BAZUCA | explosivo | 100 em área | 80 | 11,0s | 9,1 por alvo (atinge vários) |
| CHICKEN GUN | projétil | 5–80 aleatório | 60 | 5,0s | ~8,5 |
| APRIL FOOLS GUN | hitscan | 0,5 | 50 | 20,0s | 0,025 🤡 |

### Preços das armas especiais

| Arma | R$ | Tokens |
|---|---|---|
| MINIGUN | 10.000.000 | 500 |
| BAZUCA | 100.000.000 | 10.000 |
| SNIPER | 50.000 | 50 |
| CAJADO DE FOGO | 25.000 | 25 |
| APRIL FOOLS GUN | 500.000 | 500 |
| CHICKEN GUN | 490 | 490 |

## 🔫 Armas modernas da Loja

Adicionadas pelo catálogo da loja, com estatísticas próprias (dano / tipo / alcance / cooldown):

| Categoria | Armas | Stats típicos |
|---|---|---|
| Pistolas | Glock, Desert Eagle, Hand Cannon | 30 dmg · hitscan · 45 alcance · 0,44s |
| SMGs | Uzi, MP5, P90, Vector, Tactical SMG | 24–25 dmg · 50 alcance · 0,18s |
| Rifles | M4A1, SCAR-H, FAMAS, AUG, G36, M16, AK-74, Galil, TAR-21... | 36–37 dmg · 70 alcance · 0,26s |
| Shotguns | SPAS-12, M870, Double Barrel, AA-12, S12K | 56–59 dmg · 30 alcance · 1,5s |
| Snipers | Kar98k, M24, AWP, Barrett, Dragunov, Auto Sniper | 99–112 dmg · 150 alcance · 3,6s |
| Energéticas | Railgun, Plasma Gun, Laser Rifle, Void Blaster, Golden Gun... | 39–108 dmg · 45–90 alcance |
| Explosivas | Rocket Launcher, Bazuca, Grenade Launcher, Mini Rocket | ~121–125 dmg · projétil · 80 alcance · 7,0s |
| Elementais | Flamethrower, Ice Gun, Thunder Gun | 79–85 dmg · 60 alcance · 1,2s |
| Especiais | Heavy Minigun (45 dmg · 0,26s), Hyper Gun, Energy Cannon, Crossbow/Heavy Crossbow | varia |

Preços na loja: de **R$ 750** a **R$ 50.000** → veja [Loja e Economia](Loja-e-Economia.md).

## 💥 Mecânicas de combate

### Munição
- Existe **um pool único de munição** compartilhado por todas as armas de tiro (você começa com 30).
- **Armas brancas = infinitas** · **Minigun = infinita**.
- Baús e drops de munição rolam uma tabela: 50% +10 · 25% +15 · 24% +20 · 0,9% +1.000 · 0,1% **munição infinita** 🎉
- Não existe recarga manual — quando o pool zera, você não atira.

### Habilidades das armas
- **Sniper**: segure **CTRL** para mirar (zoom FOV 75 → 15).
- **BAZUCA**: foguete que explode com raio 6 e causa 100 fixos em todos ao redor; detona em parede ou no fim do alcance.
- **CHICKEN GUN**: dispara uma galinha com dano aleatório entre 5 e 80 por tiro.
- **CAJADO DE FOGO**: segure o botão esquerdo para disparar continuamente.
- **Lentidão de gelo**: vem de *encantamento* comprado na loja (aplica-se a qualquer arma), não de arma específica.

### Inventário
- Você começa com **BASTAO + PISTOLA**.
- Trocar arma: teclas **1–9** ou roda do mouse · Largar arma: **Z**.
- Compras de arma na loja são permanentes e ficam disponíveis em todas as partidas.
