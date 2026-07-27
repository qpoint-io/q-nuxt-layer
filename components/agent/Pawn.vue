<template>
  <div class="relative inline-block align-top" :style="{ width: px }">
    <!-- Working: live binary decoration (animated component, not static art).
         Fixed 14px gap above the head — percentage-only offsets shrink to ~1px
         at small pawn sizes (mini cards). -->
    <div v-if="state === 'working'" class="absolute" style="bottom: calc(100% + 14px); left: 0; width: 92%">
      <AgentBinary />
    </div>

    <!-- Other state decorations, floated above the head (alert burst on error, …). -->
    <img
      v-if="decorSrc"
      :src="decorSrc"
      alt=""
      class="absolute h-auto"
      :style="decor.style"
    >

    <!-- Consumer content anchored above the head — e.g. the needs-input speech bubble. -->
    <div v-if="$slots.default" class="absolute" style="bottom: 104%; left: 50%">
      <slot />
    </div>

    <img
      v-if="bodySrc"
      :src="bodySrc"
      :alt="`agent pawn — ${state}`"
      class="block w-full h-auto"
    >
    <span
      v-else
      class="flex items-center justify-center w-full aspect-square border border-dashed border-stroke-strong text-content-subtle text-24 leading-none"
    >?</span>

    <!-- Optional provider logo, overlaid on the pawn's face. -->
    <img
      v-if="providerSrc"
      :src="providerSrc"
      :alt="provider"
      class="absolute"
      style="left: 50%; top: 58%; width: 38%; transform: translate(-50%, -50%)"
    >
  </div>
</template>

<script setup>
// AgentPawn — the "Agent" pixel pawn (first of the c47 entity-pawn family).
// Visuals are composed per `state`: a base body SVG (awake or sleeping) plus an
// optional decoration SVG floated above the head. Art is loaded as static asset
// URLs and rendered via <img> so colors are preserved — deliberately NOT routed
// through UxIcon, which forces stroke/fill to currentColor.
const props = defineProps({
  // One of: working, idle, errored, needs-input, angel.
  state:    { type: String, default: 'angel' },
  // Selects assets/svgs/pixel-pawns/providers/<provider>.svg. Empty = no overlay.
  provider: { type: String, default: '' },
  // Pawn width; number → px. Height scales automatically.
  size:     { type: [Number, String], default: 96 },
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
  'idle':    { file: 'zzza',    style: 'bottom: calc(100% + 10px); left: 50%; width: 50%; transform: translateX(-50%)' },
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
const bodySrc = computed(() => url(BODIES[props.state] || BODIES.angel))

const decor = computed(() => DECORATIONS[props.state] || null)
const decorSrc = computed(() => (decor.value ? url(decor.value.file) : null))

const providerSrc = computed(() =>
  props.provider ? url(`providers/${props.provider}`) : null,
)

if (import.meta.dev) {
  watchEffect(() => {
    if (!(props.state in BODIES)) {
      console.warn(`[AgentPawn] unknown state '${props.state}' (expected one of: ${Object.keys(BODIES).join(', ')}) — falling back to base body`)
    }
    if (decor.value && !decorSrc.value) {
      console.warn(`[AgentPawn] decoration art for state '${props.state}' is pending (expected assets/svgs/pixel-pawns/${decor.value.file}.svg)`)
    }
    if (props.provider && !providerSrc.value) {
      console.warn(`[AgentPawn] no provider logo '${props.provider}' (expected assets/svgs/pixel-pawns/providers/${props.provider}.svg)`)
    }
  })
}
</script>
