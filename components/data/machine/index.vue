<template>
  <!-- Inside a DataMachineGroup the card is a 4-row subgrid of the group's
       grid (title · hairline · description · body), so each row is as tall as
       its tallest sibling cell: a missing or wrapped description keeps the
       value rows aligned across the band, and a description row no card fills
       collapses to zero. The body (main row + provenance + spark) is one cell,
       so a tall device in one card doesn't push its siblings' provenance away
       from their values. Standalone it's an inline-block. -->
  <div
    :class="[group ? 'grid row-span-4 grid-rows-subgrid' : 'inline-block', to !== '_none_' ? 'cursor-pointer hover:text-primary' : '']"
    :style="group ? { marginTop: `${group.rowGap}px` } : undefined"
    data-machine :data-val="val" @click="onClick">

    <!-- Title — with #title-right the row becomes title · slot, space-between, so
         a control (e.g. a UxSelectInline view switcher) sits at the card's right
         edge on the title's baseline. In a card too narrow for both, the slot
         wraps under the title and stays right-aligned (ml-auto), capped at the
         card's width (min-w-0 here, max-w-full on the slot) so a long control
         can truncate rather than overflow. Clicks inside the slot don't reach the card's
         `to`. Without the slot the title renders exactly as before. -->
    <div v-if="$slots['title-right']" class="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <div class="min-w-0 font-bold text-content text-20" :style="titleSize ? `font-size:${titleSize}px` : ''">
        {{ title }}
      </div>
      <div class="ml-auto min-w-0 max-w-full shrink-0" @click.stop>
        <slot name="title-right" />
      </div>
    </div>
    <div v-else class="font-bold text-content text-20" :style="titleSize ? `font-size:${titleSize}px` : ''">
      {{ title }}
    </div>

    <!-- Hairline — spans the full width of the card, independent of DataMetricLabel's
         own label-tied hairline (that one only ever matches its label's text width). -->
    <div class="hairline mt-1 mb-2" />

    <!-- Description — in a group an empty cell holds the row (zero height,
         no margin) so a sibling's description sets it -->
    <div v-if="description" class="-mt-1.5 text-content-muted text-14 mb-3" :style="descriptionSize ? `font-size:${descriptionSize}px` : ''">
      {{ description }}
    </div>
    <div v-else-if="inGroup" />

    <!-- Body — main row, provenance, spark: one subgrid cell -->
    <div>
      <!-- Main row -->
      <div class="flex items-start gap-3">
        <div v-if="$slots.left" :style="slotGap ? `margin-right:${slotGap}px` : ''">
          <slot name="left" />
        </div>

        <!-- Value group — omitted entirely when no `val` is passed, so a card can
             be a device alone (a ranked list that IS the story, with nothing to
             headline). `null` still means loading. -->
        <div v-if="hasVal" class="flex items-baseline gap-2">
          <DataMetricValue :val="val" :unit="unit" :size="valueSize" :healthMode="healthMode" :showFullNumber="showFullNumber" />
          <DataMetricTrend v-if="delta != null" :change="delta" :unit="deltaUnit" :healthMode="healthMode" />
        </div>

        <!-- #right takes all remaining row space (min-w-0 + flex-1), with or
             without a value, so a consumer's `w-full` device fills to the card edge;
             ml-3 on top of the row gap-3 gives it breathing room from the value -->
        <div v-if="$slots.right" class="min-w-0 flex-1" :class="hasVal ? 'ml-3' : ''" :style="slotGap ? `margin-left:${slotGap}px` : ''">
          <slot name="right" />
        </div>
      </div>

      <!-- #below — full-width content under the main row, above the footer
           (e.g. a ranked list that wants the card's whole width) -->
      <div v-if="$slots.below" class="mt-3">
        <slot name="below" />
      </div>

      <!-- Provenance / context row — hairline above, italic, a step below
           the description so it reads as a footnote to the value -->
      <div v-if="provenance" class="mt-2">
        <div class="hairline mb-1.5" />
        <div class="text-12 leading-snug italic text-content-subtle">
          {{ provenance }}
        </div>
      </div>

      <!-- Sparkline -->
      <DataMetricSpark
        v-if="spark"
        class="h-[30px] mt-2"
        :data="spark"
        fillColor="none"
        :strokeColor="sparkInk"
        strokeWidth="2"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title           : { type: String, required: true },
  titleSize       : { type: Number },              // font-size override
  description     : { type: String },
  descriptionSize : { type: Number },              // font-size override

  val             : { default: undefined },        // passed straight to DataMetricValue; null shows loading; omit for a device-only card (no headline number)
  valueSize       : { type: Number, default: 40 }, // matches DataMetricValue's own default
  unit            : { type: String },              // 'bytes' | 'duration' | 'ms' | '%' | any custom string
  showFullNumber  : { type: Boolean, default: false }, // passed to DataMetricValue — money and exact counts must not abbreviate (1956.24, not 2k)

  delta           : { type: Number },              // passed to DataMetricTrend as `change`
  deltaUnit       : { type: String },              // passed to DataMetricTrend as `unit`

  healthMode      : { type: Function, default: healthModes.NEVER_HOT }, // shared across value + delta

  provenance      : { type: String },
  spark           : { type: Array },

  slotGap         : { type: Number }, // extra px gap between #left/#right slot content and the main value/delta group

  to              : { type: String, default: '_none_' }, // click-to-navigate, mirrors DataMetric_Base's `to` prop
})

// DataMachineGroup provides { rowGap }; re-provide null so a DataMachine
// nested in this one's slots lays out on its own.
const groupRef = inject('dataMachineGroup', null)
const group = computed(() => groupRef?.value ?? null)
const inGroup = computed(() => !!group.value)
provide('dataMachineGroup', null)

// device-only card: no `val` prop at all (undefined). `null` is still loading.
const hasVal = computed(() => props.val !== undefined)

// theme-reactive sparkline ink (SVG chart — needs a resolved color)
const sparkInk = useTokenColor('primary')

const router = useRouter()

const onClick = () => {
  if (props.to !== '_none_') {
    router.push(props.to)
  }
}
</script>
