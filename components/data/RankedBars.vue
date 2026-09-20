<template>
  <!-- Fixed width in both layouts: a flex child (DataMachine #right) has no
       intrinsic width, so the consumer sizes the device to its card — a
       third-column card beside a wide value wants ~150, not the default. -->
  <div
    v-if="rows.length"
    class="flex flex-col"
    :class="layout === 'stacked' ? 'gap-2' : 'gap-1'"
    :style="{ width: `${width}px` }"
    data-ranked-bars :data-layout="layout"
  >
    <template v-if="layout === 'stacked'">
      <!-- Stacked: the label owns a full line (nothing truncates — id-shaped
           labels read whole), the bar takes the full width beneath it with
           the share at its right end in text tokens. -->
      <div
        v-for="(r, i) in rows" :key="`${i}-${r.label}`"
        class="flex flex-col gap-0.5 text-11 text-content-muted"
        :title="`${r.label}: ${r.pct}% of the whole`"
      >
        <span class="break-words leading-tight text-content" :class="mono ? 'font-mono' : ''" data-ranked-label>{{ r.label }}</span>
        <div class="flex items-center gap-2">
          <div class="h-4 min-w-0 flex-1"><UxPercentBar :title="r.display ?? compact.format(r.value)" :percent="r.pct" compact /></div>
          <span class="shrink-0 tabular-nums font-semi text-content-subtle" data-ranked-pct>{{ r.pct }} %</span>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- Inline: label beside the bar in a fixed column — the compact form
           for short names (teams, harnesses, hosts). Long labels truncate. -->
      <div
        v-for="(r, i) in rows" :key="`${i}-${r.label}`"
        class="grid items-center gap-2 text-11 text-content-muted"
        :style="{ gridTemplateColumns: `${labelWidth}px 1fr` }"
        :title="`${r.label}: ${r.pct}% of the whole`"
      >
        <span class="truncate" :class="mono ? 'font-mono' : ''" data-ranked-label>{{ r.label }}</span>
        <div class="h-4"><UxPercentBar :title="r.display ?? compact.format(r.value)" :percent="r.pct" compact /></div>
      </div>
    </template>
  </div>
  <span v-else class="text-13 text-content-subtle" title="nothing to rank" data-ranked-bars data-empty>—</span>
</template>

<script setup>
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
defineProps({
  rows       : { type: Array, required: true },     // [{ label, value, pct, display? }] — pct 0–100, share of the whole
  width      : { type: Number, default: 190 },      // px — a flex child (DataMachine #right) has no intrinsic width; size it to the card
  labelWidth : { type: Number, default: 84 },       // px label column, inline layout only
  mono       : { type: Boolean, default: true },    // labels in the mono face (ids); false for people / team names
  layout     : { type: String, default: 'inline' }, // 'inline' | 'stacked'
})

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
</script>
