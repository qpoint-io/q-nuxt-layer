<template>
  <div class="flex flex-wrap items-start gap-y-6 divide-x divide-stroke mb-6">
    <!-- Identity cell: mark · name · subline -->
    <div class="flex items-center gap-6 py-1 pr-12">
      <slot name="mark" />
      <div>
        <div class="text-38 font-bold leading-tight text-content">
          <slot name="name" />
        </div>
        <div v-if="slots.subline" class="flex items-center gap-1.5 text-14 text-content-subtle">
          <slot name="subline" />
        </div>
      </div>
    </div>

    <!-- Headline cells (ActorHeaderCell). Rendered as a fragment so each cell is a
         direct child of the row — that is what makes divide-x draw the hairline. -->
    <slot name="cells" />

    <!-- Metadata cell: key/value grid + Show-All toggle for the long tail.
         Collapsed, the cell fills whatever width the row has left (min 280px,
         else it wraps to its own line) so the value column has a real edge to
         truncate at. Expanded, it sizes to its content and is free to wrap
         onto its own line beneath the headline cells; max-w-full keeps very
         long values wrapping inside the page instead of overflowing it. -->
    <div v-if="slots.metadata" class="pl-12 pr-6" :class="showAll ? 'max-w-full' : 'min-w-[280px] flex-1'">
      <div class="text-13 font-bold text-content mb-2">{{ metadataLabel }}</div>
      <!-- Value column is minmax(0,1fr) so it can shrink below its content.
           Collapsed: values clip to one line with an ellipsis (hover the
           consumer's :title for the full text) and only the first ROWS pairs
           show — nth-child(n+11) hides the rest, so consumers can keep
           rendering pairs as v-if fragments. Expanded: every pair shows and
           values wrap. Hairlines: every cell has a top border except the first
           row's pair; the key column's gap is its own right padding (not
           gap-x) so each row's hairline runs unbroken under key and value. -->
      <div
        ref="gridEl"
        class="grid content-start grid-cols-[auto_minmax(0,1fr)] items-baseline leading-[1.4] text-12 actor-meta-grid"
        :class="showAll ? '[&>*:nth-child(even)]:break-words' : '[&>*:nth-child(even)]:truncate [&>*:nth-child(n+11)]:hidden'"
      >
        <slot name="metadata" />
        <template v-if="showAll">
          <slot name="metadataMore" />
        </template>
      </div>
      <button
        v-if="slots.metadataMore || clipped || overflow || showAll"
        type="button"
        class="mt-1.5 text-12 font-med text-primary duration-300 hover:text-content hover:duration-0"
        @click="showAll = !showAll"
      >
        {{ showAll ? lessLabel : moreLabel }}
      </button>
    </div>
  </div>
</template>

<!-- ActorHeader — the combined identity header every actor detail page opens
     with (qdash agents/detail.vue, design c59/c60 agent-detail-v2): one
     hairline-divided row of cells. First cell is the identity (a mark, the
     name at text-38, a subline of "vendor / kind / ● state" facts); then the
     consumer's headline cells (ActorHeaderCell — Spend, a score with a
     DataSmile); last, a Metadata cell — a key/value grid whose long tail hides
     behind "Show All Metadata". The component owns only the chrome and the
     Show-All state; every fact, link and glyph is the consumer's composition.

     Metadata pairs are two spans per row inside the grid:
       <span class="text-content-subtle">User</span>
       <span class="font-semi text-content">priya@acme.com</span>
     Subline parts are separated by <span class="opacity-50">/</span>.

     Long values: while collapsed every value is clipped to one line with an
     ellipsis — consumers should not add their own truncate/max-w, just a
     :title — and only the first five pairs are shown, whatever the consumer
     put in #metadata. "Show All Metadata" reveals the rest plus
     #metadataMore AND lifts the clipping so values wrap in full; the toggle
     also appears (without a long tail) whenever a value is clipped or a row
     is hidden by the cap. -->
<script setup>
const props = defineProps({
  // Label over the metadata key/value grid.
  metadataLabel : { type: String, default: 'Metadata' },
  // Toggle copy — collapsed / expanded.
  moreLabel     : { type: String, default: 'Show All Metadata' },
  lessLabel     : { type: String, default: 'Show less' },
  // Start with the long tail (#metadataMore) revealed.
  open          : { type: Boolean, default: false },
})
// Pairs shown while collapsed — must agree with the nth-child(n+11) variant
// on the grid (ROWS * 2 + 1).
const ROWS = 5
const slots = useSlots()
const showAll = ref(props.open)

// Is any value in the collapsed grid actually clipped, or any row hidden by
// the cap? Either drives the toggle on pages that have no #metadataMore.
// Measured after render and on resize; expanded grids never clip, so we
// stop there.
const gridEl = ref(null)
const clipped = ref(false)
const overflow = ref(false)
const measure = () => {
  const el = gridEl.value
  if (!el || showAll.value) return
  const kids = Array.from(el.children)
  overflow.value = kids.length > ROWS * 2
  clipped.value = kids.some((c, i) => i % 2 === 1 && c.scrollWidth > c.clientWidth + 1)
}
let ro
onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && gridEl.value) {
    ro = new ResizeObserver(measure)
    ro.observe(gridEl.value)
  }
})
onUpdated(measure)
onBeforeUnmount(() => ro?.disconnect())
</script>

<style>
/* Metadata row hairlines (design c92, 2026-09-24) — class-anchored rules, not arbitrary
   Tailwind variants: a consumer's scan doesn't reliably cover layer files. Every cell gets
   a top hairline except the first row's pair; the key column's gap is its own right padding
   so each row's line runs unbroken under key and value. */
.actor-meta-grid > * { @apply border-t border-stroke-strong py-1; }
.actor-meta-grid > *:nth-child(-n+2) { @apply border-t-0 pt-0; }
.actor-meta-grid > *:nth-child(odd) { @apply pr-10; }
</style>
