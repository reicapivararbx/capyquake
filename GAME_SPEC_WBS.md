# Capiquake - Game Specification Work Breakdown Structure (WBS)

## Overview
This document breaks down the game specification into actionable tasks organized by subsystem, with dependencies, priorities, and milestones.

---

## 1. Major Subsystems Identified

| Subsystem | Description | Priority |
|-----------|-------------|----------|
| **Core Economy** | Money/Token exchange, animal rewards, rare drops | P0 - Critical |
| **Armor System** | 5 armor types, equip logic, Void invincibility | P0 - Critical |
| **Extra HP Purchase** | Pre-round HP boost (money or tokens) | P1 - High |
| **Shop & Inventory** | 9 categories, 15% price increase, tooltips | P1 - High |
| **Input System** | Key bindings, customization, conflict detection | P1 - High |
| **Camera & Crosshair** | F3 toggle, weapon crosshair | P1 - High |
| **Fart Ability** | Green cloud, damage, fear, cooldown | P2 - Medium |
| **Bot AI** | 5 bots including Carioca, behaviors, explosions | P0 - Critical |
| **Animation System** | 7 states for players/bots/animals | P2 - Medium |
| **Revive System** | Death screen, revive shop, limits | P1 - High |
| **Wave System** | 1-1000 waves, mini-boss/boss rules | P0 - Critical |
| **Animals & Enemies** | New animals, dragon, allies, BBQ death | P0 - Critical |
| **Map System** | 15 new maps, barriers, collisions, spawns | P1 - High |
| **Drop System** | Sky drops, E interaction, messages | P1 - High |
| **Hotbar/Inventory** | Icons, auto-sort, capacity limits | P1 - High |
| **Weapons** | 6 specific weapons + ammo types | P0 - Critical |
| **Customization** | 59+ name colors, 100 player skins, weapon skins | P3 - Low |
| **Level/XP System** | Levels 1-100, XP sources | P2 - Medium |
| **Achievements** | 240 achievements across 8 rarities | P3 - Low |
| **Rebirth System** | Requirements, resets, RT, buffs | P2 - Medium |
| **WebSocket Chat** | Real-time, reconnection, anti-spam | P2 - Medium |
| **Tutorial** | 10 steps, skip, replay option | P2 - Medium |
| **Pause System** | Single-player only, full freeze | P3 - Low |
| **Test Mode** | Training field, admin panel, infinite HP/ammo | P3 - Low |

---

## 2. Urgent Priority Fixes (Do First)

| # | Task | Specification Reference |
|---|------|------------------------|
| 1 | Make capybaras invulnerable/untargetable | §12 |
| 2 | Improve all animal models | §12, §25 |
| 3 | Improve all weapon models | §16, §25 |
| 4 | Fix token exchange: 1 token per click, $1000 check | §1, §25 |
| 5 | Fix player speed to 15 | §25 |
| 6 | Fix boss speed to 10 | §11, §25 |
| 7 | Prevent boss spawning near players | §11, §25 |

---

## 3. Missing Details & Open Questions

### Critical (Block Implementation)

| Area | Missing Detail |
|------|----------------|
| Token drop rate | Exact % chance for animal token drops (§1) |
| Diamond armor speed boost | Exact multiplier/value (§2) |
| Void armor invincibility | Visual indicator? Sound? Particle? (§2) |
| Revive price & max limit | Cost per revive, max purchases per round (§10) |
| Boss safe spawn distance | Exact radius from players (§11) |
| Fart ability radius | Area of effect size (§7) |
| Bot explosion damage/range | Values for death explosion (§8) |
| Animal spawn distance | "Safe distance" from players (§12) |
| BBQ animation duration | Time before grill disappears (§12) |
| Map names/themes/sizes | 15 maps need definition (§13) |
| Hotbar slot count | Number of slots (§15) |
| Fire staff damage/price | Values needed (§16) |
| Dragon spawn chance/interval | Random spawn parameters (§12) |
| XP per level | Leveling curve for 1-100 (§18) |
| Rebirth token exchange | Can tokens → RT? Or just valuation? (§20) |
| Rebirth buff stacking | Do buffs compound per rebirth? (§20) |

### Important (Need Decisions)

| Area | Question |
|------|----------|
| Shop items | Complete item list with prices for all 9 categories (§4) |
| Weapon categories | Which weapons are permanent vs temporary? (§4, §16) |
| Sniper ammo | Ammo type, capacity, pickup mechanics (§16) |
| Achievement list | 240 specific achievements with objectives (§19) |
| Extra color names | 50 additional color definitions (§17) |
| 100 skin designs | Art assets needed (§17) |
| Weapon skin pricing | Money-only prices (§17) |
| Wave enemy counts | Scaling formula per wave (§11) |
| Mini-boss/boss stats | HP, damage, abilities per wave tier (§11) |
| Chat anti-spam interval | Exact cooldown between messages (§21) |
| Tutorial replay | Where in settings? (§22) |

---

## 4. Dependency Graph

```
Foundation (Week 1-2)
├── Core Economy Fixes (Urgent #1,4)
├── Player/Bot Movement & Speed (Urgent #5,6)
├── Input System Foundation
├── Basic Animation State Machine
└── Map Loading Framework

Vertical Slice (Week 3-5)
├── Armor System (equip, bonuses, Void ability)
├── Wave System (1-1000, spawn logic, boss rules)
├── Animal AI (spawn, attack, flee, BBQ death)
├── Bot AI (5 bots, behaviors, explosions)
├── Basic Shop UI (categories, tooltips)
├── Weapon Framework (base class, ammo, cooldowns)
└── Camera/Crosshair Toggle

Production (Week 6-10)
├── All 6 Weapons Implementation
├── Extra HP Purchase System
├── Revive System (death screen, shop, limits)
├── Hotbar/Inventory (icons, auto-sort, limits)
├── Drop System (sky drops, E interaction, messages)
├── Fart Ability
├── Level/XP System
├── Rebirth System
├── Map System (15 maps, barriers, collisions)
├── WebSocket Chat
└── Tutorial Flow

Polish & Content (Week 11-14)
├── Animal Model Improvements (all)
├── Weapon Model Improvements (all)
├── 59+ Name Colors
├── 100 Player Skins
├── Weapon Skins
├── 240 Achievements
├── Test Mode & Admin Panel
├── Pause System
├── Key Binding Customization
└── Settings Menu (gear icon, exit button)

Launch Ready (Week 15+)
├── Bug Fixes & Balance
├── Performance Optimization
├── Localization Prep
└── Build Pipeline
```

---

## 5. Suggested Milestones

| Milestone | Target | Deliverables |
|-----------|--------|--------------|
| **M1: Foundation** | Week 2 | Working movement, input, economy fixes, basic animations |
| **M2: Core Gameplay Loop** | Week 5 | Waves 1-20 playable, armor, bots, animals, basic shop, 2 weapons |
| **M3: Feature Complete** | Week 10 | All weapons, revive, hotbar, drops, fart, XP, rebirth, chat, tutorial, all maps |
| **M4: Content Complete** | Week 14 | All models, skins, colors, achievements, test mode, pause, settings |
| **M5: Release Candidate** | Week 16 | Balanced, bug-free, optimized build |

---

## 6. Effort Estimation (Rough)

| Subsystem | Effort (dev-days) |
|-----------|-------------------|
| Core Economy Fixes | 3 |
| Armor System | 8 |
| Extra HP Purchase | 5 |
| Shop & Inventory UI | 15 |
| Input System | 8 |
| Camera/Crosshair | 3 |
| Fart Ability | 4 |
| Bot AI | 12 |
| Animation System | 10 |
| Revive System | 6 |
| Wave System | 8 |
| Animals & Enemies | 15 |
| Map System (15 maps) | 20 |
| Drop System | 5 |
| Hotbar/Inventory | 8 |
| Weapons (6) | 18 |
| Customization (colors/skins) | 12 |
| Level/XP | 5 |
| Achievements (240) | 10 |
| Rebirth System | 6 |
| WebSocket Chat | 6 |
| Tutorial | 5 |
| Pause System | 3 |
| Test Mode/Admin | 8 |
| **Total** | **~208 dev-days** |

---

## 7. Recommended Team Allocation

| Role | Focus Areas |
|------|-------------|
| **Engineer 1 (Lead)** | Architecture, Wave System, Bot AI, Rebirth |
| **Engineer 2** | Economy, Shop, Inventory, Weapons, Customization |
| **Engineer 3** | Animals, Maps, Animations, Drop System |
| **Engineer 4** | UI/UX: Shop, Revive, Hotbar, Tutorial, Settings, Chat |
| **Artist (2-3)** | 15 maps, animal/weapon models, 100 skins, icons, UI art |
| **Designer** | Balance, achievement design, wave scaling, playtesting |

---

## 8. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| 15 maps scope creep | High | Define themes/sizes upfront; time-box per map |
| 240 achievements content | Medium | Template-driven; batch creation |
| Bot AI complexity | High | Start simple; iterate behaviors incrementally |
| WebSocket reconnection | Medium | Use established library (socket.io); test network failures |
| Rebirth balance | High | Spreadsheet modeling before implementation |
| Animation state conflicts | Medium | Centralized state machine; comprehensive tests |

---

## 9. Next Immediate Actions

1. **Today**: Fix 7 urgent priority items (capybaras, models, token exchange, speeds, boss spawn)
2. **This Week**: Define all missing critical parameters (18 items in §3)
3. **This Week**: Create detailed item/weapon/achievement spreadsheets
4. **Week 1**: Set up project structure, CI, core systems
5. **Week 1**: Begin Foundation milestone tasks in parallel

---

## 10. Specification Gaps Summary

**Total missing parameters to define: ~35**
- 18 Critical (block implementation)
- 12 Important (need design decisions)
- 5 Content (art/asset lists)

**Recommendation**: Convene 2-hour design review to finalize all critical parameters before Week 1 sprint planning.