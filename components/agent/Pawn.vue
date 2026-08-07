<template>
  <div class="relative inline-block align-top" :style="{ width: px }">
    <!-- Working: live binary decoration (animated component, not static art).
         Fixed 14px gap above the head — percentage-only offsets shrink to ~1px
         at small pawn sizes (mini cards). -->
    <div v-if="decorations && state === 'working'" class="absolute" style="bottom: calc(100% + 14px); left: 0; width: 92%">
      <AgentBinary />
    </div>

    <!-- Other state decorations, floated above the head (alert burst on error, …). -->
    <UxPixelArt
      v-if="decorSrc"
      :name="`pixel-pawns/${decor.file}`"
      class="absolute"
      :style="decorStyle"
    />

    <!-- Consumer content anchored above the head — e.g. the needs-input speech bubble. -->
    <div v-if="$slots.default" class="absolute" style="bottom: 104%; left: 50%">
      <slot />
    </div>

    <UxPixelArt
      v-if="bodySrc"
      :name="`pixel-pawns/${bodyName}`"
      :alt="`agent pawn — ${state}`"
      class="block"
      size="100%"
    />
    <span
      v-else
      class="flex items-center justify-center w-full aspect-square border border-dashed border-stroke-strong text-content-subtle text-24 leading-none"
    >?</span>
  </div>
</template>

<script setup>
// AgentPawn — the "Agent" pixel pawn (first of the c47 entity-pawn family).
// Visuals are composed per `state`: a base body SVG (awake or sleeping) plus an
// optional decoration SVG floated above the head. Body and decorations render
// through UxPixelArt, which inlines the art and rewrites its palette to
// themed `--px-*` variables (multicolor preserved, flips under `.dark`).
const props = defineProps({
  // One of: working, idle, errored, needs-input, angel.
  state:    { type: String, default: 'angel' },
  // Pawn width; number → px. Height scales automatically.
  size:     { type: [Number, String], default: 96 },
  // Floating decorations above the head (working binary, idle zzz, error
  // alert). Disable for inline/table contexts where the overflow would draw
  // over neighboring rows — the state still selects the body art (idle keeps
  // its sleeping body).
  decorations: { type: Boolean, default: true },
})

// Trailing 'a' in filenames is the art iteration marker — bump here when 'b'
// exports land.
const BODIES = {
  'working':     'agent-defaulta',
  'idle':        'agent-sleepa',
  'errored':     'agent-defaulta',
  'needs-input': 'agent-defaulta',
  'angel':       'agent-defaulta',
}

// Decoration art + placement above the head (inline styles — Tailwind's scan
// doesn't reliably cover layer components, so no arbitrary-value classes).
// The angel file doesn't exist yet — the expected name is registered so the
// art drops in without a code change (dev warns until then). needs-input
// has no built-in decoration (the bubble comes from the consumer via the
// default slot), and working renders the animated AgentBinary component
// instead of static art (binarya.svg remains as the art source of record).
const DECORATIONS = {
  // idle's gap and width are size-aware (see decorStyle) — 10px/50% reads
  // right at card sizes, but at inline sizes (~28px) the zzz floats too far
  // off the head and shrinks to a smudge, so it hugs closer and scales up.
  'idle':    { file: 'zzza',    style: 'bottom: 95%; left: 40%; transform: translateX(-50%)', gap: 10, width: 50 },
  'errored': { file: 'alerta',  style: 'bottom: 102%; left: 50%; width: 72%; transform: translateX(-50%)' },
  'angel':   { file: 'haloa',   style: 'bottom: 102%; left: 50%; width: 60%; transform: translateX(-50%)' },
}

// Eager URL map of every pawn asset — path → resolved URL, resolved at build.
const pawnUrls = import.meta.glob('../../assets/svgs/pixel-pawns/**/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

const url = name => pawnUrls[`../../assets/svgs/pixel-pawns/${name}.svg`] || null

const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

// Unknown states fall back to the awake base body.
const bodyName = computed(() => BODIES[props.state] || BODIES.angel)
const bodySrc = computed(() => url(bodyName.value))

const decor = computed(() => DECORATIONS[props.state] || null)
const decorSrc = computed(() => (props.decorations && decor.value ? url(decor.value.file) : null))

// Decoration placement; entries with a `gap` are size-aware below 48px
// pawns: the gap scales down (10px → ~3px at 28px) and the art scales up
// 1.2× so it stays legible at inline scale.
const decorStyle = computed(() => {
  if (!decor.value) return ''
  if (!('gap' in decor.value)) return decor.value.style
  const n = parseInt(px.value, 10) || 96
  const small = n < 48
  // Small sizes: hug the head (gap may go negative — slight overlap reads
  // right at this scale) and nudge 3px left of center.
  const gap = small ? Math.round(n * 0.1) - 5 : decor.value.gap
  const width = small ? Math.round(decor.value.width * 1.2) : decor.value.width
  const nudge = small ? '; left: calc(50% - 3px)' : ''
  return `bottom: calc(100% + ${gap}px); width: ${width}%; ${decor.value.style}${nudge}`
})

if (import.meta.dev) {
  watchEffect(() => {
    if (!(props.state in BODIES)) {
      console.warn(`[AgentPawn] unknown state '${props.state}' (expected one of: ${Object.keys(BODIES).join(', ')}) — falling back to base body`)
    }
    if (props.decorations && decor.value && !decorSrc.value) {
      console.warn(`[AgentPawn] decoration art for state '${props.state}' is pending (expected assets/svgs/pixel-pawns/${decor.value.file}.svg)`)
    }
  })
}
</script>
