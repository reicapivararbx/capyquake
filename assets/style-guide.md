# Capiquake Visual Style Guide

> Documento de referência da identidade visual atual do jogo. Todos os templates e prompts derivam daqui.

## Identidade Geral

- **Estética**: dark + neon. Fundos quase pretos levemente azulados/arroxeados, acentos laranja (núcleo do jogo) e roxo (multiplayer/energia), detalhes verde-dinheiro e dourado-token.
- **Formas**: cantos arredondados em tudo (8–18px), cards com borda discreta + glow no hover, cápsulas (border-radius 999px) para chips e botões secundários.
- **Tipografia**: `'Segoe UI', system-ui, sans-serif` em TODAS as telas de UI. Monospace ('Courier New') apenas para números/preços/códigos.

## Paleta de Cores

### Fundos
| Token | Hex | Uso |
|-------|-----|-----|
| Background Base | `#0b0b10` | Menu, lobby, modos (topo) |
| Background Deep | `#12151c` / `#0c0e13` | Painéis (stats, admin) |
| Background Card | `#17171f → #121218` | Cards (gradiente 180deg) |
| Background Hover | `rgba(255,255,255,.05)` | Superfícies interativas |
| Overlay | `rgba(0,0,0,.75–.85)` | Modais |

### Laranja (identidade principal)
| Token | Hex | Uso |
|-------|-----|-----|
| Orange Gradient | `#ffb347 → #ff6600` | Logo QUAKE, títulos, botão Singleplayer |
| Orange Solid | `#ff8c00` | Bordas de hover, ícones, mira |
| Orange Glow | `rgba(255,140,0,.2–.5)` | Box-shadows de destaque |

### Roxo (multiplayer/energia)
| Token | Hex | Uso |
|-------|-----|-----|
| Purple Gradient | `#8b5cf6 → #6d28d9` | Botão Multiplayer, INICIAR PARTIDA |
| Purple Light | `#a78bfa` / `#c084fc` | Códigos, textos de rebirth |
| Purple Glow | `rgba(109,40,217,.4)` | Sombras roxas |

### Semânticas
| Token | Hex | Uso |
|-------|-----|-----|
| Money Green | `#4ade80` | Preços R$, ONLINE, READY, vitória |
| Token Gold | `#ffd000` | Preços 🪙, RT, valores destacados |
| Stamina Cyan | `#38bdf8` | Barra de stamina, inventário |
| Danger Red | `#ef4444` / `#ff7b7b` | Morte, erros, highlight ≤15 animais |
| Text Primary | `#f5f5f7` / `#e8e8ef` | Títulos e corpo |
| Text Muted | `#9aa0b4` / `#6b6b78` | Labels, descrições |

## Tipografia

| Elemento | Estilo |
|----------|--------|
| Título do menu | clamp(52–96px), weight 900, "CAPI" branco + "QUAKE" gradiente laranja |
| Labels de seção | 11–13px, weight 700–800, CAIXA ALTA, letter-spacing 2–3px, `#9aa0b4` |
| Títulos de painel | 20–26px, weight 900, gradiente no texto (laranja/roxo/azul conforme tela) |
| Corpo/descrições | 11.5–14px, `#8b90a3` |
| Números/preços | 'Courier New', monospace, bold |

## Componentes

### Botão primário (ação principal)
```css
padding: 14px;
background: linear-gradient(160deg, <cor-clara>, <cor-escura>);
border: none; border-radius: 12px; color: #fff; font-weight: 800;
box-shadow: 0 8px 24px rgba(<cor>, .35);
/* hover: translateY(-2px) + shadow maior */
```

### Card de item/modo
```css
background: linear-gradient(180deg, #17171f, #121218);
border: 1px solid #2a2a38; border-radius: 12px;
/* hover: border-color accent + translateY(-2/-3px) + glow */
```

### Chip / cápsula
```css
padding: 8px 16px; border-radius: 999px;
background: rgba(<accent>, .09); border: 1px solid rgba(<accent>, .45);
```

### Inputs
```css
background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.14);
border-radius: 999px (texto) ou 10px (select); color: #f5f5f7;
/* focus: border-color accent + box-shadow 0 0 0 3px rgba(accent,.18) */
```

## Telas — Tema por Tela

| Tela | Accent | Notas |
|------|--------|-------|
| Menu | Laranja | Radial glow laranja no topo, roxo discreto embaixo |
| Modos de Jogo | Laranja | Grid auto-fill de cards com ícone/nome/desc |
| Loja | Laranja + verde/dourado nos preços | Fullscreen, header sticky, grid auto-fill 240px |
| Multiplayer/Lobby | Roxo | 2 colunas: sala+slots / preview da arena neon |
| Conquistas | Âmbar `#ffcc00` | Painel modal com filtros duplos |
| Rebirth | Violeta `#7c3aed` | Checklist de requisitos com estado done ✓ |
| Stats & Ranking | Azul `#3b82f6` | Tabela TOP 10 + grid de números |
| Morte | Vermelho `#dc2626` | Painel escuro avermelhado |
| Celebração | Dourado festivo | Placar em vidro |
| Configurações | Violeta slate | Sliders accent-color roxo |

## Dimensões de Referência

| Asset | Resolução |
|-------|-----------|
| Banner / Gameplay / Multiplayer | 1920×1080 |
| Menu / Shop / Conquistas / Modos | 1600×900 |
