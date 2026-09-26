<template>
  <!-- Fills its container by default (width '100%') — DataMachine #right is
       flex-1, so the device stretches to the card edge. A number pins px. -->
  <div
    v-if="rows.length"
    class="flex flex-col"
    :class="layout === 'stacked' ? 'gap-2' : 'gap-1'"
    :style="{ width: fill ? '100%' : cssLength(width) }"
    data-ranked-bars :data-layout="layout"
  >
    <template v-if="layout === 'stacked'">
      <!-- Stacked: the label owns a full line (nothing truncates — id-shaped
           labels read whole), the bar takes the full width beneath it with
           the share at its right end in text tokens. -->
      <div
        v-for="(r, i) in rows" :key="`${i}-${r.label}`"
        class="flex flex-col gap-0.5 text-12 text-content-muted"
        :title="rowTitle(r)"
      >
        <span class="flex items-baseline gap-1.5">
          <span v-if="r.mark" class="h-2 w-2 shrink-0 self-center rounded-2" :style="{ background: resolveColor(r.mark) }" :data-mark="r.mark" />
          <span class="break-words leading-tight text-content" :class="mono ? 'font-mono' : ''" data-ranked-label>{{ r.label }}</span>
        </span>
        <div class="flex items-center gap-2">
          <div class="min-w-0 flex-1" :class="isThin ? '' : 'h-4'"><UxPercentBar :title="r.display ?? compact.format(r.value)" :percent="barPct(r)" compact solid :titlePosition="valuePosition" :thin="isThin" :titleSize="10" /></div>
          <span class="w-8 shrink-0 text-right tabular-nums font-semi text-content-subtle" data-ranked-pct>{{ r.pct }} %</span>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- Inline: label beside the bar in a fixed column — the compact form
           for short names (teams, harnesses, hosts). Long labels truncate. -->
      <div
        v-for="(r, i) in rows" :key="`${i}-${r.label}`"
        class="grid items-center gap-2 text-12 text-content-muted"
        :style="{ gridTemplateColumns: hasMarks ? `${labelWidth}px 8px 1fr` : `${labelWidth}px 1fr` }"
        :title="rowTitle(r)"
      >
        <span class="truncate" :class="[mono ? 'font-mono' : '', isThin ? 'leading-tight' : '']" data-ranked-label>{{ r.label }}</span>
        <!-- mark column only when some row carries one; an unmarked row keeps the column empty -->
        <span v-if="hasMarks" class="h-2 w-2 rounded-2" :style="r.mark ? { background: resolveColor(r.mark) } : undefined" :data-mark="r.mark" />
        <div :class="isThin ? '' : 'h-4'"><UxPercentBar :title="r.display ?? compact.format(r.value)" :percent="barPct(r)" compact solid :titlePosition="valuePosition" :thin="isThin" :titleSize="10" /></div>
      </div>
    </template>

    <!-- Legend — the key for the marks (a color needs one); same swatch
         treatment as DataSegmentBar's legend -->
    <div v-if="legend.length" class="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-11 text-content-muted" data-ranked-legend>
      <span v-for="l in legend" :key="l.title" class="flex items-center gap-1">
        <span class="h-2 w-2 shrink-0 rounded-2" :style="{ background: resolveColor(l.color) }" />{{ l.title }}
      </span>
    </div>
  </div>
  <span v-else class="text-13 text-content-subtle" title="nothing to rank" data-ranked-bars data-empty>—</span>
</template>

<script setup>
import { resolveColor } from './palette'

// DataRankedBars (design c92 listing-viz → day-series §A) — the "Ranked
// share" DataMachine preset: compact UxPercentBar rows in one hue, each bar
// the item's share of the whole (not of the max), so the rows read as the
// concentration the card's provenance names ("top 3 = 62 % of spend").
// Rows arrive ranked with their share already computed — the consumer's
// rollup (qdash lib/actor-bands.shareOf) owns the arithmetic; this only
// draws. Rows are keyed by index + label — two rows may share a label (two
// sessions by one user · agent, two workspaces with one basename). Empty →
// an em-dash, never a placeholder.
//
// `layout`: 'inline' puts the label in a fixed column beside the bar (short
// names); 'stacked' gives the label its own line above a full-width bar with
// the share at the right end, so id-shaped labels (model ids, hostnames,
// workspace paths) never truncate.
//
// `scale`: 'whole' (default) draws each bar as its share of the whole — the
// length matches the "top 3 = N %" provenance; 'max' draws the top row full
// width and the rest relative to it, for reading rank gaps. The stacked
// layout's % label stays the share of the whole either way.
//
// `mark` (per row): a color token or raw CSS — a status dot between label and
// bar (inline) or before the label (stacked), for a second channel on a row
// ("every install monitored" vs "has shadow installs"). The dot column only
// appears when some row has a mark. `legend` keys the marks: [{ title, color }].
// `title` (per row) replaces the default "label: N% of the whole" tooltip —
// for rows whose pct isn't a share (a count scaled to the max).
//
// `width`: any CSS length ('100%' default — fill whatever it's placed in),
// or a number for px. `fill` is the older spelling of width '100%'.
const props = defineProps({
  rows       : { type: Array, required: true },     // [{ label, value, pct, display?, mark?, title? }] — pct 0–100, share of the whole
  width      : { type: [Number, String], default: '100%' }, // CSS length, or number = px
  labelWidth : { type: Number, default: 84 },       // px label column, inline layout only
  mono       : { type: Boolean, default: true },    // labels in the mono face (ids); false for people / team names
  layout     : { type: String, default: 'inline' }, // 'inline' | 'stacked'
  fill       : { type: Boolean, default: false },   // legacy — same as width '100%'
  scale      : { type: String, default: 'whole' },  // 'whole' (bar = share of the whole) | 'max' (top row = full bar)
  legend     : { type: Array, default: () => [] },  // [{ title, color }] — keys the row marks
  valuePosition : { type: String, default: 'inside' }, // 'inside' (value over the bar) | 'left' | 'right' (own column before / after the bar)
  thin       : { type: Boolean, default: false },   // half-height bars + compact rows; needs valuePosition left/right (ignored inside)
})

// thin = half-height bars AND compact rows (tight label leading, no 16 px bar
// wrapper) — only with a side value; inside needs the full bar behind it
const isThin = computed(() => props.thin && props.valuePosition !== 'inside')

const hasMarks = computed(() => props.rows.some(r => r.mark))
const rowTitle = r => r.title ?? `${r.label}: ${r.pct}% of the whole`

const cssLength = w => typeof w === 'number' ? `${w}px` : w

const maxPct = computed(() => Math.max(0, ...props.rows.map(r => r.pct)))
const barPct = r => props.scale === 'max' && maxPct.value > 0 ? (r.pct / maxPct.value) * 100 : r.pct

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
</script>
