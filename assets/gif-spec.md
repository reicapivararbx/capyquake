# Capiquake — GIF Animation Specification

> Especificação para GIF promocional animado, na identidade visual atual (dark + neon laranja/roxo).

---

## Visão Geral

| Propriedade | Valor |
|-------------|-------|
| **Propósito** | GIF promocional para README/social |
| **Duração** | 8–10 segundos |
| **Loop** | Perfeito (último frame → primeiro) |
| **Resolução** | 1280×720 |
| **Frame rate** | 30 FPS fonte → 15–20 FPS GIF |
| **Cores** | 256 (limite GIF), otimizar para paleta escura |
| **Tamanho alvo** | < 5MB |

## Paleta

| Token | Hex | Uso no GIF |
|-------|-----|------------|
| Background Base | `#0b0b10` | Fundo geral |
| Orange Glow | `#ff6600` / `#ffb347` | Tiro, mira, título, destaques |
| Purple Neon | `#7c3aed` / `#a78bfa` | Multiplayer, energia, código |
| Money Green | `#4ade80` | HP, ONLINE, preços |
| Token Gold | `#ffd000` | Tokens, placar |

## Sequência de Frames

### 0.0s – 2.0s: Arena (plano de estabelecimento)
- Pan lento horizontal pela arena escura
- Iluminação laranja de cima + névoa com partículas
- Paleta: `#0b0b10`, roxo `#17101f` nas bordas, acentos `#ff6600`

### 2.0s – 3.5s: Entrada da capivara
- Capivara guerreira surge no centro (fade ou queda)
- Pose de combate, rim light laranja + contra-luz roxa

### 3.5s – 5.5s: Combate
- Tiros em streaks luminosos laranja e roxo
- Impactos com flash; kill feed aparecendo no canto
- Screen shake sutil nos tiros

### 5.5s – 7.0s: HUD reveal
- Barras de VIDA/STAMINA/XP preenchendo
- Contador de kills subindo; hotbar trocando de slot com glow laranja

### 7.0s – 8.5s: Montagem rápida
- Cuts rápidos (0.4s cada): loja fullscreen → modos grid → lobby com código CAPY-42 → boss bar enchendo

### 8.5s – 10.0s: Logo
- "CAPIQUAKE" centralizado, QUAKE com gradiente animado laranja→vermelho
- Subtítulo "A GRANDE CAÇADA" fade in
- Glow pulsando; último frame = primeiro frame (loop)

## Exportação

```bash
# ffmpeg a partir de frames PNG
ffmpeg -framerate 18 -i frame_%04d.png -vf "fps=18,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 capyquake.gif
```
