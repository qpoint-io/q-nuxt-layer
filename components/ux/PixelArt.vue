<template>
  <span
    class="px-art"
    :style="size != null ? { width: px } : undefined"
    :role="alt ? 'img' : undefined"
    :aria-label="alt || undefined"
    v-html="art"
  />
</template>

<script setup>
// UxPixelArt — themed renderer for the pixel-art families (pixel-pawns,
// pixel-icons). The exports hardcode their palette (style-block classes for
// pawns, fill attributes for icons); loaded via <img> they're beyond the
// reach of CSS variables, so themes can't touch them. This component inlines
// the raw SVG and rewrites each known palette hex to `var(--px-<role>, #hex)`
// at load time — the export files are never edited, so future art iterations
// drop in by filename unchanged. Roles are defined in tokens/semantic.mjs
// (pixelArt) and flip under `.dark` via the generated tokens.css.
const props = defineProps({
  // Path under assets/svgs/ without extension, e.g. 'pixel-pawns/agent-defaulta'
  // or 'pixel-icons/briefcase'.
  name: { type: String, required: true },
  // Width; number → px. Omit (null) to size via class/style from the consumer.
  size: { type: [Number, String], default: null },
  alt:  { type: String, default: '' },
})

// Art hex (lowercase) → --px-<role>. Single source of truth for which color
// plays which role; keep in sync with pixelArt in tokens/semantic.mjs.
const ROLES = {
  '#a6adad': 'body',
  '#4d5c5a': 'shade',
  '#fff':    'eye',
  '#ffffff': 'eye',
  '#5c6967': 'sleep-body',
  '#242b2a': 'sleep-shade',
  '#ff0030': 'alert',
  '#ab86f6': 'accent',
  '#949494': 'icon-frame',
  '#565454': 'icon-accent',
}

const raws = import.meta.glob('../../assets/svgs/{pixel-pawns,pixel-icons}/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Deterministic per-instance scope (useId is SSR-stable, unlike Math.random —
// a random scope would mismatch on hydration since the markup is v-html'd).
const scope = `px-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

const varFor = (hex) => {
  const role = ROLES[hex.toLowerCase()]
  return role ? `var(--px-${role}, ${hex})` : hex
}

const raw = computed(() => raws[`../../assets/svgs/${props.name}.svg`] || '')

const art = computed(() => {
  if (!raw.value) return ''
  let svg = raw.value.replace('<svg', `<svg class="${scope}"`)

  // Pawn-style internal <style> blocks: rescope every rule per instance
  // (same technique as ux/Icon.vue) and swap known hexes for their vars.
  svg = svg.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (_, css) => {
    const scoped = css
      .split('}')
      .filter((rule) => rule.trim())
      .map((rule) => {
        const [selector, ...decls] = rule.split('{')
        const body = decls.join('{').replace(/#[0-9a-fA-F]{3,6}\b/g, varFor)
        return `.${scope} ${selector.trim()} {${body}`
      })
      .join('}')
    return `<style>${scoped}</style>`
  })

  // Icon-style presentation attributes: fill="#hex" can't hold var(), so
  // known hexes move into style attributes (fallback preserved in the var).
  svg = svg.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (match, hex) =>
    ROLES[hex.toLowerCase()] ? `style="fill: ${varFor(hex)}"` : match)

  // Fill-less shapes (the awake pawn's black pupils) get a themed role.
  // :not([fill]):not([style]) keeps this off the attribute-filled icon rects
  // (their fills became style attributes above).
  return svg.replace('</svg>',
    `<style>.${scope} rect:not([class]):not([fill]):not([style]) { fill: var(--px-pawn-pupil, #000); }</style></svg>`)
})

const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

if (import.meta.dev) {
  watchEffect(() => {
    if (!raw.value) {
      console.warn(`[UxPixelArt] no art at assets/svgs/${props.name}.svg`)
    }
  })
}
</script>

<style>
.px-art {
  display: inline-block;
}
.px-art svg {
  display: block;
  width: 100%;
  height: auto;
}
</style>
