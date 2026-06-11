# Cycle 2: Dark Mode

**Created:** 2026-06-11
**Focus:** A real, opt-in dark mode for the q-nuxt-layer design system — semantic CSS-variable tokens that flip under `.dark`, plus a persisted runtime toggle — without breaking existing light-mode consumers.

## Why

The layer already sets `darkMode: 'class'` in `tailwind.config.js`, but the foundation is unusable: nothing toggles the `.dark` class, there are zero CSS variables, and all 134 components reference hardcoded hex scales (grape/grey/leaf). `composables/useThemeMode.ts` is a provide/inject resolver that never touches the DOM or storage. The layer is a published package (`@qpoint-io/q-nuxt-layer@0.6.0`) consumed by qdash-ui and sister projects, so dark mode has to land once, centrally, and be strictly **non-breaking** — existing scales keep working and the default stays **light** unless a stored/system preference says otherwise.

## Objective

A semantic, CSS-variable-backed theming foundation that flips under `.dark`, a reusable `<ThemeToggle>` component, and persisted light/dark selection (SSR-safe). "Done" for this cycle = the token system + toggle + persistence are wired in the layer, proven end-to-end on a small exemplar set of surface primitives (Modal, Message, table-list, nav, Button), and verified via qdash-ui with `NUXT_LOCAL_LAYER=1`. `tokens.json` stays byte-stable (no Figma drift). Converting the remaining ~120 components and theming qdash-ui are explicit follow-up cycles.

## Scope

- `cycles/c2.dark-mode/` — this cycle's CYCLE.md + plan.md
- `tokens/semantic.mjs` — semantic role → `{ light, dark }` hex source (new)
- `tokens/build.mjs` — also emit `assets/css/tokens.css` (modify; `tokens.json` unchanged)
- `assets/css/tokens.css` — generated `:root` + `.dark` CSS variables (new, generated)
- `tailwind.config.js` — CSS-var-backed semantic color utilities (modify)
- `assets/css/shared.css` — `@import './tokens.css'` + base/utility conversion (modify)
- `composables/useThemeMode.ts` — add `useColorScheme` (set/toggle/init) (modify)
- `plugins/theme.client.ts` + `nuxt.config.ts` — SSR-safe boot init (new + modify)
- `components/icon/Sun.vue`, `components/icon/Moon.vue`, `components/ux/ThemeToggle.vue` (new)
- Exemplar conversions: `components/ux/{Modal,Message,Button}.vue`, `components/ux/table-list/index.vue`, `components/nav/{Vertical,VerticalItem}.vue`

## Key Changes

- **Phase 0 (done):** Cycle created; `plan.md` records the full Phase 1–7 implementation plan, verification, critical files, and risks.
- **Phases 1–7 (pending):** semantic token source → CSS-var emit from the build → Tailwind wiring → SSR-safe toggle/persist composable + client plugin → `<ThemeToggle>` component → scoped foundation conversion → verification through qdash-ui.

## Outcome

_(filled in at completion)_
