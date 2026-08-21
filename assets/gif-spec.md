# Capiquake — GIF Animation Specification

> Complete specification for creating an animated GIF promotional sequence.

---

## Overview

| Property | Value |
|----------|-------|
| **Purpose** | Animated promotional GIF for GitHub README or social media |
| **Duration** | 8-10 seconds |
| **Loop** | Seamless loop (last frame → first frame) |
| **Resolution** | 1280x720 (720p) |
| **Frame Rate** | 30 FPS source → 15-20 FPS GIF |
| **Colors** | 256 (GIF limit), optimize for dark palette |
| **File Size Target** | < 5MB |

---

## Frame Sequence

### 0.0s — 2.0s: Arena Establishing Shot

**Visual:** Camera slowly pans across the dark medieval arena environment.

- **Background:** Stone walls, wooden structures, dramatic orange lighting from above
- **Camera movement:** Slow horizontal pan from left to right (30 degrees)
- **Atmosphere:** Fog particles floating, dust motes in light beams
- **Color palette:** #0D0D0D (dark), #2A1A0A (brown), #FF6600 (orange accents)
- **Key elements:** Show arena scale, pillars, debris, moody lighting

### 2.0s — 3.5s: Capybara Character Entrance

**Visual:** Capybara warrior appears in the center of the arena.

- **Character:** Muscular capybara in rugged armor, holding AK-47
- **Entrance:** Fade in from darkness or drop from above
- **Pose:** Combat-ready stance, weapon raised
- **Lighting:** Spotlight effect on character, orange rim light
- **Name tag:** "JOGADOR" floating above in #FFCC66

### 3.5s — 5.5s: Enemies Spawn + Combat Begins

**Visual:** Enemies appear and combat initiates.

- **Enemies:** 4-5 humanoid figures spawn from arena edges
- **Enemy design:** Dark silhouettes with red health bars
- **First shots:** Capybara fires weapon, orange projectile trails
- **Impact:** Sparks where projectiles hit enemies
- **Camera:** Slight shake on impact for dynamic feel

### 5.5s — 7.5s: Full Combat Action

**Visual:** Chaotic multiplayer combat scene.

- **Multiple characters:** 3-4 capybara fighters engaged in battle
- **Projectiles:** Orange and blue trails flying across screen
- **Impacts:** Particle explosions on hits
- **Kill feed:** Text appearing in top-left showing eliminations
- **Health bars:** Visible above characters, some depleting
- **Dynamic camera:** Subtle movements following action

### 7.5s — 8.5s: Climax + Logo Fade-In

**Visual:** Final action beat transitioning to logo.

- **Big moment:** Boss enemy appears or major explosion
- **Screen flash:** Brief white/orange flash (2-3 frames)
- **Logo fade:** "CAPIQUAKE" title fades in from center
- **Subtitle:** "A Grande Caçada" appears below
- **Glow effect:** Orange glow around title text

### 8.5s — 10.0s: Hold + Loop Transition

**Visual:** Logo holds, then transitions back to start.

- **Logo hold:** 1 second static with subtle glow pulse
- **Fade out:** Quick fade to black (0.3s)
- **Loop point:** Matches first frame for seamless loop

---

## Technical Specifications

### Color Optimization

```
Primary colors to preserve:
- #FF6600 (orange) — Title, accents, projectiles
- #FFCC66 (gold) — Text, UI elements
- #0D0D0D (dark) — Backgrounds
- #2A1A0A (brown) — Arena structures
- #CC0000 (red) — Health bars, enemy accents

Dithering: Floyd-Steinberg recommended for gradients
Transparency: None (full frames)
```

### Frame Export Settings

| Setting | Value |
|---------|-------|
| Format | PNG sequence → GIF |
| Color depth | 8-bit (256 colors) |
| Dithering | 70-80% (balance quality vs size) |
| Optimization | Lossy GIF compression (gifsicle) |
| Interlace | No |

### File Size Optimization

```bash
# Using gifsicle for optimization
gifsicle -O3 --colors 256 --lossy=80 input.gif -o output.gif

# Target sizes:
# - 1280x720 @ 15fps, 8s = ~3-4MB
# - 1280x720 @ 20fps, 10s = ~4-5MB
```

---

## Capture Methods

### Method 1: Browser Recording (Recommended)

1. Open gameplay in browser at 1280x720
2. Use browser DevTools Performance panel to record
3. Export frames as PNG sequence
4. Compile with FFmpeg or GIF tool

```bash
# FFmpeg command
ffmpeg -framerate 30 -i frame_%04d.png -vf "fps=15,scale=1280:720" output.gif
```

### Method 2: Screen Recording

1. Record gameplay with OBS or similar at 60fps
2. Trim to 8-10 seconds
3. Convert to GIF with color optimization

```bash
# FFmpeg with palette optimization
ffmpeg -i input.mp4 -vf "fps=15,scale=1280:720,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```

### Method 3: HTML/CSS Animation

1. Create CSS animation in `assets/templates/`
2. Use Puppeteer or similar to capture frames
3. Compile to GIF

---

## Visual Style Guidelines

### Do's

- ✅ Use exact game colors (#FF6600, #FFCC66, #0D0D0D)
- ✅ Show actual gameplay mechanics (shooting, health bars, HUD)
- ✅ Include particle effects (orange projectiles, impact sparks)
- ✅ Show multiple characters for multiplayer feel
- ✅ Keep dark atmospheric tone throughout

### Don'ts

- ❌ Bright colors or daytime scenes
- ❌ Cartoon or anime style
- ❌ Static screenshots (must show motion)
- ❌ Text overlays beyond game UI
- ❌ Photorealistic capybaras (stylized 3D only)

---

## Example FFmpeg Pipeline

```bash
# Full pipeline: Video → Optimized GIF
ffmpeg -i recording.mp4 \
  -vf "crop=1280:720:(iw-1280)/2:(ih-720)/2,fps=15,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=diff[p];[s1][p]paletteuse=dither=floyd_steinberg" \
  -loop 0 \
  output.gif

# Optimize further with gifsicle
gifsicle -O3 --lossy=80 output.gif -o final.gif
```

---

## Checklist

- [ ] Duration is 8-10 seconds
- [ ] Seamless loop (last frame matches first)
- [ ] Resolution is 1280x720
- [ ] File size under 5MB
- [ ] All game colors match style guide
- [ ] Shows actual gameplay mechanics
- [ ] Dark atmospheric tone maintained
- [ ] No text beyond game UI
- [ ] Particle effects visible (projectiles, impacts)
- [ ] Multiple characters shown (if multiplayer)
