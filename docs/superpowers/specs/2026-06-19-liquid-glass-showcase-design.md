---
name: liquid-glass-showcase
description: Дизайн-спека для примера LiquidGlassContainer в ics-ui-kit-examples
metadata:
  type: project
---

# LiquidGlassContainer Showcase — Design Spec

## Goal

Add a `LiquidGlassContainer` example to `ics-ui-kit-examples` that showcases the liquid glass effect across several common UI patterns.

## File Structure

```
src/examples/LiquidGlassContainer/
├── LiquidGlassContainer.tsx   ← main component registered in the examples system
├── attributes.json            ← title, category, canvas height
└── Background.tsx             ← reusable scrollable background with cards behind glass
```

`LiquidGlassContainer` must be added to `src/examples/index.ts` so `PageComponentCanvas` can resolve it by name.

## Background Component (`Background.tsx`)

- Fixed-size container (e.g. 400×300px) with `position: relative; overflow: hidden`
- CSS gradient background (purple → blue) — no external URLs, fully autonomous
- Scrollable layer of cards positioned absolutely behind the glass overlay
- Accepts `children` which are rendered on top (glass overlays)

## Showcase Sections

The main `LiquidGlassContainer.tsx` renders a vertical list of labeled sections. Each section has its own `Background` instance — sections do not share a single scroll container.

| # | Name | Description |
|---|------|-------------|
| 1 | **Top bar** | `LiquidGlassContainer` pinned to the top of Background, full width, ~54px tall |
| 2 | **Bottom tab bar** | Pinned to the bottom with 3–4 icon-label tabs |
| 3 | **Floating card** | Centered card with title + body text |
| 4 | **Tooltip** | Small glass tooltip positioned above a button |
| 5 | **Popover** | Medium glass panel with a list of items and an action button |
| 6 | **Sidebar** | Left-side vertical panel ~80px wide with icon placeholders |
| 7 | **Custom intensity** | Three cards side-by-side with low / default / high `blur`+`scale`+`saturate` |

Each section has a visible text label above it (e.g. `<h3>Top bar</h3>`).

## attributes.json

```json
{
  "title": "Liquid Glass Container",
  "category": "effects",
  "canvas": {
    "height": 2800
  }
}
```

Height is set large enough to display all 7 sections without scrolling in the iframe.

## Constraints

- No external image URLs — gradient background only
- `LiquidGlassContainer` is imported from `ics-ui-kit/components/liquid-glass-container` (the package, not a local path)
- No new dependencies introduced
- Component name in the folder must match exactly `LiquidGlassContainer` (PascalCase) to match the existing system convention
