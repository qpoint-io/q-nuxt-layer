<template>
  <div class="flex items-start gap-8" :class="legendBelow ? 'flex-col' : 'flex-row'">
    <div class="flex min-w-0" :style="{ width: `${columnsAreaWidth}px`, gap: `${dayGap}px` }">
      <DataHistoryGraphColumn
        v-for="(col, i) in columns"
        :key="col.key"
        :label="col.label"
        :show-label="isTickVisible(i)"
        :series="resolvedSeries"
        :values="col.values"
        :unit-value="unitValue"
        :max-units="maxUnits"
        :mode="effectiveMode"
        :column-width="columnWidth"
        :block-size="blockSize"
        :block-gap="blockGap"
        :label-size="labelSize"
      />
    </div>
    <DataHistoryGraphLegend
      v-if="resolvedSeries.length"
      :series="resolvedSeries"
      :horizontal="legendBelow"
      :font-size="Number(labelSize) + 1"
    />
  </div>
</template>

<script setup>
import { resolveHistoryGraphColor } from './history-graph/palette'

// Fixed-order date formatters — 'weekday'/'day'/'date' cover the flexible x-axis
// the prompt asks for (day-of-week words, day numbers, or full dates).
const FORMATTERS = {
  weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }),
  day:     new Intl.DateTimeFormat('en-US', { day: 'numeric' }),
  date:    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }),
}

// Natural (max) column width per label style at the default 11px label size —
// just enough for that format's longest string ("Sep 11" needs more room
// than "12"). Scaled by the actual labelSize prop below. Columns shrink below
// this when a long range doesn't fit the container, but never grow past it —
// a 7-day chart in a wide card stays compact and left-aligned instead of
// stretching its gaps to fill the space.
const LABEL_COLUMN_WIDTH = { weekday: 28, day: 24, date: 42 }
const LABEL_COLUMN_WIDTH_BASE_SIZE = 11

// Long ranges (60-day+) can't fit a readable block pitch per column — auto
// mode falls back to continuous bars past this many columns.
const BAR_MODE_POINT_THRESHOLD = 40
// Ticks thin out past this many columns so labels don't collide.
const MAX_VISIBLE_TICKS = 15
// "Nice" unit steps (1, 2, 5 x10^n) — the scale a block/bar represents.
const NICE_STEPS = [1, 2, 5]

const props = defineProps({
  data               : { type: Object, required: true },  // { series: HistorySeries[], points: HistoryPoint[] }
  labelFormat        : { type: String, default: null },   // 'weekday' | 'day' | 'date' — auto-detected from range length when omitted
  maxBlocksPerColumn : { type: Number, default: 12 },      // block/bar switch threshold + unit-scaling cap
  mode               : { type: String, default: 'auto' },  // 'blocks' | 'bars' | 'auto'
  legendBelow        : { type: Boolean, default: false },
  blockSize          : { type: Number, default: 6 },       // unit block width/height in px
  blockGap           : { type: Number, default: 2 },       // vertical gap between stacked blocks in px
  dayGap             : { type: Number, default: 8 },       // horizontal gap between day columns in px
  labelSize          : { type: Number, default: 11 },      // x-axis label font size in px
})

// SSR always renders light; gating on `mounted` (not colorScheme directly)
// keeps hydration's first client render matching the server markup, then
// flips to the real scheme right after mount — same pattern as ThemeToggle's
// isDark, needed here because this is an inline-style hex, not a qp() CSS
// var, so nothing but this ref makes it theme-reactive.
const { colorScheme } = useColorScheme()
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const activeScheme = computed(() => mounted.value ? colorScheme.value : 'light')

const resolvedSeries = computed(() => props.data.series.map((s, i) => ({
  key: s.key,
  label: s.label,
  color: resolveHistoryGraphColor(s.color, i, activeScheme.value),
})))

// Date-only strings ("2026-09-07") parse as UTC midnight per spec — formatting
// that in a timezone behind UTC shows the previous calendar day. Treat a bare
// date string as the local calendar day the caller meant, not a UTC instant.
function toLocalDate(input) {
  if (input instanceof Date) return input
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(input)
}

const points = computed(() => props.data.points.map((p) => ({
  date: toLocalDate(p.date),
  values: p.values,
})))

const effectiveLabelFormat = computed(() => {
  if (props.labelFormat) return props.labelFormat
  const n = points.value.length
  if (n <= 7) return 'weekday'
  if (n <= 31) return 'day'
  return 'date'
})

const effectiveMode = computed(() => {
  if (props.mode !== 'auto') return props.mode
  return points.value.length > BAR_MODE_POINT_THRESHOLD ? 'bars' : 'blocks'
})

// Series render as side-by-side lanes, not a stacked total, so a column needs
// to fit either its label or its full row of lanes — whichever is wider.
// The label term scales with labelSize so a bigger label doesn't truncate.
const columnWidth = computed(() => {
  const labelWidth = LABEL_COLUMN_WIDTH[effectiveLabelFormat.value] * (Number(props.labelSize) / LABEL_COLUMN_WIDTH_BASE_SIZE)
  const n = resolvedSeries.value.length || 1
  const lanesWidth = n * props.blockSize + Math.max(0, n - 1) * props.blockGap
  return Math.max(labelWidth, lanesWidth)
})

// The wrapper's own natural width, computed explicitly rather than left to
// flex-basis:auto — a flex item that's itself a flex container doesn't
// reliably resolve "auto" to the sum of its children's own flex-basis values,
// especially once min-w-0 is in play, so it can collapse well below content
// size. flex-shrink still lets the whole row give way at extreme densities.
const columnsAreaWidth = computed(() => {
  const n = points.value.length
  return n * columnWidth.value + Math.max(0, n - 1) * props.dayGap
})

// Smallest "nice" step so the tallest single-series lane fits under the cap —
// series sit side by side, not stacked, so the scale is driven by the
// largest individual value, not a per-day sum. This is what lets one block
// stand for 1 session on a light week and for 50 sessions on a busy month,
// without a manual per-use toggle.
function niceUnitValue(maxValue, maxBlocks) {
  if (maxValue <= 0) return 1
  for (let mag = 0; mag < 12; mag++) {
    for (const step of NICE_STEPS) {
      const candidate = step * 10 ** mag
      if (maxValue / candidate <= maxBlocks) return candidate
    }
  }
  return Math.ceil(maxValue / maxBlocks)
}

const tallestValue = computed(() => Math.max(0, ...points.value.flatMap((p) =>
  resolvedSeries.value.map((s) => p.values[s.key] || 0)
)))
const unitValue = computed(() => niceUnitValue(tallestValue.value, props.maxBlocksPerColumn))

// Any real value renders at least one unit (a session should never disappear
// to rounding) — mirrored in DataHistoryGraphColumn's own segment math, so
// this stays the true reserved height rather than an estimate.
function unitsFor(value, unit) {
  return value > 0 ? Math.max(1, Math.round(value / unit)) : 0
}

const maxUnits = computed(() => Math.max(1, ...points.value.flatMap((p) =>
  resolvedSeries.value.map((s) => unitsFor(p.values[s.key] || 0, unitValue.value))
)))

const tickEvery = computed(() => Math.max(1, Math.ceil(points.value.length / MAX_VISIBLE_TICKS)))
function isTickVisible(i) { return i % tickEvery.value === 0 }

const columns = computed(() => points.value.map((p) => ({
  key: p.date.toISOString(),
  label: FORMATTERS[effectiveLabelFormat.value].format(p.date),
  values: p.values,
})))
</script>
