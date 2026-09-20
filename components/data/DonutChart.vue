<template>
  <div class="inline-flex" :class="legendBelow ? 'flex-col items-center gap-4' : 'items-center gap-8'">

    <!-- Donut -->
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :viewBox="`0 0 ${size} ${size}`" class="block w-full h-full">
        <!-- track -->
        <circle
          :cx="middle" :cy="middle" :r="radius"
          fill="none" :stroke-width="thickness"
          :style="{ stroke: qp('stroke') }"
        />
        <!-- segments — discrete arc paths (no dash seam artifact) -->
        <template v-for="seg in segments" :key="seg.key">
          <circle
            v-if="seg.full"
            :cx="middle" :cy="middle" :r="radius"
            fill="none" :stroke-width="thickness"
            :style="{ stroke: seg.stroke }"
          />
          <path
            v-else
            :d="seg.d"
            fill="none" stroke-linecap="butt" :stroke-width="thickness"
            :style="{ stroke: seg.stroke }"
          />
        </template>
      </svg>

      <!-- Center content — defaults to a DataMetricValue (+ optional label) -->
      <div
        v-if="$slots.center || centerValue != null || centerLabel"
        class="absolute inset-0 flex flex-col items-center justify-center text-center leading-none"
      >
        <slot name="center">
          <DataMetricValue
            v-if="centerValue != null"
            :val="centerValue"
            :unit="centerUnit"
            :size="centerSize"
          />
          <div v-if="centerLabel" class="-mt-1 text-13 font-med text-content-muted">
            {{ centerLabel }}
          </div>
        </slot>
      </div>
    </div>

    <!-- Legend -->
    <div
      v-if="items.length"
      :class="legendBelow ? 'flex flex-row flex-wrap justify-center gap-x-6 gap-y-2' : 'flex flex-col gap-3'"
    >
      <div v-for="(item, i) in items" :key="i" class="flex items-start gap-3">
        <span
          class="mt-1 rounded-3 shrink-0"
          :style="{ width: '14px', height: '14px', background: strokeFor(item, i) }"
        />
        <div>
          <div class="text-15 font-med text-content">{{ item.title }}</div>
          <div v-if="item.html" class="text-15 text-content-muted" v-html="item.html" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Colors resolve through the shared chart palette (components/data/palette.js):
// a token role → live CSS var; anything else in `item.color` is a raw CSS
// string; no color → the donut palette cycles by index.
import { resolveDonutColor } from './palette'

const props = defineProps({
  items       : { type: Array, required: true },   // [{ title, percent, html?, color? }]
  size        : { type: Number, default: 135 },     // diameter in px
  thickness   : { type: Number, default: 24 },      // ring stroke width in px
  gap         : { type: Number, default: 0 },       // gap between segments in px
  legendBelow : { type: Boolean, default: false },  // legend below in a horizontal row vs. beside (default)
  // Center content (used when the #center slot is not provided)
  centerValue : { default: null },                  // → DataMetricValue val (auto-abbreviated, e.g. 273000 → "273k")
  centerUnit  : { type: String },                   // → DataMetricValue unit ('bytes', 'duration', or custom)
  centerLabel : { type: String },                   // small label below the value (e.g. "Tokens")
  centerSize  : { type: Number, default: 23 },      // value font size in px
})

const middle        = computed(() => props.size / 2)
const radius        = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

// Resolve an item's color: token role → live CSS var; otherwise raw CSS string.
function strokeFor(item, i) {
  return resolveDonutColor(item.color, i)
}

// Point on the ring centerline at `deg` degrees clockwise from 12 o'clock.
function polar(deg) {
  const a = (deg - 90) * Math.PI / 180
  return [middle.value + radius.value * Math.cos(a), middle.value + radius.value * Math.sin(a)]
}

const segments = computed(() => {
  const c = circumference.value
  const gapDeg = c ? (props.gap / c) * 360 : 0   // px gap → arc degrees
  let cursor = 0
  return props.items.map((item, i) => {
    const span  = (Number(item.percent) || 0) / 100 * 360
    const start = cursor
    const sweep = Math.max(0, span - gapDeg)
    cursor += span
    const stroke = strokeFor(item, i)
    // A single near-full segment can't be drawn with one arc — use a circle.
    if (sweep >= 359.999) return { key: i, full: true, stroke }
    const [x0, y0] = polar(start)
    const [x1, y1] = polar(start + sweep)
    const largeArc = sweep > 180 ? 1 : 0
    return { key: i, d: `M ${x0} ${y0} A ${radius.value} ${radius.value} 0 ${largeArc} 1 ${x1} ${y1}`, stroke }
  })
})
</script>
