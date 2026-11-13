<template>
  <!-- DataDotStrip (design c138, the native app's footprint page): every reading
       as its own dot on one shared numeric axis, a row per configuration, so two or
       more readings per row stay visible: no averages. The family's other charts
       draw a whole (DataSegmentBar), shares and lengths (DataRankedBars,
       UxPercentBar) or a headline (DataMachine); this one draws positions.

       Marks follow the dataviz spec: 10 px marks with a 2 px surface ring, hairline
       solid gridlines, labels and values in text tokens, identity by shape (never
       colour alone). Hollow marks (ring, diamond) draw first, so a filled one at the
       same place stays on top. Each mark is a button: hover or keyboard focus shows
       its value, its row and its own `tip` line. A reference band, an outlined
       "whole" track (one CPU core, say) and a dashed target line are optional. -->
  <div v-if="hasData" class="w-full" data-dot-strip>
    <div class="flex flex-col">
      <template v-for="(row, ri) in allRows" :key="row.id ?? ri">
        <!-- a group header: a session, a kind of state -->
        <div v-if="row.header" class="pt-4 pb-1 first:pt-0" :class="ri > 0 ? 'mt-2 border-t border-stroke' : ''">
          <div class="flex flex-wrap items-baseline gap-x-2">
            <span class="text-13 font-bold text-content">{{ row.header }}</span>
            <span v-if="row.when" class="text-12 text-content-subtle">{{ row.when }}</span>
          </div>
          <p v-if="row.note" class="text-12 text-content-muted">{{ row.note }}</p>
        </div>

        <div v-else class="_row items-center" :style="colVars">
          <!-- label -->
          <div class="min-w-0 py-1 sm:py-0">
            <div class="truncate text-13 text-content" :class="row.strong ? 'font-bold' : 'font-semi'" :title="row.label">{{ row.label }}</div>
            <div v-if="row.sub" class="truncate text-11 text-content-subtle" :title="row.sub">{{ row.sub }}</div>
          </div>

          <!-- the row's values as written (right column when wide, beside the label when narrow) -->
          <div class="_values text-right text-12 tabular-nums text-content-muted">{{ row.values }}</div>

          <!-- plot -->
          <div class="_plot relative h-9" @pointerleave="active = null">
            <div class="absolute inset-y-0" :style="insetStyle">
              <!-- gridlines at the ticks: hairline, solid, recessive -->
              <div v-for="t in ticks" :key="t" class="absolute inset-y-0 w-px bg-stroke" :style="{ left: pos(t) }" />
              <!-- a reference band (a spread, a range) -->
              <div v-if="band" class="absolute inset-y-1 rounded-2 bg-primary/15 dark:bg-primary/30" :style="{ left: pos(band.lo), width: span(band.lo, band.hi) }" />
              <!-- the whole the readings sit in (one core): an outlined track -->
              <div v-if="track" class="absolute top-1/2 h-2 -translate-y-1/2 rounded-full border border-content-muted bg-surface" :style="{ left: pos(domain[0]), width: span(domain[0], domain[1]) }" />
              <!-- a target: a threshold, so dashed (a gridline never is) -->
              <div v-if="target" class="absolute inset-y-0 border-l-2 border-dashed border-content-muted" :style="{ left: pos(target.v) }" />
            </div>

            <!-- the marks; the hit area (24 px) is bigger than the mark -->
            <div class="absolute inset-y-0" :style="insetStyle">
              <button
                v-for="(p, pi) in row.points" :key="pi"
                type="button"
                class="group absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none"
                :style="{ left: pos(p.v) }"
                :aria-label="`${row.label}: ${p.text}${unit ? ' ' + unit : ''}${p.tip ? ', ' + p.tip : ''}`"
                @pointerenter="active = { ri, pi }"
                @focus="active = { ri, pi }"
                @blur="active = null"
              >
                <span class="block shrink-0 transition-transform group-hover:scale-125 group-focus-visible:scale-125" :class="shapeClass(p.shape)" :style="RING" />
              </button>
            </div>

            <!-- tooltip: the value first, then the row; text tokens only -->
            <div
              v-if="active && active.ri === ri && row.points[active.pi]"
              class="pointer-events-none absolute bottom-full z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-8 border border-stroke bg-surface px-2.5 py-1.5 shadow-sm"
              :style="tipStyle(row.points[active.pi].v)"
              role="tooltip"
            >
              <div class="text-13 font-bold tabular-nums text-content">{{ row.points[active.pi].text }}<span v-if="unit" class="ml-0.5 font-semi text-content-muted">{{ unit }}</span></div>
              <div class="text-11 text-content-muted">{{ row.label }}<template v-if="row.points[active.pi].note"> · {{ row.points[active.pi].note }}</template></div>
              <div v-if="row.points[active.pi].tip" class="text-11 text-content-subtle">{{ row.points[active.pi].tip }}</div>
            </div>
          </div>
        </div>
      </template>

      <!-- the axis: tick labels under the plot column -->
      <div class="_row _axis mt-1" :style="colVars">
        <div class="_spacer" />
        <div class="_plot">
          <div class="relative h-4">
            <div class="absolute inset-y-0" :style="insetStyle">
              <span v-for="t in ticks" :key="t" class="absolute -translate-x-1/2 text-11 tabular-nums text-content-subtle" :style="{ left: pos(t) }">{{ fmtTick(t) }}</span>
            </div>
          </div>
          <div v-if="axisLabel" class="mt-0.5 text-11 text-content-subtle">{{ axisLabel }}</div>
        </div>
        <div class="_spacer" />
      </div>
    </div>

    <!-- legend: the marks by shape, never colour alone -->
    <div v-if="legend.length" class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-12 text-content-muted">
      <span v-for="l in legend" :key="l.shape + l.label" class="flex items-center gap-1.5">
        <span v-if="l.shape === 'band'" class="block h-3 w-4 rounded-2 bg-primary/15 dark:bg-primary/30" />
        <span v-else-if="l.shape === 'track'" class="block h-2 w-5 rounded-full border border-content-muted bg-surface" />
        <span v-else-if="l.shape === 'target'" class="block h-3 w-0 border-l-2 border-dashed border-content-muted" />
        <span v-else class="block shrink-0" :class="shapeClass(l.shape)" :style="RING" />
        {{ l.label }}
      </span>
    </div>
  </div>
  <span v-else class="text-13 text-content-subtle" title="nothing to plot" data-dot-strip data-empty>—</span>
</template>

<script setup>
// DataDotStrip — rows of readings as marks on one shared numeric axis.
//
// rows: [{ id?, label, sub?, strong?, values?, points: [{ v, text, shape?, note?, tip? }] }]
//   or a group header row: { header, when?, note? }.
//   `v` places the mark; `text` is the value as the record writes it (61.0 stays
//   61.0); `values` is the row's own line of values for the values column.
//   `shape`: 'dot' (default, filled) · 'ring' · 'diamond' · 'square'. The
//   consumer says what a shape means, in the `legend` and in each point's `tip`
//   (the tooltip's last line, also read by the accessible name).
// domain: [min, max] of the axis. Start it at zero for magnitudes, so a small
//   spread reads as small. ticks: the gridlines and their labels.
// band { lo, hi } · track (the domain as an outlined whole) · target { v } (dashed).
// legend: [{ shape: 'dot'|'ring'|'diamond'|'square'|'band'|'track'|'target', label }].
// labelCol / valueCol: the side columns on wide screens (any CSS length). Under
//   640 px the label and values share a line above a full-width plot.
// No data rows → an em-dash, as the family's other charts.
import { computed, ref } from 'vue'

const props = defineProps({
  rows       : { type: Array, required: true },
  domain     : { type: Array, required: true },          // [min, max]
  ticks      : { type: Array, default: () => [] },
  unit       : { type: String, default: '' },            // after the value in the tooltip and the accessible name
  axisLabel  : { type: String, default: '' },
  band       : { type: Object, default: null },          // { lo, hi }
  track      : { type: Boolean, default: false },
  target     : { type: Object, default: null },          // { v }
  legend     : { type: Array, default: () => [] },
  labelCol   : { type: String, default: '11rem' },
  valueCol   : { type: String, default: '9rem' },
  tickFormat : { type: Function, default: null },
})

// half a hit target of inset each side, so a mark at either end is not cut
const INSET = 12
const insetStyle = { left: `${INSET}px`, right: `${INSET}px` }
// the 2 px surface ring that keeps touching marks apart (inline: a token var, not a class)
const RING = { boxShadow: '0 0 0 2px rgb(var(--qp-surface))' }

const colVars = computed(() => ({ '--ds-label': props.labelCol, '--ds-value': props.valueCol }))

const frac = (v) => {
  const [a, b] = props.domain
  return b === a ? 0 : Math.min(1, Math.max(0, (v - a) / (b - a)))
}
const pos = (v) => `${frac(v) * 100}%`
const span = (lo, hi) => `${(frac(hi) - frac(lo)) * 100}%`
const fmtTick = (t) => (props.tickFormat ? props.tickFormat(t) : String(t))

// keep the tooltip on screen near the ends of the axis
const tipStyle = (v) => {
  const f = frac(v)
  const left = `calc(${INSET}px + (100% - ${2 * INSET}px) * ${f})`
  if (f < 0.15) return { left, transform: 'translateX(-12px)' }
  if (f > 0.85) return { left, transform: 'translateX(calc(-100% + 12px))' }
  return { left }
}

const SHAPES = {
  dot: 'h-2.5 w-2.5 rounded-full bg-content',
  ring: 'h-2.5 w-2.5 rounded-full border-2 border-content bg-surface',
  diamond: 'h-2.5 w-2.5 rotate-45 border-2 border-content bg-surface',
  square: 'h-2.5 w-2.5 rounded-2 bg-content',
}
const shapeClass = (shape) => SHAPES[shape] ?? SHAPES.dot

// hollow shapes first, so a filled mark at the same place stays on top
const HOLLOW = new Set(['ring', 'diamond'])
const allRows = computed(() => props.rows.map((r) => ({
  ...r,
  label: r.label ?? '',
  points: [...(r.points ?? [])].sort((a, b) => (HOLLOW.has(b.shape) ? 1 : 0) - (HOLLOW.has(a.shape) ? 1 : 0)),
})))
const hasData = computed(() => props.rows.some((r) => !r.header && (r.points?.length ?? 0) > 0))

const active = ref(null)
</script>

<style scoped>
/* The row grid. Wide: label · plot · values. Narrow (under 640 px): the label and
   the values share a line, the plot takes the full width under them. Plain CSS
   because the columns come from props (CSS variables), which arbitrary-value
   classes in a layer component would not reliably reach a consumer's build. */
._row {
  display: grid;
  column-gap: 0.75rem;
  grid-template-columns: minmax(7rem, 1fr) auto;
}
._row ._plot { grid-column: 1 / -1; }
._axis { grid-template-columns: minmax(0, 1fr); }
._axis ._spacer { display: none; }
@media (min-width: 640px) {
  ._row { grid-template-columns: var(--ds-label) minmax(0, 1fr) var(--ds-value); }
  ._row ._plot { grid-column: auto; }
  ._row ._values { order: 3; }
  ._axis ._spacer { display: block; }
}
</style>
