<template>
  <div class="rounded-12 border border-stroke bg-surface overflow-hidden flex flex-col max-h-full" :style="{ minHeight }">
    <div class="shrink-0 flex items-baseline justify-between px-6 py-4 border-b border-stroke">
      <h3 class="text-18 font-bold text-content">Chat Transcript</h3>
      <span class="text-13 text-content-subtle">{{ transcript.turns.length }} turn{{ transcript.turns.length === 1 ? '' : 's' }}</span>
    </div>

    <div v-if="transcript.turns.length === 0" class="flex-1 grid place-items-center px-6 py-10 text-center text-13 text-content-subtle">
      No turns yet.
    </div>

    <!-- The panel is self-contained: this row fills whatever height the
         card has (viewport-filled by the consumer, or minHeight as a
         floor) and only the turn list (a normal flex-1 sibling, not an
         absolutely-positioned overlay — that would drop out of the intrinsic
         sizing the clamp() above depends on) scrolls inside it. The
         navigator is centered via items-center, not a transform — a
         transform on an ancestor would give its fixed-position flyout (see
         TranscriptNavigator) a new containing block, pinning the flyout to
         the rail instead of the viewport. A single turn has nothing to
         navigate between, so the rail only shows past 1. -->
    <div v-else class="flex-1 min-h-0 flex items-stretch">
      <div v-if="transcript.turns.length > 1" class="shrink-0 flex items-center pl-3.5">
        <TranscriptNavigator
          :turns="transcript.turns"
          :activeIndex="activeIndex"
          @select="scrollToTurn"
        />
      </div>

      <!-- pl-3 (not px-6 on the left): setting overflow-y makes overflow-x
           compute to auto too (a CSS Overflow spec quirk — one axis can't
           stay truly `visible` once the other scrolls), so anything pulled
           left past this padding via negative margin was getting silently
           clipped instead of just spilling over. Baking the left inset into
           real padding instead keeps agent rows close to the nav without
           ever rendering outside the scrollable box. -->
      <div ref="scrollerEl" class="flex-1 min-h-0 overflow-y-auto pl-3 py-6" style="padding-right: 35px">
        <div class="flex flex-col gap-6 min-w-0">
          <div v-for="(turn, i) in transcript.turns" :key="i" :ref="el => setTurnRef(el, i)">
            <TranscriptTurn :turn="turn" :userName="transcript.user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Outer chat-transcript card: header + turn count, the turn-navigator rail,
// and the turn stack. `transcript` is the only required prop — internals
// stay plain props/data flow rather than slots, since this renders one
// fixed shape of data rather than hosting arbitrary layout.
//
// Sizing: max-h-full (not h-full) + a normal-flow flex-1 scroller — a short
// transcript takes its natural content height, a long one clamps at the
// ancestor's available height (100%, if the consumer sizes one) and the
// flex-1 scroller absorbs the rest as internal scroll. minHeight is a floor
// under both. Two things that look like reasonable alternatives break this:
// `height: clamp(minHeight, max-content, 100%)` is invalid CSS (max-content
// isn't a valid argument inside clamp()/min()/max() — those only take
// lengths/percentages — so the whole declaration gets dropped and height
// falls back to unclamped auto). And making the scroller position:absolute
// (to dodge an unrelated percentage-height issue) takes it out of flow, so
// it stops contributing to the panel's own content-based auto height —
// short transcripts collapsed to just the header.
const props = defineProps({
  transcript: { type: Object, required: true }, // Transcript
  minHeight:  { type: String, default: '480px' },
})

const activeIndex = ref(-1)
const turnEls = ref([])
const scrollerEl = ref(null)

function setTurnRef(el, i) {
  if (el) turnEls.value[i] = el
}

// Scroll only the internal turn list — scrollIntoView() walks the whole
// ancestor chain, so it was also scrolling the outer page and carrying the
// panel's own header out of view along with it.
function scrollToTurn(i) {
  activeIndex.value = i
  const scroller = scrollerEl.value
  const target = turnEls.value[i]
  if (!scroller || !target) return

  const delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top
  scroller.scrollTo({ top: scroller.scrollTop + delta, behavior: 'smooth' })
}
</script>
