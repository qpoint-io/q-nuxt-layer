<template>
  <div
    class="inline-flex max-w-full"
    :class="legend === 'beside' ? 'flex-row items-center gap-5' : 'flex-col gap-2'"
    :style="{ width: `${width}px` }"
    data-segment-bar :data-total="total"
  >

    <!-- Bar — segments proportional to value, a `gap`-px surface gap between
         touching fills (the marks spec: the gap separates, never a stroke).
         Zero-value segments are dropped from the bar (they'd only add a gap)
         but stay in the legend. Empty → a hairline track, no segments. -->
    <div
      class="flex w-full shrink-0 overflow-hidden rounded-3"
      :style="{ height: `${height}px`, gap: `${gap}px` }"
      role="img" :aria-label="ariaLabel"
    >
      <template v-if="total > 0">
        <div
          v-for="seg in drawn" :key="seg.key"
          class="min-w-0"
          :class="seg.outline ? 'border border-stroke-strong' : ''"
          :style="{ flex: `${seg.value} 1 0%`, background: seg.outline ? 'transparent' : seg.fill }"
          :title="`${seg.title}: ${seg.display}`"
        />
      </template>
      <div v-else class="h-px w-full self-center bg-stroke" />
    </div>

    <!-- Legend — title + value in text tokens; the swatch carries the color.
         Two or more series need one (the dependable identity channel); pass
         `legend="none"` only when the composition owns its own legend (a
         stack of per-row bars with one shared key). -->
    <div
      v-if="legend !== 'none' && shown.length"
      class="flex"
      :class="legend === 'beside' ? 'flex-col gap-1' : 'flex-row flex-wrap gap-x-4 gap-y-1'"
    >
      <div v-for="seg in shown" :key="seg.key" class="flex items-center gap-1.5 whitespace-nowrap text-12 text-content-muted" :data-value="seg.value">
        <span
          class="h-2.5 w-2.5 shrink-0 rounded-2"
          :class="seg.outline ? 'border border-stroke-strong' : ''"
          :style="{ background: seg.outline ? 'transparent' : seg.fill }"
        />
        <span class="font-semi text-content">{{ seg.display }}</span>
        <span>{{ seg.title }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
// DataSegmentBar (design c92 listing-viz) — a horizontal 100 % bar of named
// segments: a whole with 3–6 parts, where the parts sum to the headline the
// card shows. Values in, not percents — the component normalizes, so the
// consumer passes the same numbers the card and the table show.
//
// Colors resolve exactly as DataDonutChart's do (token role → live CSS var,
// else raw CSS). With no colors: identity series take the three validated
// categorical slots and a 4th+ segment folds into "Other"; `ordinal` steps
// one hue light → dark by index for ordered scales (freshness, intensity).
// `color: 'outline'` draws a bordered empty segment (the presence
// vocabulary's "stopped").
import { resolveColor, resolveCategoricalColor, ordinalColor, FOLD_COLOR } from './palette'

const FOLD_AT = 3
const OTHER_TITLE = 'Other'

const props = defineProps({
  items   : { type: Array, required: true },         // [{ title, value, color?, display? }]
  width   : { type: Number, default: 200 },          // bar width in px (a flex child has no intrinsic width)
  height  : { type: Number, default: 16 },           // bar height in px
  gap     : { type: Number, default: 2 },            // surface gap between fills in px
  legend  : { type: String, default: 'below' },      // 'below' | 'beside' | 'none'
  ordinal : { type: Boolean, default: false },       // one hue stepped light → dark by index
})

// SSR renders light; flip to the real scheme after mount (same gate as
// DataHistoryGraph — the literal-hex palettes aren't CSS vars, so nothing
// but this ref makes them theme-reactive).
const { colorScheme } = useColorScheme()
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const activeScheme = computed(() => mounted.value ? colorScheme.value : 'light')

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const num = (v) => Number(v) || 0

// Identity fold: the categorical slots are three, so uncolored items past
// the third uncolored one fold into "Other". Explicitly colored items never
// fold and don't consume a slot — a consumer that names and colors a part
// (cache write in stroke-strong beside three identity parts) keeps it.
const folded = computed(() => {
  const items = props.items.map((it) => ({ ...it, value: Math.max(0, num(it.value)) }))
  if (props.ordinal) return items
  let uncolored = 0
  const kept = []
  let other = 0
  for (const it of items) {
    if (it.color) { kept.push(it); continue }
    if (uncolored < FOLD_AT) { kept.push(it); uncolored++ } else other += it.value
  }
  if (uncolored < FOLD_AT || items.filter((it) => !it.color).length <= FOLD_AT) return items
  return [...kept, { title: OTHER_TITLE, value: other, color: FOLD_COLOR }]
})

const total = computed(() => folded.value.reduce((n, it) => n + it.value, 0))

const shown = computed(() => {
  const n = folded.value.length
  let slot = 0
  return folded.value.map((it, i) => {
    const outline = it.color === 'outline'
    const fill = outline
      ? null
      : props.ordinal
        ? (it.color ? resolveColor(it.color) : ordinalColor(i, n, activeScheme.value))
        : (it.color ? resolveColor(it.color) : resolveCategoricalColor(null, slot++, activeScheme.value))
    return {
      key: `${i}-${it.title}`,
      title: it.title,
      value: it.value,
      display: it.display ?? compact.format(it.value),
      fill,
      outline,
    }
  })
})

const drawn = computed(() => shown.value.filter((s) => s.value > 0))

const ariaLabel = computed(() => total.value > 0
  ? shown.value.map((s) => `${s.title}: ${s.display}`).join(', ')
  : 'no data')
</script>
