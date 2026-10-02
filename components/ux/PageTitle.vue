<template>
  <!-- In a sticky band (design c106) the root is a sticky box: at rest an
       ordinary block at its natural height; once it reaches the pin line it
       freezes at that same height and the title restyles inside it, so the
       page's flow never changes; unpinning settles — the box stays frozen
       while the title eases back to its rest size, then releases. Outside a
       band it is a plain block, as it always was. -->
  <div
    ref="box"
    :class="[joined ? '_band sticky z-30' : '', pinned ? '_pinned pointer-events-none' : '', pinned || settling ? '_moving' : '']"
    :style="joined ? { top: `${B.pinTop}px`, height: (pinned || settling) && restH ? `${restH}px` : undefined } : undefined"
  >

    <!-- Optional back link — in normal flow so it clears titles of any size -->
    <div
      v-if="backText && !pinned"
      @click="$emit('back')"
      class="w-fit mb-1 flex gap-1 items-center cursor-pointer group font-med text-12 text-primary hover:text-content"
    >
      <UxIcon id="arrow-right" class="w-[6px] rotate-180" />
      {{ backText }}
    </div>

    <div
      class="_row flex gap-px24 whitespace-nowrap pointer-events-auto"
      :style="rowStyle"
    >
      <div class="_rule grow border-b border-stroke-strong pb-3 flex items-end">
        <!-- Main slot -->
        <div class="flex items-baseline gap-2 font-bold text-15 grow">

          <!-- Breadcrumb trail -->
          <div
            v-for="(crumb, index) in parsedBreadcrumb"
            :key="index"
            class="flex items-baseline gap-2"
          >
            <NuxtLink v-if="crumb.to" :to="crumb.to" class="text-content-muted hover:text-content">
              {{ crumb.title }}
            </NuxtLink>
            <span v-else class="text-content-muted">{{ crumb.title }}</span>
            <div class="text-content-subtle">/</div>
          </div>

          <div ref="titleEl" class="_title text-content leading-none" :style="{ fontSize: shownSize + 'px' }">
            <slot />
          </div>
        </div>

        <!-- Optional right slot — zero-height so it never sets the title row's
             height: content bottom-aligns just above the rule and overflows
             upward, so buttons/badges taller than the title don't push the
             rule (and the page) down. Hidden while pinned. -->
        <div v-if="slots['right'] && !pinned" class="h-0 overflow-visible flex items-end pb-1 ml-5">
          <slot name="right" />
        </div>
      </div>

      <!-- Optional far-right slot (hidden while pinned) -->
      <slot v-if="!pinned" name="far-right" />
    </div>

    <!-- Optional chin slots (below the content; hidden while pinned) -->
    <div v-if="(slots['chin'] || slots['chin-right']) && !pinned" class="flex items-center mt-3 -mb-5">
      <slot name="chin" />
      <div v-if="slots['chin-right']" class="ml-auto pl-2">
        <slot name="chin-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
// UxPageTitle — the page header: breadcrumb trail + title, a bottom rule,
// optional back link and #right / #far-right / #chin slots.
//
// Sticky band (design c106): when the layout's UxStickyBand runs with `title`,
// this joins it on its own (opt out with `:sticky="false"`): it pins on row 1
// beside the filter and drives the band's scroll mode. Pinned, the title
// shows at STICKY_BAND.titleSize (15px; 20px in the `up` look when that is
// on) with its hairline (padding 6px), and the back link, #right, #far-right
// and #chin step aside. Only the first joined title on a page drives the band.
// It must be a direct child of a tall element (the page) — a sticky box can't
// leave its parent — so wrappers that set the title row's height use
// `rowMinHeight` instead of a wrapping box.
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'

const slots = useSlots()
const props = defineProps({
  backText    : { type: String },
  // String → plain (unlinked) crumb. Object → { title, to } linked crumb.
  // Pass an array to combine several.
  breadcrumb  : { type: [String, Array, Object] },
  titleSize   : { type: Number, default: 28 },   // px — bump for hero detail-page titles
  // Minimum height (px) of the title row, which bottom-aligns the title and
  // rule in it — e.g. qdash PageHeader's 44px, which lines the rule up across
  // pages without a wrapping box (one would trap the sticky title).
  rowMinHeight: { type: Number },
  // Join the page's sticky band when it runs with `title` (default). `false` opts out.
  sticky      : { type: Boolean, default: true },
})

defineEmits(['back'])

const B = STICKY_BAND
const band = useStickyBand()

const parsedBreadcrumb = computed(() => {
  if (props.breadcrumb == null) return []

  const items = Array.isArray(props.breadcrumb) ? props.breadcrumb : [props.breadcrumb]

  return items.map((item) =>
    typeof item === 'string'
      ? { title: item, to: '' }
      : { title: item.title, to: item.to || '' }
  )
})

// ── Band membership ─────────────────────────────────────────────────────────
// Claimed once the band runs with `title`; released when it stops, when this
// opts out, or on unmount. Only one title holds the slot.
const box = ref(null)
const titleEl = ref(null)
const member = ref(null)
const joined = computed(() => !!member.value)
const pinned = computed(() => joined.value && band.state.titlePinned)
const look = computed(() => (band.look.value === 'up' ? 'up' : 'down'))
const shownSize = computed(() => (pinned.value ? B.titleSize[look.value] : props.titleSize))

watch(
  () => props.sticky && band.state.attached && band.state.titleBand,
  (want) => {
    if (want && !member.value) member.value = band.claimTitle()
    else if (!want && member.value) { member.value.release(); member.value = null }
  },
)
onMounted(() => {
  if (props.sticky && band.state.attached && band.state.titleBand && !member.value) member.value = band.claimTitle()
})
onBeforeUnmount(() => { member.value?.release(); member.value = null; clearTimeout(settleTimer) })

// ── Settling ────────────────────────────────────────────────────────────────
// Unpinning doesn't snap: for the band's rest duration the box stays frozen
// and the title keeps easing back to its rest size inside it.
const settling = ref(false)
let settleTimer
watch(pinned, (now) => {
  clearTimeout(settleTimer)
  settling.value = joined.value && !now
  if (settling.value) settleTimer = setTimeout(() => { settling.value = false }, B.motion.compact + 50)
})

// ── Rest heights ────────────────────────────────────────────────────────────
// Captured at rest, held while pinned or settling. A reading only counts once
// the title renders at its rest size: one taken mid-change would freeze the
// wrong height and move the page.
const restH = ref(0)
const restRowH = ref(0)
const captureRest = () => {
  if (!joined.value || pinned.value || settling.value || !box.value || !titleEl.value) return
  if (Math.round(parseFloat(getComputedStyle(titleEl.value).fontSize)) !== props.titleSize) return
  restH.value = box.value.offsetHeight
  restRowH.value = box.value.querySelector('._row')?.offsetHeight || 0
}
let ro = null
onMounted(() => { ro = new ResizeObserver(captureRest); if (box.value) ro.observe(box.value) })
onBeforeUnmount(() => ro?.disconnect())

// Pinned: the row is the band's title row, stopping short of the filter;
// settling: it eases back to its rest height; at rest: the consumer's minimum.
const rowStyle = computed(() => {
  if (pinned.value) return { height: `${B.titleRow}px`, maxWidth: 'calc(100% - var(--q-sticky-filter-w, 0px) - 24px)' }
  if (settling.value && restRowH.value) return { height: `${restRowH.value}px` }
  return props.rowMinHeight ? { minHeight: `${props.rowMinHeight}px` } : undefined
})

// Report pinned-or-not on every scroll frame (the band's mode follows).
useStickyBandScroll(box, (el) => {
  if (!member.value) return
  captureRest()
  member.value.report(window.scrollY > 0 && el.getBoundingClientRect().top <= B.pinTop + 0.5)
})
</script>

<style scoped>
/* The rule fills the row's height and bottom-aligns the title (flex), so
   pinning only changes the row's height and the title's size, never where the
   hairline is drawn relative to them. */

/* Pinned: one line; the title truncates before the crumbs; the hairline stays
   with its padding tightened to fit the row. */
._pinned ._row > div { min-width: 0; }
._pinned ._rule { padding-bottom: 6px; }
._pinned ._title { overflow: hidden; text-overflow: ellipsis; }

/* The title eases with the band's motion while pinned and while settling; the
   row's height eases with it (the hairline glides to rest); padding is quick. */
._moving ._title { transition: font-size var(--q-band-dur, 1000ms) var(--q-band-ease, ease); }
/* shrinking as it pins runs on its own clock (STICKY_BAND.motion.title) */
._pinned ._title { transition: font-size var(--q-band-title, 500ms) var(--q-band-ease, ease); }
._moving ._row { transition: height var(--q-band-dur, 1000ms) var(--q-band-ease, ease); }
._moving ._rule { transition: padding-bottom 200ms var(--q-band-ease, ease); }

@media (prefers-reduced-motion: reduce) {
  ._moving ._title, ._pinned ._title, ._moving ._row, ._moving ._rule { transition: none; }
}
</style>
