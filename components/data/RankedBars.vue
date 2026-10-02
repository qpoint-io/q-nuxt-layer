<template>
  <!-- Fills its container by default (width '100%') — DataMachine #right is
       flex-1, so the device stretches to the card edge. A number pins px. -->
  <div
    v-if="rows.length"
    class="flex flex-col"
    :class="layout === 'stacked' ? 'gap-2' : 'gap-1'"
    :style="{ width: fill ? '100%' : cssLength(width) }"
    data-ranked-bars :data-layout="micro ? 'micro' : layout"
  >
    <template v-if="micro && microLabels === 'beside' && !bare">
      <!-- Micro, labels beside (design c109, "small labels on the roll
           downs"): the top 3 as hairline meters, each with its name in a
           column to its left — 10 px Inter bold (Mark: a tick under the
           scale's 11 px floor, and the sans fits more of an id than mono, so
           `mono` doesn't apply here), one 11 px line per row with 2 px
           between, so the three rows sit inside a micro's value height plus a
           line. The label column is as wide as the longest label, capped at
           45 % of the device (the full label and share are in the row's
           tooltip). Inline font-size: the layer scale has no 10. -->
      <div class="grid items-center gap-x-1.5 gap-y-0.5" :style="{ gridTemplateColumns: 'fit-content(45%) minmax(0, 1fr)' }">
        <template v-for="(r, i) in rows" :key="`${i}-${r.label}`">
          <span class="flex min-w-0 items-center gap-1 font-bold text-content-muted" :style="{ fontSize: '10px', lineHeight: '11px' }" :title="rowTitle(r)">
            <span v-if="r.mark" class="h-1.5 w-1.5 shrink-0 rounded-full" :style="{ background: resolveColor(r.mark) }" :data-mark="r.mark" />
            <span class="truncate" data-ranked-label>{{ r.label }}</span>
          </span>
          <div class="relative w-full overflow-hidden rounded-full bg-stroke" :style="{ height: '3px' }" :title="rowTitle(r)">
            <div class="absolute inset-y-0 left-0 bg-content" :style="{ width: `${barPct(r)}%` }" />
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="micro">
      <!-- Micro (design c109): the at-a-glance form for a DataMachineMicro
           #right, where the problem is selection, not labelling (c100's
           lever-strip ruling) — pass the top row only and it reads as one
           line, label · share, over a 3 px meter (the share of the whole on a
           hairline track), about as tall as the micro's 20 px numerals.
           `bare` drops the text line: hairline bars only (pass the top 3 for
           the shape of the concentration), each row's label and share kept
           in its tooltip. Inline style for the 3 px: an arbitrary-value class
           wouldn't reach the consumer's Tailwind scan. -->
      <div
        v-for="(r, i) in rows" :key="`${i}-${r.label}`"
        class="flex min-w-0 flex-col"
        :title="rowTitle(r)"
      >
        <div v-if="!bare" class="flex min-w-0 items-baseline gap-1.5 text-11 leading-4">
          <span v-if="r.mark" class="h-1.5 w-1.5 shrink-0 self-center rounded-full" :style="{ background: resolveColor(r.mark) }" :data-mark="r.mark" />
          <span class="min-w-0 flex-1 truncate text-content" :class="mono ? 'font-mono' : ''" data-ranked-label>{{ r.label }}</span>
          <span class="shrink-0 tabular-nums font-semi text-content-muted" data-ranked-pct>{{ r.pct }} %</span>
        </div>
        <div class="relative w-full overflow-hidden rounded-full bg-stroke" :class="bare ? '' : 'mt-px'" :style="{ height: '3px' }">
          <div class="absolute inset-y-0 left-0 bg-content" :style="{ width: `${barPct(r)}%` }" />
        </div>
      </div>
    </template>
    <template v-else-if="layout === 'stacked'">
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
           for short names (teams, harnesses, hosts). Long labels truncate.
           labelWidth 'auto' (Mark, 2026-10-02 — qdash Activity): one grid
           shared by every row (each row a subgrid), its label column as wide
           as the longest label, capped at 45 % — the bars take the rest. -->
      <div :class="autoLabel ? 'grid items-center gap-x-2 gap-y-1' : 'contents'" :style="autoLabel ? { gridTemplateColumns: inlineCols } : undefined">
        <div
          v-for="(r, i) in rows" :key="`${i}-${r.label}`"
          class="grid items-center gap-2 text-12 text-content-muted"
          :style="autoLabel ? { gridColumn: '1 / -1', gridTemplateColumns: 'subgrid' } : { gridTemplateColumns: inlineCols }"
          :title="rowTitle(r)"
        >
          <span class="truncate" :class="[mono ? 'font-mono' : '', isThin ? 'leading-tight' : '']" data-ranked-label>{{ r.label }}</span>
          <!-- mark column only when some row carries one; an unmarked row keeps the column empty -->
          <span v-if="hasMarks" class="h-2 w-2 rounded-2" :style="r.mark ? { background: resolveColor(r.mark) } : undefined" :data-mark="r.mark" />
          <div :class="isThin ? '' : 'h-4'"><UxPercentBar :title="r.display ?? compact.format(r.value)" :percent="barPct(r)" compact solid :titlePosition="valuePosition" :thin="isThin" :titleSize="10" /></div>
        </div>
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
  <!-- micro, empty: the empty track DataSegmentBar draws, not a second em-dash
       beside the micro's own "—" (a loading micro would read "— —") -->
  <div v-else-if="micro" class="h-px w-full bg-stroke" title="nothing to rank" data-ranked-bars data-empty />
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
// `micro` (design c109): the DataMachineMicro rendering — one line per row,
// label · share, over a 3 px meter; `bare` keeps only the meters. The
// micro the index uses is `bare`, the top 3 (Mark, design c109 2026-10-02);
// the top row alone (selection, not labelling) is the alternative; `bare`
// with the top 3 is the label-free alternative. `microLabels: 'beside'` (c109,
// trying small labels on the index's roll downs) puts a 10 px bold name left of
// each meter instead of on a line above it. Unset, nothing changes.
//
// `width`: any CSS length ('100%' default — fill whatever it's placed in),
// or a number for px. `fill` is the older spelling of width '100%'.
const props = defineProps({
  rows       : { type: Array, required: true },     // [{ label, value, pct, display?, mark?, title? }] — pct 0–100, share of the whole
  width      : { type: [Number, String], default: '100%' }, // CSS length, or number = px
  labelWidth : { type: [Number, String], default: 84 }, // px label column, inline layout only; 'auto' = fit the longest label (≤ 45 %), bars fill the rest
  mono       : { type: Boolean, default: true },    // labels in the mono face (ids); false for people / team names
  layout     : { type: String, default: 'inline' }, // 'inline' | 'stacked'
  fill       : { type: Boolean, default: false },   // legacy — same as width '100%'
  scale      : { type: String, default: 'whole' },  // 'whole' (bar = share of the whole) | 'max' (top row = full bar)
  legend     : { type: Array, default: () => [] },  // [{ title, color }] — keys the row marks
  valuePosition : { type: String, default: 'inside' }, // 'inside' (value over the bar) | 'left' | 'right' (own column before / after the bar)
  thin       : { type: Boolean, default: false },   // half-height bars + compact rows; needs valuePosition left/right (ignored inside)
  micro      : { type: Boolean, default: false },   // DataMachineMicro form: label · share on one line over a 3 px meter (pass the top row); overrides layout
  bare       : { type: Boolean, default: false },   // micro only: no text line — hairline bars, label + share in the tooltip
  microLabels: { type: String, default: 'over' },   // micro only: 'over' (label · share on a line above each meter) | 'beside' (a 10 px bold sans label left of each meter, the top 3 in ~37 px)
})

// thin = half-height bars AND compact rows (tight label leading, no 16 px bar
// wrapper) — only with a side value; inside needs the full bar behind it
const isThin = computed(() => props.thin && props.valuePosition !== 'inside')

const hasMarks = computed(() => props.rows.some(r => r.mark))
const autoLabel = computed(() => props.labelWidth === 'auto')
const inlineCols = computed(() => {
  const label = autoLabel.value ? 'fit-content(45%)' : `${props.labelWidth}px`
  const bar = autoLabel.value ? 'minmax(0, 1fr)' : '1fr'
  return hasMarks.value ? `${label} 8px ${bar}` : `${label} ${bar}`
})
const rowTitle = r => r.title ?? `${r.label}: ${r.pct}% of the whole`

const cssLength = w => typeof w === 'number' ? `${w}px` : w

const maxPct = computed(() => Math.max(0, ...props.rows.map(r => r.pct)))
const barPct = r => props.scale === 'max' && maxPct.value > 0 ? (r.pct / maxPct.value) * 100 : r.pct

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
</script>
