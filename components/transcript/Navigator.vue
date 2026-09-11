<template>
  <div
    ref="railEl"
    class="flex flex-col cursor-pointer"
    style="width: 40px"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <div
      v-for="(turn, i) in turns"
      :key="i"
      :ref="el => setTickRef(el, i)"
      class="relative flex items-center h-2"
    >
      <span
        class="block h-0.5 rounded-full"
        :class="tickColor(i)"
        :style="{
          width: tickWidth(i) + 'px',
          // Instant while actively tracking the mouse (so ticks don't lag
          // the cursor); eased only on the way back to rest on mouseleave.
          transition: mouseY === null ? 'width 200ms ease-out, background-color 200ms ease-out' : 'none',
        }"
      />
    </div>

    <!-- Single flyout, anchored to whichever tick currently has the most
         hover influence. -->
    <div
      v-if="hoveredIndex !== -1"
      class="fixed z-20 w-64 rounded-8 border border-stroke bg-surface shadow-lg px-3 py-2 pointer-events-none"
      :style="cardStyle"
    >
      <p class="text-13 font-mono font-bold text-content truncate">{{ turns[hoveredIndex].title }}</p>
      <p class="mt-0.5 text-12 font-mono text-content-subtle overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
        {{ turns[hoveredIndex].summary }}
      </p>
    </div>
  </div>
</template>

<script setup>
// ChatGPT-style turn rail. Ticks don't hover/click independently — the
// whole rail tracks the mouse's Y position, every tick's width responds as
// a falloff of its distance to the cursor (closest grows, rest stay
// short), and clicks always target whichever turn currently has the most
// influence (the one shown in the flyout) rather than the exact row under
// the pointer. Rows are packed edge-to-edge (no gap) so there's no dead
// zone between them. The consumer positions and centers this component
// (see TranscriptPanel) without a transform — the flyout below is
// position:fixed, and a transform on an ancestor would trap it in that
// ancestor's box instead of the viewport.
const props = defineProps({
  turns:       { type: Array, required: true }, // TranscriptTurn[]
  activeIndex: { type: Number, default: -1 },    // consumer-selected turn (click/scroll-spy)
})

const emit = defineEmits(['select'])

const BASE_WIDTH = 16
const MAX_WIDTH = 34
const FALLOFF = 40      // px — distance at which influence reaches zero

const railEl = ref(null)
const tickRefs = ref([])
const mouseY = ref(null) // null = not hovering the rail

function setTickRef(el, i) {
  if (el) tickRefs.value[i] = el
}

function onMouseMove(e) {
  if (!railEl.value) return
  mouseY.value = e.clientY - railEl.value.getBoundingClientRect().top
}
function onMouseLeave() {
  mouseY.value = null
}
function onClick() {
  if (hoveredIndex.value !== -1) emit('select', hoveredIndex.value)
}

// Signed distance (px) from the rail's current mouse Y to a tick's own
// vertical center, measured via actual layout rather than assumed spacing
// so this stays correct if row height ever changes.
function tickCenterY(i) {
  const el = tickRefs.value[i]
  if (!el || !railEl.value) return null
  const railTop = railEl.value.getBoundingClientRect().top
  const elRect = el.getBoundingClientRect()
  return elRect.top + elRect.height / 2 - railTop
}

function influence(i) {
  if (mouseY.value === null) return 0
  const centerY = tickCenterY(i)
  if (centerY === null) return 0
  return Math.max(0, 1 - Math.abs(mouseY.value - centerY) / FALLOFF)
}

function tickWidth(i) {
  return BASE_WIDTH + (MAX_WIDTH - BASE_WIDTH) * influence(i)
}

function tickColor(i) {
  if (influence(i) > 0.15 || i === props.activeIndex) return 'bg-primary'
  return 'bg-content-subtle'
}

// The tick with the most influence is the one "shown" — its flyout is
// visible and it's what a click targets, even if the pointer isn't
// perfectly centered on that row.
const hoveredIndex = computed(() => {
  if (mouseY.value === null) return -1
  let best = -1
  let bestInfluence = 0.15
  props.turns.forEach((_, i) => {
    const inf = influence(i)
    if (inf > bestInfluence) { bestInfluence = inf; best = i }
  })
  return best
})

const cardStyle = computed(() => {
  if (hoveredIndex.value === -1 || !railEl.value) return {}
  const railRect = railEl.value.getBoundingClientRect()
  const centerY = tickCenterY(hoveredIndex.value) ?? 0
  return {
    left: `${railRect.right + 10}px`,
    top: `${railRect.top + centerY}px`,
    transform: 'translateY(-50%)',
  }
})
</script>
