# @qpoint-io/q-nuxt-layer

Qpoint design system — shared components, tokens, and CSS distributed as a Nuxt Layer.

## What's Included

**Components** (`components/ux/`) — UxButton, UxInput, UxModal, UxToggle, UxTag, UxCopyBtn, UxClose, UxCheckbox, UxMessage, UxIcon

**Icons** (`components/icon/`) — 25 SVG icons auto-imported with the `Icon` prefix (IconCheck, IconPlus, IconSearch, IconLogo, etc.). Consumer projects can override any icon locally.

**Composables** (`composables/`) — useClipboard

**Design Tokens** (`tailwind.config.js`) — Colors (Grape, Leaf, Grey, semantic), typography (Inter, Geist Mono), spacing, border radius, breakpoints

**Shared CSS** (`assets/css/shared.css`) — Tailwind directives, base styles, utility classes (btn-cancel, btn-danger, hairline, abs-center), Vue transitions

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@qpoint-io/q-nuxt-layer'],
})
```

That's it. Components, composables, tokens, and CSS are auto-imported.

## How It Works

This is a [Nuxt Layer](https://nuxt.com/docs/guide/going-further/layers). When a project extends it:

- Components from `components/` are auto-imported (UxButton, IconSpinner, etc.)
- Composables from `composables/` are auto-imported (useClipboard)
- Tailwind config is deep-merged — consumers can add project-specific tokens
- Shared CSS is loaded automatically

**Local components always win.** If a consumer defines `UxButton` locally, it overrides the layer's version. The layer is additive, not a hard dependency.

## Peer Dependencies

- `nuxt` ^4.0.0 (required)
- `@headlessui/vue` ^1.7.0 (optional — needed only if using UxModal)
