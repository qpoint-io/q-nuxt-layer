# @qpoint-io/q-nuxt-layer

Qpoint design system — shared components, tokens, and CSS distributed as a Nuxt Layer.

## What's Included

**Components** (`components/ux/`) — UxButton, UxInput, UxModal, UxToggle, UxTag, UxCopyBtn, UxClose, UxCheckbox, UxMessage, UxIcon

**Icons** (`components/icon/`) — 25 SVG icons auto-imported with the `Icon` prefix (IconCheck, IconPlus, IconSearch, IconLogo, etc.). Consumer projects can override any icon locally.

**Composables** (`composables/`) — useClipboard

**Design Tokens** (`tailwind.config.js`) — Colors (Grape, Leaf, Grey, semantic), typography (Inter, Geist Mono), spacing, border radius, breakpoints

**Shared CSS** (`assets/css/shared.css`) — Tailwind directives, base styles, utility classes (btn-cancel, btn-danger, hairline, abs-center), Vue transitions

## Installation

This package is published to **GitHub Packages** (private). Consumers need two things:

### 1. Registry config

Create `.npmrc` in the project root:

```
@qpoint-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Add the dependency

```bash
npm install @qpoint-io/q-nuxt-layer
```

### 3. Extend in nuxt.config.ts

```ts
export default defineNuxtConfig({
  extends: ['@qpoint-io/q-nuxt-layer'],
})
```

That's it. Components, composables, tokens, and CSS are auto-imported.

## Local Development (live reload)

To edit this layer and see changes live in a consumer project:

1. Clone this repo as a sibling directory (`../q-nuxt-layer`)
2. Add `NUXT_LOCAL_LAYER=1` to the consumer's `.env` (gitignored)
3. Use a conditional `extends` in the consumer's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    process.env.NUXT_LOCAL_LAYER
      ? '../q-nuxt-layer'
      : '@qpoint-io/q-nuxt-layer',
  ],
})
```

With `NUXT_LOCAL_LAYER=1`, Nuxt resolves the layer from the sibling directory and Vite watches it for hot reload. Without the env var, it pulls from the installed package in `node_modules`.

## Authentication

This is a private package. You need a `GITHUB_TOKEN` with `read:packages` scope.

**Locally** — create a GitHub [Personal Access Token (classic)](https://github.com/settings/tokens) with `read:packages` scope, then add to `~/.zshrc`:

```bash
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

**GitHub Actions** — `GITHUB_TOKEN` is available automatically. Use `actions/setup-node` with `registry-url`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    registry-url: https://npm.pkg.github.com
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Publishing

Publishing happens automatically when you push a version tag:

```bash
git tag v0.5.0
git push --tags
```

The GitHub Actions workflow (`.github/workflows/publish.yml`) runs `npm publish` to GitHub Packages.

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
