<!-- Presentational — like the rest of the Filter namespace, this doesn't touch
     any store. A consumer wires update:modelValue/update:filterKey into the
     same keyValFilters state that feeds its Filter bar so the two stay in
     sync (see design's pages/pages/phase2/global-filter.vue).

     A segmented bar: a key segment whose right edge is a chevron pointing
     into the value segments ("All" + one per option), divided by hairlines.

     Layout note: the root is full-width and right-aligns the bar. Alignment
     is owned here on purpose (every qdash listing wants it over the table's
     right edge), so a consumer never needs a wrapper to place it — and a
     flex-row wrapper can't shrink it back to the left.

     #end slot (c95): a trailing segment after the values, hairline-divided,
     for a control that belongs on the bar but isn't a filter value — the
     column picker in DataListingBar. Its scope hands over TONE so the content
     can draw itself in the bar's colours. The bar's overflow clip sits on the
     key+values group, not the whole bar, so a popover opened from the end
     segment isn't clipped; end content should carry rounded-r-6 on its own
     hover/selected surface to follow the bar's inner corner. -->
<template>
  <div class="flex w-full items-center justify-end gap-3">
    <span v-if="label" class="text-14 font-med whitespace-nowrap" :class="TONE.text">{{ label }}</span>

    <div class="inline-flex items-stretch rounded-8 bg-surface border-2" :class="TONE.lineBorder">
      <!-- overflow-hidden clips the selected fill to the corners (rounded-6 = the 8px
           outer radius minus the 2px border) — which also clips outset focus rings,
           hence the inset rings below. With an #end segment the right side is straight. -->
      <div class="flex items-stretch overflow-hidden" :class="$slots.end ? 'rounded-l-6' : 'rounded-6'">
      <div class="relative flex items-center gap-2 pl-4 pr-3 shrink-0">
        <!-- Multi-key: a native <select>, invisible, stretched over the segment so the
             whole segment opens it while the label + caret stay custom-drawn. No focus
             ring on this segment (Mark, c95): the c92 peer-focus-visible overlay lit up
             after every mouse pick, because Chrome treats a <select> as keyboard-focused
             even when clicked. The select's own ring is invisible (opacity-0). -->
        <select
          v-if="multiKey"
          :value="filterKey"
          aria-label="Filter key"
          class="absolute inset-0 w-full opacity-0 cursor-pointer"
          @change="$emit('update:filterKey', $event.target.value)"
        >
          <option v-for="def in filterKeyDefs" :key="def.key" :value="def.key">{{ def.label ?? def.key }}</option>
        </select>

        <span class="text-14 font-bold text-content-muted whitespace-nowrap">{{ currentKeyLabel }}</span>
        <!-- The caret only appears when there's a choice to make; a single fixed key is a plain label. -->
        <UxIcon v-if="multiKey" id="triangle" class="w-3 rotate-180" :class="TONE.accent" />

        <!-- The chevron: a 12px-wide (w-3) SVG hung off the segment's right edge, over
             the first value segment. Filled with the surface (so it masks that
             segment's selected fill into a point) and stroked with the hairline
             colour; z-10 lifts it above the buttons, which come later in the DOM.
             preserveAspectRatio="none" stretches it to any height; non-scaling-stroke
             keeps the line 1px despite the stretch. -->
        <svg class="absolute top-0 left-full h-full w-3 z-10" :class="TONE.lineStroke" viewBox="0 0 12 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 L12 50 L0 100 Z" class="fill-surface" />
          <path d="M0 0 L12 50 L0 100" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" />
        </svg>
      </div>

      <div class="flex items-stretch divide-x" :class="TONE.lineDivide">
        <button
          v-for="(option, i) in allOptions" :key="i"
          type="button"
          class="text-14 whitespace-nowrap py-1 transition-colors outline-none ring-inset focus-visible:ring-2"
          :class="[
            // First segment: pl-8 = px-5 + the w-3 chevron that overlaps it, so its
            // visible padding matches its neighbours'.
            i === 0 ? 'pl-8 pr-5' : 'px-5',
            TONE.focusRing,
            isSelected(option.value) ? ['font-bold', TONE.selected] : ['font-med', TONE.text, TONE.hover],
          ]"
          :aria-pressed="isSelected(option.value)"
          @click="$emit('update:modelValue', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      </div>

      <!-- trailing segment(s): divided from the values, and from each other -->
      <div v-if="$slots.end" class="flex items-stretch border-l divide-x" :class="[TONE.lineBorder, TONE.lineDivide]">
        <slot name="end" :tone="TONE" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Optional lead-in text outside the bar, e.g. "Global Filter :".
  label: { type: String, default: '' },
  // FilterKeyDefinition[] — only rendered as a dropdown when there's more
  // than one; a single fixed key renders as static label text.
  filterKeyDefs: { type: Array, default: () => [] },
  filterKey: { type: String, default: '' },
  // { value, label }[] — quick-select values for the current key. A value of
  // null/undefined is reserved for "All" and would read as it.
  options: { type: Array, default: () => [] },
  // Currently selected value; null/undefined = "All". Untyped on purpose — any
  // primitive works, but it's compared with ===, so '3' won't match 3 (watch
  // values that round-trip through the URL as strings).
  modelValue: { default: null },
})

defineEmits(['update:modelValue', 'update:filterKey'])

// Colour roles, collected so the off-token choices live in one place. None of
// these are semantic tokens yet: the lines and fills are the legacy flat brand
// `blue` (#2FAEFD, not `primary`) at opacity, and the resting text is stock
// Tailwind slate-500 — the only slate in the layer. When the bar's colours join
// the token set, the role names below are the proposed token names and this
// object is the only thing to change. Literal class strings, so Tailwind's
// scanner still sees them.
const TONE = {
  lineBorder: 'border-blue/30', // outer border
  lineDivide: 'divide-blue/30', // hairlines between values
  lineStroke: 'text-blue/30', // chevron stroke (drawn with currentColor)
  text: 'text-slate-500', // lead-in label + resting values
  accent: 'text-blue', // key caret
  selected: 'bg-blue/15 text-content',
  hover: 'hover:bg-blue/5 hover:text-blue',
  focusRing: 'ring-blue', // colour for the inset keyboard-focus rings
}

const multiKey = computed(() => props.filterKeyDefs.length > 1)

const currentKeyLabel = computed(() => {
  const def = props.filterKeyDefs.find(d => d.key === props.filterKey)
  return def?.label ?? def?.key ?? props.filterKey
})

const allOptions = computed(() => [{ value: null, label: 'All' }, ...props.options])

const isSelected = value => value == null ? props.modelValue == null : props.modelValue === value
</script>
