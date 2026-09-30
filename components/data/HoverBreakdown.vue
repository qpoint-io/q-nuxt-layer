<template>
  <!-- A pointer-following card that breaks a row's number and drawing down into
       the items it's made of (people, devices, findings) — extracted from design
       c100's lever strip. The frame is shared; the consumer brings the data and
       two slots:
         #summary="{ width }" — a full-width drawing over the list (width = all columns)
         #row="{ item, index }" — one person, laid out in a 16 px row
       `metric` ({ label, value }) puts the main datapoint big in the upper right.
       The list flows into columns (down, then across) of ~rowsPerCol, widening
       the card up to the window. It sits above the pointer when it fits (so the
       rows being scanned stay visible), else below, always inside the window —
       placed from its measured height. Without items it's a plain tooltip. -->
  <div
    ref="el"
    class="pointer-events-none fixed z-50 rounded-8 border border-stroke bg-surface px-3 pt-2 shadow-lg text-12"
    :style="style"
  >
    <!-- header: the title left, the main datapoint in the upper right — the
         value, big, its label under it -->
    <div class="flex items-start justify-between gap-4">
      <!-- one line: never wraps; a title longer than the card ends in an ellipsis -->
      <div class="min-w-0 truncate font-bold text-content leading-tight" :style="{ fontSize: `${titleSize}px` }">{{ title }}</div>
      <div v-if="metric" class="shrink-0 flex flex-col items-end">
        <span class="font-bold text-content leading-tight" :style="{ fontSize: `${metricSize}px` }">{{ metric.value }}</span>
        <span class="text-content-muted" style="line-height: 16px">{{ metric.label }}</span>
      </div>
    </div>
    <!-- context lines: tight 16 px leading, a small gap under the header -->
    <div v-for="(line, i) in lines" :key="i" class="text-content-muted" :class="i === 0 ? 'mt-1' : ''" style="line-height: 16px">{{ line }}</div>
    <template v-if="rich">
      <div v-if="$slots.summary" class="mt-2"><slot name="summary" :width="summaryWidth" /></div>
      <template v-if="items.length">
        <div class="hairline my-1.5" />
        <div class="grid" :style="grid">
          <div v-for="(item, i) in items" :key="item.key ?? i" class="flex min-w-0 items-center gap-2" style="height: 16px">
            <slot name="row" :item="item" :index="i" />
          </div>
        </div>
      </template>
      <div v-if="footer" class="mt-1 text-content-subtle">{{ footer }}</div>
    </template>
  </div>
</template>

<script setup>
// DataHoverBreakdown — extracted from design c100 (lever-strip variations,
// 2026-09-30): title 28 px, main datapoint in the upper right, tight context
// lines, the list in columns with air between, above the pointer. Render it
// with v-if while hovering and feed it the pointer's clientX / clientY.

const props = defineProps({
  x          : { type: Number, required: true }, // pointer clientX
  y          : { type: Number, required: true }, // pointer clientY
  title      : { type: String, default: '' },
  titleSize  : { type: Number, default: 28 },
  metric     : { type: Object, default: null },  // { label, value } — the main datapoint, big, upper right
  metricSize : { type: Number, default: 22 },
  lines      : { type: Array, default: () => [] }, // header lines under the title
  items      : { type: Array, default: () => [] }, // the people, in reading order
  footer     : { type: String, default: '' },
  colWidth   : { type: Number, default: 240 },
  rowsPerCol : { type: Number, default: 12 },
  colGap     : { type: Number, default: 28 },
  plainWidth : { type: Number, default: 260 },  // max width without items
  maxWidth   : { type: Number, default: null }, // cap on the card's width (default: the window); the title only truncates once it's reached
})

const slots = useSlots()
const rich = computed(() => props.items.length > 0 || !!slots.summary)

// ── columns: ~rowsPerCol per column, as many columns as the window allows ──
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const vh = ref(typeof window !== 'undefined' ? window.innerHeight : 900)
const onResize = () => { vw.value = window.innerWidth; vh.value = window.innerHeight }
// the widest the card may be: the maxWidth prop, never past the window
const cap = computed(() => Math.min(vw.value - 16, props.maxWidth ?? Infinity))
const layout = computed(() => {
  const n = props.items.length
  if (!n) return { cols: 1, rows: 0, inner: Math.max(props.colWidth, props.plainWidth - 24) }
  const maxCols = Math.max(1, Math.floor((cap.value - 2 - 24 + props.colGap) / (props.colWidth + props.colGap)))
  const cols = Math.max(1, Math.min(maxCols, Math.ceil(n / props.rowsPerCol)))
  const rows = Math.ceil(n / cols)
  return { cols, rows, inner: cols * props.colWidth + (cols - 1) * props.colGap }
})
const grid = computed(() => ({
  columnGap: `${props.colGap}px`,
  gridAutoFlow: 'column',
  gridTemplateRows: `repeat(${layout.value.rows}, 16px)`,
  gridTemplateColumns: `repeat(${layout.value.cols}, ${props.colWidth}px)`,
}))

// ── placement from the measured height ──────────────────────────────
const el = ref(null)
const h = ref(0)
const w = ref(0)
const measure = () => { h.value = el.value?.offsetHeight ?? 0; w.value = el.value?.offsetWidth ?? 0 }
let ro = null
onMounted(() => {
  window.addEventListener('resize', onResize)
  ro = new ResizeObserver(measure)
  ro.observe(el.value)
  measure()
})
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); ro?.disconnect() })
watch(() => [props.title, props.items.length], () => nextTick(measure))
// the summary drawing spans the card as it ends up — at least the columns, wider
// when a long title (or footer) widened the card
const summaryWidth = computed(() => Math.max(layout.value.inner, (w.value || 0) - 26))

// the card sizes to its content — at least as wide as its columns, wider for a
// longer title — up to the cap, where the one-line title starts to truncate
const style = computed(() => {
  const minW = rich.value ? layout.value.inner + 24 + 2 : null
  const maxW = rich.value ? cap.value : Math.min(props.plainWidth, cap.value)
  const est = h.value || 80 + (props.metric ? 30 : 0) + props.lines.length * 18 + (rich.value ? 60 + layout.value.rows * 16 : 0)
  const width = w.value || minW || props.plainWidth
  // above the pointer when it fits, so the rows being scanned stay visible;
  // else below; always inside the window (taller than it, it clips — it
  // follows the pointer, so it can't scroll)
  const above = props.y - 14 - est
  const top = above >= 8 ? above : Math.max(8, Math.min(props.y + 14, vh.value - est - 8))
  return {
    left: `${Math.max(8, Math.min(props.x + 14, vw.value - width - 8))}px`,
    top: `${top}px`,
    paddingBottom: '14px',
    maxHeight: `${vh.value - 16}px`,
    overflow: 'hidden',
    ...(minW ? { minWidth: `${minW}px` } : {}),
    maxWidth: `${maxW}px`,
  }
})
</script>
