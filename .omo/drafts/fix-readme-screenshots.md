# fix-readme-screenshots

## Decision Log
- **Status:** awaiting-approval
- **Intent:** CLEAR
- **review_required:** false

## Key Facts (from exploration)
- 6 HTML templates in `assets/templates/` are outdated (old monospace/flat-orange visual style)
- 6 PNG screenshots generated from them are therefore outdated
- README references the6 PNGs — paths are correct, no README changes needed
- Game source of truth: `index.html` (menu, gameplay, achievements, multiplayer) + `shop.css` (shop)
- Templates to update: menu.html, gameplay.html, shop.html, achievements.html, multiplayer.html, banner.html
- Game uses: Segoe UI/system fonts, gradient text, gradient backgrounds, glassmorphism panels, rounded pill buttons, card-based layouts, purple+orange scheme

## Components
| id | component | outcome | status |
|---|---|---|---|
| C1 | Menu template + PNG | Modern menu design matching index.html | open |
| C2 | Gameplay template + PNG | Updated HUD with modern fonts | open |
| C3 | Shop template + PNG | Card-based layout matching shop.css | open |
| C4 | Achievements template + PNG | Gradient panel with modern style | open |
| C5 | Multiplayer template + PNG | Composition showing lobby + combat | open (user decision) |
| C6 | Banner template + PNG | Gradient text styling | open |

## User Decisions
- Multiplayer screenshot: composition showing both lobby AND combat scene

## Pending Action
- Write `.omo/plans/fix-readme-screenshots.md` (awaiting user approval)
