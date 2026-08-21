# Capiquake Visual Style Guide

> Foundation document for all README visual assets. Every template and prompt references this guide.

## Color Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| Background Dark | `#0D0D0D` | Menu bg top, deep backgrounds |
| Background Body | `#1A1A1A` | Body bg, input bg |
| Background Panel Shop | `#080808` | Shop panel bg |
| Background Panel | `#0A0A0A` | Achievements panel bg |
| Background Button | `#3A2A1A` | Menu/lobby buttons |
| Background Shop Item | `#101D11` | Shop item buttons |
| Background Brown | `#2A1A0A` | Menu bg bottom, lobby, celebration |
| Background Card Unlocked | `#0A1A0A` | Unlocked achievement card |

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#FF6600` | Title, borders, crosshair, menu accents |
| Shop Orange | `#FF8C00` | Shop h2/h3 titles |
| Gold Text | `#FFCC66` | Button text, input text, weapon display, timer |
| Gold Dark | `#AA8844` | Subtitle, inventory display |
| Achievement Gold | `#FFCC00` | Achievement header h2 |

### UI Element Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Text Light | `#E0D0A0` | Body default text |
| Text Red | `#FF4444` | Health text, victim names, boss label |
| Text Green | `#88CC44` | Animal count |
| Text Blue | `#66CCFF` | Armor display |
| Text Token Yellow | `#FFDD44` | Tokens display |
| Text Money Green | `#44FF88` | Money display |
| Text Stamina Blue | `#44AAFF` | Stamina bar fill |

### Shop Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Shop Item Border | `#19A52A` | Shop item border |
| Shop Item Text | `#BAFFBA` | Shop item text |
| Shop Item Hover Border | `#32FF4D` | Shop item hover border |
| Shop Convert Gold | `#FFD000` | Token convert button |

### Bar Colors
| Token | Gradient | Usage |
|-------|----------|-------|
| Health Bar | `#CC0000` → `#FF2200` | Health bar fill |
| Stamina Bar | `#2266CC` → `#44AAFF` | Stamina bar fill |
| Boss Bar | `#CC0000` → `#FF4400` | Boss bar fill |

### Achievement Progress
| Token | Hex | Usage |
|-------|-----|-------|
| Progress Fill | `#44CC44` | Progress bar fill, unlocked border |
| Progress BG | `#222222` | Progress bar background |

## Achievement Rarity Colors

| Rarity | Background | Text | Border |
|--------|-----------|------|--------|
| COMMON | `#888888` | `#FFFFFF` | none |
| UNCOMMON | `#2ECC71` | `#FFFFFF` | none |
| RARE | `#3498DB` | `#FFFFFF` | none |
| EPIC | `#9B59B6` | `#FFFFFF` | none |
| LEGENDARY | `#E67E22` | `#FFFFFF` | none |
| MYTHIC | `#E74C3C` | `#FFFFFF` | none |
| DIVINE | `linear-gradient(135deg, #F1C40F, #E67E22)` | `#000000` | none |
| CURSED | `#2C3E50` | `#E74C3C` | `1px solid #E74C3C` |

## Typography

### Fonts
- **Primary (Game UI)**: `'Courier New', monospace` — used in ALL game UI screens (menu, shop, HUD, achievements, lobby)
- **Display (Banner only)**: `Orbitron` from Google Fonts — used ONLY for the promotional banner title
- **UI Alternative**: `Share Tech Mono` from Google Fonts — acceptable for template UI when Courier New feels too plain

### Font Sizes (per-element, NOT systematic)
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Menu Title | 72px | bold | `#FF6600` |
| Banner Title | 96px | bold | `#FF6600` |
| Menu Subtitle | 18px | normal | `#AA8844` |
| Shop/Settings h2 | 28-36px | bold | `#FF8C00` / `#FF6600` |
| Shop h3 | 14px | bold | `#FF8C00` |
| Match Timer | 28px | normal | `#FFCC66` |
| Celebration h1 | 56px | bold | `#FF6600` |
| Achievement h2 | 22px | bold | `#FFCC00` |
| Menu Button | 20px | normal | `#FFCC66` |
| Input Text | 18px | normal | `#FFCC66` |
| Health/Stamina Text | 14px | normal | `#FF4444` |
| Stats Kills | 24px | bold | `#FF6600` |
| Resources | 14px | normal | per-element |
| Kill Feed | 14px | normal | `#DDD` |
| Weapon Display | 16px | normal | `#FFCC66` |
| Boss Label | 14px | bold | `#FF4444` |
| Shop Item | 12px | normal | `#BAFFBA` |
| Achievement Name | 14px | bold | `#FFFFFF` |
| Achievement Desc | 11px | normal | `#999999` |
| Achievement Count | 13px | normal | `#AAAAAA` |
| Filter Button | 11px | normal | `#AAAAAA` |
| Rarity Filter | 10px | normal | `#888888` |

## Button Styles

### Menu/Lobby Button
```css
width: 300px;
padding: 15px;
margin: 8px;
font-size: 20px;
font-family: 'Courier New', monospace;
background: #3A2A1A;
color: #FFCC66;
border: 2px solid #FF6600;
text-transform: uppercase;
letter-spacing: 2px;
```
Hover: `background: #FF6600; color: #1A1A1A; transform: scale(1.05);`

### Shop Item Button
```css
min-height: 42px;
padding: 8px 12px;
background: #101D11;
border: 1px solid #19A52A;
color: #BAFFBA;
font-family: monospace;
font-size: 12px;
```
Hover: `background: #17351B; border-color: #32FF4D;`

### Achievement Filter Button
```css
padding: 5px 12px;
background: #1A1A1A;
border: 1px solid #444;
color: #AAA;
font-family: monospace;
font-size: 11px;
```
Active: `background: #2A2A2A; border-color: #FFCC00; color: #FFCC00;`

## Panel Styles

### Shop Panel
- Width: 850px (max 90vw)
- Background: `#080808`
- Border: `1px solid #222`
- Padding: `25px 30px`

### Achievements Panel
- Width: 90vw (max 800px)
- Height: 85vh
- Background: `#0A0A0A`
- Border: `1px solid #444`

## Dimensions

| Asset | Width | Height | Aspect |
|-------|-------|--------|--------|
| Banner | 1920px | 1080px | 16:9 |
| Gameplay HUD | 1920px | 1080px | 16:9 |
| Multiplayer | 1920px | 1080px | 16:9 |
| Shop | 1600px | 900px | 16:9 |
| Achievements | 1600px | 900px | 16:9 |
| Menu | 1600px | 900px | 16:9 |

## Spacing

No strict grid system. Game uses ad-hoc spacing per element:
- Menu buttons: 8px margin
- Shop sections: 20px margin
- Achievement cards: 8px margin-bottom
- Panel padding: 16-30px
- HUD elements: positioned absolutely with per-element offsets
