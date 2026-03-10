---
name: design-tokens
description: Qpoint design token reference — colors, typography, spacing, border-radius, breakpoints. Canonical source is tailwind.config.js.
---

# Qpoint Design Tokens

All tokens are defined in `tailwind.config.js`. Typography (fontSize, fontWeight, fontFamily) **replaces** Tailwind defaults. Everything else uses `extend` and merges with defaults.

---

## Colors

### Grape (primary/interactive) — 12-step scale

| Step | Hex | Usage |
|------|-----|-------|
| `grape-50` | #F9F7FF | Lightest bg, subtle highlights |
| `grape-100` | #EFEBFC | Light bg, selected row bg |
| `grape-150` | #E5DAFF | Light accent bg |
| `grape-200` | #D7CAFE | Tag bg, info semantic color |
| `grape-300` | #BBA5FF | Border accents, decorative |
| `grape-400` | #AB86F6 | Primary buttons, active states |
| `grape-500` | #895AE8 | Brand default (DEFAULT) |
| `grape-600` | #7742E2 | Hover states on primary |
| `grape-700` | #5E29CC | Dark accents |
| `grape-800` | #45199E | Very dark accent |
| `grape-850` | #32146E | Near-black grape |
| `grape-900` | #270B5E | Darkest grape |

### Leaf (success/positive) — 4-step scale

| Step | Hex | Usage |
|------|-----|-------|
| `leaf-300` | #58E392 | DEFAULT — success signals |
| `leaf-400` | #49CF81 | Hover on success |
| `leaf-500` | #34BC6D | Active success |
| `leaf-600` | #1B974F | Dark success |

### Grey (neutral) — 13-step scale

| Step | Hex | Usage |
|------|-----|-------|
| `grey-50` | #FAFAFA | Page bg, code block bg |
| `grey-100` | #F5F5F5 | Card bg, alternate row bg |
| `grey-150` | #F0F0F0 | Subtle separator |
| `grey-200` | #E8E8E8 | Borders, dividers |
| `grey-300` | #D4D4D4 | Hairlines, disabled borders |
| `grey-350` | #AAAAAA | Intermediate neutral |
| `grey-400` | #949494 | Labels, secondary text (DEFAULT) |
| `grey-500` | #7A7B7C | Body text secondary |
| `grey-600` | #565454 | Body text |
| `grey-700` | #393939 | Emphasis text |
| `grey-800` | #2B2A2A | Near-black text |
| `grey-900` | #111111 | Headings, primary text |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | #EF4444 | Error states, destructive |
| `warning` | #F59E0B | Caution states |
| `success` | #58E392 | Same as leaf-300 |
| `info` | #D7CAFE | Same as grape-200 |
| `warn` | #F87F7D | Danger buttons, alerts |

### Utility / Legacy

| Token | Hex | Usage |
|-------|-----|-------|
| `mint` | #21EBD0 | Accent highlights |
| `orchid` | #AE73C2 | Secondary accent |
| `blue` | #2FAEFD | Information, links |
| `soot` | #494B4D | Dark neutral |

---

## Typography

### Font Families

| Token | Fonts | Usage |
|-------|-------|-------|
| `font-sans` | Inter | Body text, UI |
| `font-mono` | Geist Mono, IBM Plex Mono, Consolas | Code, values |
| `font-dev` | rigid-square | Display, dev headers |

### Font Sizes (replaces Tailwind defaults)

| Class | Size | Line-height | Role |
|-------|------|-------------|------|
| `text-68` | 68px | 70px | |
| `text-64` | 64px | 66px | |
| `text-58` | 58px | 66px | |
| `text-56` | 56px | 62px | Display |
| `text-48` | 48px | 46px | |
| `text-44` | 44px | 50px | |
| `text-40` | 40px | 44px | H1 |
| `text-38` | 38px | 46px | |
| `text-36` | 36px | 38px | |
| `text-35` | 35px | 45px | |
| `text-32` | 32px | 38px | |
| `text-30` | 30px | 48px | |
| `text-28` | 28px | 36px | H2 |
| `text-26` | 26px | 33px | |
| `text-25` | 25px | 32px | |
| `text-24` | 24px | 32px | |
| `text-23` | 23px | 32px | |
| `text-22` | 22px | 30px | |
| `text-21` | 21px | 28px | |
| `text-20` | 20px | 26px | H3 |
| `text-18` | 18px | 26px | Body Large |
| `text-16` | 16px | 22px | Body |
| `text-15` | 15px | 24px | |
| `text-14` | 14px | 26px | Body Small / Code |
| `text-13` | 13px | 24px | |
| `text-12` | 12px | 24px | Label |
| `text-11` | 11px | 18px | |

**Important:** Default Tailwind sizes (`text-sm`, `text-base`, `text-lg`, etc.) are NOT available. Always use the numeric scale.

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-reg` | 400 | Body text |
| `font-med` | 500 | Labels, secondary emphasis |
| `font-semi` | 600 | Subheadings, strong labels |
| `font-bold` | 700 | Headings |
| `font-exbold` | 800 | Display emphasis |
| `font-black` | 900 | Maximum emphasis |

**Important:** Default Tailwind weights (`font-normal`, `font-medium`, `font-semibold`) are NOT available. Always use the custom names.

### Common Typography Combos

| Pattern | Classes |
|---------|---------|
| Labels | `text-14 font-med text-grey-400` |
| Body emphasis | `text-16 font-semi` |
| Headings | `text-24 font-bold` |
| Page titles | `text-56 font-bold text-grey-900` |
| Section headings | `text-28 font-semi text-grey-900` |
| Code | `text-14 font-mono` |

---

## Spacing

Custom named tokens in `extend.spacing` (standard Tailwind 0-96 also available):

| Token | Value | Usage |
|-------|-------|-------|
| `px8` | 0.5rem (8px) | Tight gaps, small padding |
| `px16` | 1rem (16px) | Standard gap, padding |
| `px24` | 1.5rem (24px) | Section padding, form gaps |
| `px32` | 2rem (32px) | Large section spacing |
| `px40` | 2.5rem (40px) | Page margins |
| `px48` | 3rem (48px) | Major section breaks |
| `px64` | 4rem (64px) | Hero/top-level spacing |

Usage: `p-px16`, `gap-px8`, `mb-px24`, `mt-px32`

---

## Border Radius

Custom scale in `extend.borderRadius`:

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-1` | 1px | |
| `rounded-2` | 2px | |
| `rounded-3` | 3px | |
| `rounded-4` | 4px | Subtle rounding |
| `rounded-5` | 5px | |
| `rounded-6` | 6px | |
| `rounded-8` | 8px | Cards, panels |
| `rounded-10` | 10px | |
| `rounded-12` | 12px | Shadow boxes |
| `rounded-14` | 14px | |
| `rounded-16` | 16px | |
| `rounded-18` | 18px | |
| `rounded-24` | 24px | |
| `rounded-32` | 32px | |

`rounded-full` also available for pills and avatars.

---

## Border Width

Replaces defaults:

`border-0`, `border` (1px), `border-2`, `border-3`, `border-4`, `border-5`, `border-6`, `border-8`

---

## Breakpoints

Custom screens in `extend.screens`:

| Token | Width | Usage |
|-------|-------|-------|
| `big` | 850px | Desktop layout shifts |
| `xs` | 480px | Small mobile |
| `xxs` | 420px | Extra small mobile |
| `xxxs` | 380px | Minimum supported |

Standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) are also available.

---

## Animation

| Class | Description |
|-------|-------------|
| `animate-fade-in-60` | Fade from 0% to 60% opacity over 1s |
| `ease-in-out-quint` | Cubic bezier (0.83, 0, 0.17, 1) — smooth easing |

### Tailwind Plugin: animation-delay

Available via `tailwindcss-animation-delay` plugin. Provides `animation-delay-*` utilities.
