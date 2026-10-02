<template>
  <!-- DataMachineMicro — a DataMachine shrunk to a summary cell (design c109):
       the same number its listing's machine shows, one altitude up, so an
       index page can hold a whole section's machines without inventing new
       metrics. Title · hairline · value + device, about 200 × 52.

       The protocol is a strict subset of DataMachine's, under the same names
       (title, val, unit, delta, deltaUnit, healthMode, to, #right), so a
       consumer maps a machine to its micro by deleting props, never renaming
       them. Everything that assumes room is gone: description, provenance,
       #below, #left, #title / #title-right, reserve, fadeKey, valueSize. A
       micro with a switcher freezes at its default view.

       Inside a DataMachineGroup it is the same 4-row subgrid a DataMachine is
       (title · hairline · description · body), with the description cell held
       empty, so micros (and machines, if a band mixes them) align their value
       rows through the group unchanged — the group needs no micro mode. Its
       `alignFooters` adds an empty 5th cell for the same reason.

       Standalone it always fills its container (block, w-full): a micro is a
       grid cell, and its device takes whatever the value leaves (the c100
       ruling, Mark 2026-09-30: the value takes min space, the drawing
       expands), so right edges line up down a column.

       As a card (`card`, or inherited from a DataIndexSection — Mark,
       2026-10-02, preset B of the c109 micro-cards thread) it sits on white
       with 12 px corners, 14 px padding and a soft two-layer shadow; a hairline
       border stands in for the shadow in dark mode, where shadows don't
       separate surfaces. In a group the padding insets the subgrid, so value
       rows still align and the cards in a row share one height. -->
  <component
    :is="linked ? NuxtLink : 'div'"
    :to="linked ? to : undefined"
    class="min-w-0 text-content"
    :class="[group ? (alignFooters ? 'grid row-span-5 grid-rows-subgrid' : 'grid row-span-4 grid-rows-subgrid') : 'block w-full', linked ? 'cursor-pointer hover:text-primary' : '', isCard ? 'rounded-12 bg-surface dark:border dark:border-stroke' : '']"
    :style="[group ? { marginTop: `${group.rowGap}px` } : {}, isCard ? CARD_STYLE : {}]"
    data-machine-micro :data-val="val" :data-card="isCard || undefined"
  >
    <!-- Title — one line, 14 px bold ink (12 px medium muted at first; 16 px flat, then 14 px on the card — Mark, c109 follow-ups); a long title truncates (the full
         text in its tooltip) rather than wrap, so a section's micros keep one
         height. #mark sits after the text and never truncates: a tiny glyph
         that qualifies the whole micro — headline and device both — such as
         the "projected" mark for a staged denominator (qdash R24). It is a
         slot on the title, not on #right, because the qualifier belongs to the
         name, and #right is usually taken by the device (Activity · Providers
         carries a spark AND the mark). -->
    <div class="flex min-w-0 items-center gap-1 text-14 leading-5 font-bold text-content">
      <span class="truncate" :title="title">{{ title }}</span>
      <span v-if="$slots.mark" class="flex shrink-0 items-center"><slot name="mark" /></span>
    </div>

    <!-- Hairline — DataMachine's signature, kept so a micro reads as a machine
         in miniature rather than as a table cell -->
    <div class="hairline mt-1 mb-1.5" />

    <!-- Description cell — micros have none; in a group an empty cell holds the
         subgrid row so a sibling DataMachine's description still sets it -->
    <div v-if="group" />

    <!-- Body — value + delta, then the device filling the rest of the row.
         items-center: the device centres on the 20 px numerals, which reads
         better than a top edge at this size. -->
    <div class="flex min-w-0 items-center gap-3">
      <!-- Value — omitted entirely when `val` is undefined (a device-only
           micro). `null` is loading, and renders an em-dash — never 0, never
           a spinner: honest states (qdash R31, design c108 D1). DataMetricValue's
           own null state is a padded spinner sized for a 40 px headline,
           which would make a loading micro taller than a loaded one. A feed
           that failed with nothing loaded is also `null` → "—"; the page's
           banner names the failure (c108 D2). -->
      <div v-if="hasVal" class="flex shrink-0 items-baseline gap-1.5">
        <span
          v-if="val === null"
          class="font-bold text-content-subtle"
          :style="{ fontSize: `${VALUE_SIZE}px`, lineHeight: 1.05 }"
          title="loading"
          data-loading
        >—</span>
        <template v-else>
          <DataMetricValue :val="val" :unit="unit" :size="VALUE_SIZE" weight="700" :healthMode="healthMode" />
          <DataMetricTrend v-if="delta != null" :change="delta" :unit="deltaUnit" :healthMode="healthMode" viewClass="--mini" />
        </template>
      </div>

      <!-- #right — the micro device (a thin DataSegmentBar, DataRankedBars
           `micro`, a 16 px DataMetricSpark…). The micro doesn't know which:
           the consumer composes it. Takes all remaining width (min-w-0 +
           flex-1) so a filling device stretches to the card edge. -->
      <div v-if="$slots.right" class="min-w-0 flex-1">
        <slot name="right" />
      </div>
    </div>

    <!-- alignFooters: an empty footer cell so the subgrid still spans the
         group's 5 rows -->
    <div v-if="alignFooters" />
  </component>
</template>

<script setup>
const props = defineProps({
  title      : { type: String, default: '' },          // the machine's name — truncates to one line
  val        : { default: undefined },                  // null = loading ("—"); omit for a device-only micro
  unit       : { type: String },                        // as DataMachine: 'bytes' | 'duration' | '%' | '$' (prefix) | any suffix
  delta      : { type: Number },                        // passed to DataMetricTrend as `change` (12 px)
  deltaUnit  : { type: String },                        // passed to DataMetricTrend as `unit`
  healthMode : { type: Function, default: healthModes.NEVER_HOT }, // shared across value + delta
  to         : { type: String, default: '_none_' },     // the whole card links (the micro's listing); '_none_' = static, as DataMachine
  card       : { type: Boolean, default: undefined },  // white card, rounded 12, soft shadow; unset = inherit from a DataIndexSection (cards on by default there), else flat
})

// The card (c109 preset B): 14 px padding and a quiet two-layer shadow — a
// 1 px contact edge and a wide low blur, lighter than _shadow-box's shadow-lg.
// Inline: arbitrary-value classes wouldn't reach the consumer's Tailwind scan.
const CARD_STYLE = { padding: '14px', boxShadow: '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 14px rgb(0 0 0 / 0.06)' }
const sectionRef = inject('dataIndexSection', null)
const isCard = computed(() => props.card ?? !!sectionRef?.value?.cards)

// One headline size: a micro has no valueSize — the scale is the component.
// 20 px bold numerals under a 14 px bold title (design c109; the title was 12 px medium until the follow-ups).
const VALUE_SIZE = 20

// Unlike DataMachine (a div + router.push, because its title slots host
// controls), a micro has no interactive content, so the whole card can be a
// real link: keyboard focus, middle-click and prefetch come with it.
const NuxtLink = resolveComponent('NuxtLink')
const linked = computed(() => !!props.to && props.to !== '_none_')

const hasVal = computed(() => props.val !== undefined)

// Same group contract as DataMachine: DataMachineGroup provides
// { rowGap, alignFooters }; re-provide null so nothing nested in #right
// mistakes itself for a group member.
const groupRef = inject('dataMachineGroup', null)
const group = computed(() => groupRef?.value ?? null)
const alignFooters = computed(() => !!group.value?.alignFooters)
provide('dataMachineGroup', null)
</script>
