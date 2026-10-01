<template>
  <div class="relative isolate flex min-w-0 flex-col items-center" :style="{ flex: `0 1 ${columnWidth}px` }">
    <!-- active: the hovered day — a highlight behind the column (fill + 1 px border), absolutely
         placed so it never moves the layout: 4 px past the sides (half the default 8 px dayGap, so
         it meets but never crosses a neighbour), 10 px above, 6 px below; isolate keeps it above the
         card, under the column -->
    <div v-if="active" class="absolute -inset-x-1 -top-2.5 -bottom-1.5 -z-10 rounded-4 border border-stroke-strong bg-surface-sunken-subtle" />
    <!-- one lane per series, side by side — each independently stacked from a
         shared baseline, not summed into a single column -->
    <div class="flex w-full items-end justify-center" :style="{ height: `${areaHeight}px`, gap: `${blockGap}px` }">
      <div
        v-for="seg in segments"
        :key="seg.key"
        class="flex flex-col-reverse items-center"
        :style="{ width: `${blockSize}px`, height: `${areaHeight}px`, gap: `${blockGap}px` }"
      >
        <template v-if="mode === 'blocks'">
          <DataHistoryGraphBlock
            v-for="i in seg.units"
            :key="i"
            :color="seg.color"
            :size="blockSize"
            :title="nativeTitles ? `${seg.label}: ${seg.value}` : undefined"
          />
        </template>
        <template v-else>
          <div
            v-show="seg.barPx > 0"
            class="w-full"
            :style="{ height: `${seg.barPx}px`, background: seg.color }"
            :title="nativeTitles ? `${seg.label}: ${seg.value}` : undefined"
          />
        </template>
      </div>
    </div>

    <!-- baseline — stroke-strong, the label 4 px under it (c104: was stroke / 8 px) -->
    <div class="mt-1 h-px w-full bg-stroke-strong" />

    <!-- x-axis label — always rendered (even when thinned) to keep tick spacing stable; the
         hovered day's turns full-strength (text-content) -->
    <div class="mt-1 w-full truncate text-center" :class="active ? 'text-content' : 'text-content-subtle'" :style="{ fontSize: `${labelSize}px` }">
      {{ showLabel ? label : '' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label       : { type: String, default: '' },
  showLabel   : { type: Boolean, default: true },
  series      : { type: Array, required: true },   // [{ key, label, color }] — color pre-resolved
  values      : { type: Object, required: true },  // { [seriesKey]: number }
  unitValue   : { type: Number, required: true },
  maxUnits    : { type: Number, required: true },   // reserved row count, shared across all columns
  mode        : { type: String, default: 'blocks' }, // 'blocks' | 'bars'
  columnWidth : { type: Number, required: true },    // natural width (fits the label) — shrinks, never grows
  blockSize   : { type: Number, default: 6 },         // unit block width/height in px
  blockGap    : { type: Number, default: 2 },         // vertical gap between stacked blocks in px
  labelSize   : { type: Number, default: 11 },        // x-axis label font size in px
  nativeTitles: { type: Boolean, default: true },     // per-block title tooltips — off when the graph reports hover
  active      : { type: Boolean, default: false },    // the hovered column — outlined
})

// One unit row's total height — block plus the gap above it. Number(...)
// guards against a `v-model` (no `.number` modifier) upstream handing these
// through as strings, which would silently turn this `+` into concatenation
// ("16" + 2 -> "162") rather than addition.
const pitch = computed(() => Number(props.blockSize) + Number(props.blockGap))

const areaHeight = computed(() => Math.max(props.maxUnits, 1) * pitch.value)

// px-per-raw-value stays the same in both modes, so bar mode reads as the
// continuous version of the same scale blocks use — not a different chart.
const pxPerValue = computed(() => pitch.value / props.unitValue)

const segments = computed(() => props.series.map((s) => {
  const value = props.values[s.key] || 0
  const units = value > 0 ? Math.max(1, Math.round(value / props.unitValue)) : 0
  const barPx = value > 0 ? Math.max(1, value * pxPerValue.value) : 0
  return { key: s.key, label: s.label, color: s.color, value, units, barPx }
}))
</script>
