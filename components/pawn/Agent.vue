<template>
  <div class="relative inline-block align-top" :style="{ width: px }">
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
      class="absolute left-1/2 top-[58%] w-[38%] -translate-x-1/2 -translate-y-1/2"
    >
  </div>
</template>

<script setup>
// PawnAgent — the "Agent" pixel pawn (first of the c47 entity-pawn family).
// Renders a full-color pawn SVG (exported from Illustrator) by `state`, with an
// optional `provider` logo overlaid. Art is loaded as a static asset URL and
// rendered via <img> so colors are preserved — deliberately NOT routed through
// UxIcon, which forces stroke/fill to currentColor.
const props = defineProps({
  // Selects assets/pawns/agent/<state>.svg. Only 'angel' exists today; the prop
  // is open-ended so future states/art drop in without a code change.
  state:    { type: String, default: 'angel' },
  // Selects assets/pawns/providers/<provider>.svg. Empty = no overlay.
  provider: { type: String, default: '' },
  // Pawn width; number → px. Height scales automatically.
  size:     { type: [Number, String], default: 96 },
})

// Eager URL map of every pawn asset — path → resolved URL, resolved at build.
const pawnUrls = import.meta.glob('../../assets/pawns/**/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

const bodySrc = computed(() => pawnUrls[`../../assets/pawns/agent/${props.state}.svg`] || null)

const providerSrc = computed(() =>
  props.provider ? pawnUrls[`../../assets/pawns/providers/${props.provider}.svg`] || null : null,
)

if (import.meta.dev) {
  watchEffect(() => {
    if (!bodySrc.value) {
      console.warn(`[PawnAgent] no art for state '${props.state}' (expected assets/pawns/agent/${props.state}.svg)`)
    }
    if (props.provider && !providerSrc.value) {
      console.warn(`[PawnAgent] no provider logo '${props.provider}' (expected assets/pawns/providers/${props.provider}.svg)`)
    }
  })
}
</script>
