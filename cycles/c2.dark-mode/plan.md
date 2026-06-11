# Dark Mode — Implementation Plan (Cycle c2)

> Phase 0 (this cycle's scaffold) is complete. Phases 1–7 below are the pending
> implementation, to be executed in the q-nuxt-layer context.

## Context

`q-nuxt-layer` is the shared, published Nuxt 4 design layer (`@qpoint-io/q-nuxt-layer@0.6.0`) that `qdash-ui` and sister projects extend. We want a real dark mode. Today the foundation is half-laid but unusable:

- `tailwind.config.js` has `darkMode: 'class'` set, but **nothing toggles `.dark`**, there are **zero CSS variables**, and all 134 components use **hardcoded** hex scales (grape/grey/leaf).
- `composables/useThemeMode.ts` is a provide/inject resolver that never touches the DOM or storage.
- `tokens/build.mjs` generates `tokens/tokens.json` (DTCG, for Figma Tokens Studio) from the config and must keep doing so without drift.

**Chosen approach (locked):** semantic CSS-variable tokens that flip under `.dark`. **Scope (locked):** foundation + a reusable toggle + persistence — *not* a sweep of all 134 components or full qdash-ui theming (those are follow-up cycles).

**Hard constraints:** every change must be **non-breaking and opt-in** — existing `grape/grey/leaf` scales and flat `error/warning/success/info` keep working; default appearance stays **light** unless a stored/system preference says dark; **SSR-safe** (sister projects may SSR). `tokens.json` must remain byte-stable.

---

## Phase 1 — Semantic token source

**Create `tokens/semantic.mjs`** — single source of `{ role: { light, dark } }` hex, all drawn from the existing palette (13 roles):

| CSS var (`--qp-…`) | Tailwind key | Light | Dark |
|---|---|---|---|
| surface | `surface` | `#FFFFFF` | `#111111` (grey-900) |
| surface-sunken | `surface-sunken` | `#F5F5F5` (grey-100) | `#1A1919` |
| content | `content` | `#2B2A2A` (grey-800) | `#F5F5F5` (grey-100) |
| content-muted | `content-muted` | `#565454` (grey-600) | `#AAAAAA` (grey-350) |
| content-subtle | `content-subtle` | `#7A7B7C` (grey-500) | `#7A7B7C` |
| stroke | `stroke` | `#E8E8E8` (grey-200) | `#393939` (grey-700) |
| stroke-strong | `stroke-strong` | `#D4D4D4` (grey-300) | `#565454` (grey-600) |
| primary | `primary` | `#895AE8` (grape-500) | `#AB86F6` (grape-400) |
| on-primary | `on-primary` | `#FFFFFF` | `#FFFFFF` |
| success | `signal-success` | `#34BC6D` (leaf-500) | `#58E392` (leaf-300) |
| error | `signal-error` | `#EF4444` | `#F87F7D` (warn) |
| warning | `signal-warning` | `#F59E0B` | `#F59E0B` |
| info | `signal-info` | `#7742E2` (grape-600) | `#BBA5FF` (grape-300) |

Naming note: use `stroke`/`stroke-strong` (not `border`) to avoid colliding with Tailwind's `border` width utility; signal roles are namespaced `signal-*` so the existing flat `error/warning/success/info` keys are untouched.

Surface note: only two surface tiers — `surface` and `surface-sunken` (the latter is real today: `bg-grey-100` table headers/insets). No `surface-raised`/`surface-overlay`: the design language is flat and hairline-driven, not elevation-tiered; raised panels (Modal, Message) differentiate in dark via `border-stroke` instead of a lighter background. Adding a raised tier later is non-breaking if dark modals prove too flat in practice.

---

## Phase 2 — Emit `tokens.css` from the build (keep `tokens.json` stable)

**Modify `tokens/build.mjs`** — after the existing `tokens.json` write (`build.mjs:84`), without touching the `color`/`tokens` object:

- `import { semantic } from './semantic.mjs'`.
- Add a `hexToChannels('#RRGGBB') → "R G B"` helper (supports 3- and 6-digit hex).
- Emit `assets/css/tokens.css` with a do-not-edit banner, a `:root { --qp-<role>: R G B; … }` block (light) and a `.dark { … }` block (dark).
- Extend the closing `console.log` to report the tokens.css role count.

`tokens.json` stays byte-identical because `colorGroup()` only reads the enumerated groups and skips non-string values; `semantic.mjs` feeds **only** the CSS emit. (Follow-up, not this cycle: optionally carry the semantic set into `tokens.json` via DTCG `$extensions` for Figma.)

---

## Phase 3 — Wire Tailwind to the vars (opt-in)

**Modify `tailwind.config.js`** — add to `theme.extend.colors` alongside the existing scales (nothing removed):

```js
// Semantic theme tokens — backed by CSS vars (assets/css/tokens.css), flip under `.dark`.
surface:           'rgb(var(--qp-surface) / <alpha-value>)',
'surface-sunken':  'rgb(var(--qp-surface-sunken) / <alpha-value>)',
content:           'rgb(var(--qp-content) / <alpha-value>)',
'content-muted':   'rgb(var(--qp-content-muted) / <alpha-value>)',
'content-subtle':  'rgb(var(--qp-content-subtle) / <alpha-value>)',
stroke:            'rgb(var(--qp-stroke) / <alpha-value>)',
'stroke-strong':   'rgb(var(--qp-stroke-strong) / <alpha-value>)',
primary:           'rgb(var(--qp-primary) / <alpha-value>)',
'on-primary':      'rgb(var(--qp-on-primary) / <alpha-value>)',
'signal-success':  'rgb(var(--qp-success) / <alpha-value>)',
'signal-error':    'rgb(var(--qp-error) / <alpha-value>)',
'signal-warning':  'rgb(var(--qp-warning) / <alpha-value>)',
'signal-info':     'rgb(var(--qp-info) / <alpha-value>)',
```

Space-separated RGB channels + `rgb(var(…) / <alpha-value>)` is the only Tailwind-v3 form that keeps opacity utilities (`bg-surface/50`) working. These keys aren't in any enumerated group, so `build.mjs`/`tokens.json` are unaffected.

**Modify `assets/css/shared.css`** — add `@import './tokens.css';` as the **first line** (before `@tailwind base`). With no `.dark` class present, `:root` light values apply → default stays light even before any JS runs.

---

## Phase 4 — Runtime toggle + persistence (SSR-safe)

**Modify `composables/useThemeMode.ts`** — keep `provideThemeMode` / `useThemeMode(propMode)` exactly as-is (subtree API intact); add a module-global singleton + controls:

- `setColorScheme(mode)` — set ref, `document.documentElement.classList.toggle('dark', …)`, persist to `localStorage['qp-theme']` (try/catch).
- `toggleColorScheme()` — flip.
- `initColorScheme()` — read stored value, else `prefers-color-scheme`, else **light**; apply.
- `useColorScheme()` — returns `{ colorScheme, setColorScheme, toggleColorScheme, initColorScheme }`.
- Guard every `document`/`window`/`localStorage` access with `typeof … === 'undefined'`.

**Create `plugins/theme.client.ts`** — `defineNuxtPlugin(() => initColorScheme())`. `.client` suffix → never runs on the server.

**Modify `nuxt.config.ts`** — register the plugin explicitly via the existing resolved-path pattern (don't rely on implicit layer scan):
```ts
plugins: [ join(currentDir, 'plugins/theme.client.ts') ],
```

---

## Phase 5 — Reusable ThemeToggle

- **Create `components/icon/Sun.vue` and `components/icon/Moon.vue`** — plain `<svg … fill="currentColor" aria-hidden="true">` matching the existing convention (`components/icon/ArrowHead.vue`); auto-import as `IconSun` / `IconMoon`. (No sun/moon exists in `assets/icons/` today.)
- **Create `components/ux/ThemeToggle.vue`** — a `<button>` calling `useColorScheme().toggleColorScheme`, showing `IconMoon` when dark else `IconSun`, with an `aria-label`. Styled with the new tokens (`text-content-muted hover:text-content hover:bg-surface-sunken`), echoing `components/ux/IconBtn.vue`'s interaction vocabulary — dogfooding the system.

---

## Phase 6 — Foundation conversion (scoped reference set only)

Mechanical pattern (define once): `bg-white`/`bg-grey-50` → `bg-surface`, `bg-grey-100` inset/table-header → `bg-surface-sunken` · `text-black`/`text-grey-800/900` → `text-content`, `text-grey-600/500` → `text-content-muted`/`-subtle` · `border-grey-200/300`/`border-tableBorder` → `border-stroke`(`-strong`) · accent `text-grape` that should shift in dark → `text-primary` (leave true brand chrome/logos as raw `grape-*`) · signal colors → `signal-*` · elevated panels (modals, toasts) get `border-stroke` so they read against a dark page where shadows don't.

Apply to the minimal exemplar set that proves the system end-to-end:

- **`assets/css/shared.css`** — body/page bg+text; fold the existing hardcoded `.dark input/select` block (~lines 48–61) into token-driven rules; convert `._shadow-box`, `.hairline`, and `.btn-*`.
- **`components/ux/Modal.vue`** — panel default `bg-white` → `bg-surface` (the `bg` prop); add `border border-stroke` to the panel — it has no border today and `shadow-xl` alone won't separate it from a dark page.
- **`components/ux/Message.vue`** — `bg-white` → `bg-surface`, existing `border-grape-300` → `border-stroke`.
- **`components/ux/table-list/index.vue`** — row/header/border colors → `surface`/`surface-sunken`/`stroke`.
- **`components/nav/Vertical.vue` + `components/nav/VerticalItem.vue`** — text/hover/active/border → `content`/`primary`/`stroke`.
- **`components/ux/Button.vue`** — the `stroke` kind → `bg-surface`/`text-content`/`border-primary`; filled kind stays brand grape (intentional).

**Out of scope (documented follow-up):** the remaining ~120 components and full qdash-ui theming. They keep rendering identically in light mode because raw scales are untouched; they simply won't flip until a later cycle.

---

## Verification

The layer isn't independently runnable, so verify through `qdash-ui` with the local layer:

1. **Token build:** from `q-nuxt-layer`, `npm run tokens` → `git diff` shows **only** `assets/css/tokens.css` new/changed (and `tokens/semantic.mjs`); `tokens.json` is byte-identical; `tokens.css` has 13 `:root` + 13 `.dark` channel vars.
2. **Temporary harness in qdash-ui:** in `crates/qdash/ui/app/layouts/default.vue`, change line 2 to `bg-surface text-content …` and drop `<UxThemeToggle />` into the shell beside `<AppSidebar />`.
3. **Run:** `NUXT_LOCAL_LAYER=1 nuxt dev` (port 3030). Confirm: default load is **light**; clicking the toggle adds `<html class="dark">` and flips page bg/text + the six converted exemplars (Modal, Message, table-list, nav, Button-stroke); **reload persists** the choice (`localStorage qp-theme`); OS-dark with no stored value loads dark, while stored `light` overrides OS.
4. **Non-breaking check:** an untouched `ux/*` component renders identically in light mode.
5. **In-layer preview (optional):** exercise converted components via `components/dev/meta/PropsMachine.vue`, toggling `.dark` on a wrapping element.

*(The qdash-ui layout edit in step 2 is verification scaffolding; permanent qdash-ui theming is a separate cycle.)*

---

## Critical files

| Action | Path |
|---|---|
| create | `tokens/semantic.mjs` |
| modify | `tokens/build.mjs` (emit `tokens.css`; `tokens.json` unchanged) |
| modify | `tailwind.config.js` (CSS-var-backed semantic colors) |
| create | `assets/css/tokens.css` (generated) |
| modify | `assets/css/shared.css` (`@import` + base/utility conversion) |
| modify | `composables/useThemeMode.ts` (add `useColorScheme` API) |
| create | `plugins/theme.client.ts` |
| modify | `nuxt.config.ts` (register plugin) |
| create | `components/icon/Sun.vue`, `components/icon/Moon.vue`, `components/ux/ThemeToggle.vue` |
| modify | exemplar components: `ux/Modal.vue`, `ux/Message.vue`, `ux/table-list/index.vue`, `nav/Vertical.vue`, `nav/VerticalItem.vue`, `ux/Button.vue` |

## Risks / gotchas

- **Layer plugin registration** — registered explicitly via resolved path so it fires for both `NUXT_LOCAL_LAYER` and published-package consumers.
- **Alpha-value** — only space-separated channels + `rgb(var(…) / <alpha-value>)` keeps `/opacity` working.
- **Non-breaking** — no color key removed; signal roles namespaced `signal-*`; default `:root` is light.
- **SSR** — all DOM/storage access guarded; plugin is `.client`.
- **FOUC** — under `ssr:false` a dark-preferring user sees a brief light flash; documented follow-up (inline pre-hydration head script) if it's ever a complaint.
- **Dark elevation** — deliberately no raised/overlay surface tiers; panels separate via `border-stroke`. If dark modals read too flat in real use, add `surface-raised` then (additive, non-breaking).
