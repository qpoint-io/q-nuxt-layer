---
name: layer-standards
description: Qpoint Nuxt Layer conventions — naming, props, emits, slots, styling, file structure, publishing, and consumer integration.
---

# Qpoint Nuxt Layer Standards

## File Structure

### Component locations

| Directory | Prefix | Purpose |
|-----------|--------|---------|
| `components/ux/` | `Ux` | Shared UI components |
| `components/icon/` | `Icon` | SVG icons — `.vue` templates or `.ts` render functions (consumers can override) |
| `components/dev/` | `Dev` | Documentation/dev tools (DevCanvas, DevFrame, etc.) |
| `composables/` | — | Auto-imported composables |

### SFC order

1. `<template>` — always first
2. `<script setup>` — always second
3. `<style>` — rare, only when Tailwind alone isn't sufficient

## Naming

- **Files**: PascalCase — `Button.vue`, `SimpleSelect.vue`
- **Props**: camelCase in `<script setup>`, kebab-case in templates — `fullScreen` → `:full-screen="true"`
- **Events**: kebab-case — `update:modelValue`, `remove`, `change`
- **Directories**: lowercase — `ux/`, `dev/`, `icon/`
- **CSS scoped classes**: underscore prefix — `._toggle`, `._label`

### Auto-Import Prefixes

Nuxt auto-imports based on directory path. Nested dirs append:
- `components/ux/Button.vue` → `<UxButton>`
- `components/dev/Canvas.vue` → `<DevCanvas>`
- `components/dev/meta/PropsMachine.vue` → `<DevMetaPropsMachine>`
- `components/icon/Spinner.vue` → `<IconSpinner>`

**Important:** Underscore-prefixed directories (`_meta/`) may be ignored by Nuxt's scanner. Use non-prefixed names.

## Props

Always use object syntax with `type` and `default`:

```javascript
defineProps({
  disabled    : { type: Boolean, default: false },
  label       : { type: String, default: '' },
  kind        : { type: String, default: '' },
  size        : { type: Number, default: 28 },
  items       : { type: Array, default: () => [] },
  modelValue  : { type: [String, Array], default: '' },
})
```

Conventions:
- Every prop has `type` and `default` (exception: required props)
- Boolean props default to `false`
- String props default to `''` or `null`
- Array/Object props use factory functions: `default: () => []`
- Use `modelValue` for v-model binding
- Align colons for readability when 3+ props

## Emits

```javascript
const emit = defineEmits(['update:modelValue', 'remove', 'change'])
```

- Use `update:propName` for v-model bindings
- For native events (click on buttons), rely on native event bubbling

## Slots

```vue
<!-- Default slot -->
<slot />

<!-- Named slot with conditional rendering -->
<div v-if="$slots.icon">
  <slot name="icon" />
</div>
```

- Default slot for primary content
- Check slot existence with `$slots.slotName` before rendering wrappers

## Code Style

- **No semicolons** at end of lines
- **Vue 3 auto-imports**: `ref`, `computed`, `watch`, `onMounted`, etc. — do NOT import explicitly
- **Single quotes** for strings
- **No JSDoc blocks** on components
- **HeadlessUI** for complex interactions (modals, dialogs) — import from `@headlessui/vue`

## Layer Architecture

### Path resolution

`nuxt.config.ts` uses absolute paths so the layer works from both sibling dirs and node_modules:

```ts
const currentDir = dirname(fileURLToPath(import.meta.url))

components: { dirs: [join(currentDir, 'components')] }
imports: { dirs: [join(currentDir, 'composables')] }
css: [join(currentDir, 'assets/css/shared.css')]
```

### Package publishing

```json
{
  "main": "./nuxt.config.ts",
  "files": ["components/", "composables/", "assets/css/shared.css", "tailwind.config.js", "nuxt.config.ts"]
}
```

- `"main": "./nuxt.config.ts"` is required for Nuxt to resolve the layer
- `"files"` whitelist controls what ships in the npm package
- New directories under `components/` are automatically included
- `.claude/` does NOT ship in the package (not in files whitelist)

### Tailwind config

- `tailwindcss.cssPath: false` — `@tailwind` directives are in `shared.css`
- `exposeConfig: true` — consumers can access resolved token values
- Plugins are in `dependencies` (not devDeps) so they resolve from the package directory

## Consumer Integration

```ts
// Consumer's nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@qpoint-io/q-nuxt-layer'],
})
```

### Override mechanics

- **Local components** with the same name override layer components (Nuxt auto-import priority)
- **Consumer tailwind.config** can extend/override tokens (deep merge)
- **Icons** from the layer can be overridden by defining a local component with the same name (e.g. a local `IconLogo.vue` replaces the layer's `IconLogo.ts`)

### Peer dependencies

- `nuxt ^4.0.0` (required)
- `@headlessui/vue ^1.7.0` (optional — only for UxModal)

## Anti-Patterns

- Don't import `ref`, `computed`, `watch` etc. — they're auto-imported
- Don't use `<style scoped>` — use `<style local>` or Tailwind classes
- Don't use default Tailwind text sizes (`text-sm`, `text-lg`) — use the custom scale (`text-14`, `text-16`)
- Don't use default Tailwind font weights (`font-normal`) — use custom names (`font-reg`, `font-bold`)
- Don't use default Tailwind colors for UI elements — use the Qpoint palette
- Don't add semicolons
- Don't use `~/assets` paths in layer components — `~/` resolves to the consumer project, not the layer
