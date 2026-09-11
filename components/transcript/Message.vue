<template>
  <div class="flex items-end gap-3" :class="isUser ? 'self-end' : 'flex-row-reverse self-start'" :style="{ marginLeft: isUser ? '58px' : 0, marginRight: isUser ? 0 : '58px' }">
    <div
      class="relative isolate rounded-12 border-3 border-stroke bg-surface text-content px-5 py-4 flex flex-col gap-2.5"
      :class="isUser ? 'rounded-br-none' : 'rounded-bl-none'"
      style="max-width: 560px"
    >
      <template v-for="(part, i) in message.parts" :key="i">
        <p v-if="part.kind === 'text'" class="text-13 font-mono leading-relaxed whitespace-pre-wrap">{{ part.body }}</p>
        <TranscriptToolCall
          v-else
          :title="part.title"
          :summary="part.summary"
          :details="part.details"
        />
      </template>

      <!-- Speech-bubble tail: a skewed square, same fill/border as the
           bubble, pinned to its one square corner (the other three stay
           rounded) and tucked behind it (isolate + negative z-index) so
           only the sliver outside the bubble's own box shows — reads as
           the bubble's material folding out into a seamless point rather
           than a separate shape glued on. -->
      <span class="absolute pointer-events-none" :style="tailStyle" />
    </div>

    <!-- shrink-0 keeps the identity mark from being squeezed as the row
         narrows; the translateY nudges its floor below the bubble's
         squared corner so it clears the tail instead of overlapping it. -->
    <UxAvatar v-if="isUser" :name="userName" size="small" class="shrink-0" style="transform: translate(10px, 10px)" />
    <!-- state is a generic identity mark here, not a live status indicator -->
    <AgentPawn v-else state="working" :decorations="false" :size="28" class="shrink-0" style="transform: translate(-8px, 12px)" />
  </div>
</template>

<script setup>
// One speaker turn inside a TranscriptTurn — a single bubble holding every
// content part (text and/or tool calls) that speaker produced together.
// User messages render as a simple right-aligned bubble; agent messages
// render as a left-aligned card since they typically carry mixed content
// (prose interleaved with tool-call bursts).
const props = defineProps({
  message:  { type: Object, required: true }, // TranscriptMessage
  userName: { type: String, required: true },
})

const isUser = computed(() => props.message.author === 'user')

// The skewed-square tail (cssarrowplease-style, ported from a skewX
// variant Mark supplied): a TAIL×TAIL square, filled/bordered like the
// bubble, positioned so its un-skewed top-left corner sits exactly on the
// bubble's square corner — skewing then shears it into a triangle. Colors
// read the same CSS custom properties Tailwind's border-stroke/bg-surface
// classes resolve to, since this repo drives theme switching through
// those vars rather than a `dark:` class (see design's tailwind-gotchas).
const TAIL = 14   // px
const STROKE = 3  // px — matches the bubble's own `border-2` width
const fill = `rgb(var(--qp-surface))`
const border = `rgb(var(--qp-stroke))`

const tailStyle = computed(() => ({
  zIndex: -1,
  bottom: `${-STROKE}px`,
  width: `${TAIL}px`,
  height: `${TAIL}px`,
  boxSizing: 'border-box',
  background: fill,
  ...(isUser.value
    ? {
        left: '100%',
        borderRight: `${STROKE}px solid ${border}`,
        borderBottom: `${STROKE}px solid ${border}`,
        transform: 'skewX(45deg)',
        transformOrigin: 'bottom left',
        marginLeft: '3px'
      }
    : {
        right: '100%',
        borderLeft: `${STROKE}px solid ${border}`,
        borderBottom: `${STROKE}px solid ${border}`,
        transform: 'skewX(-45deg)',
        transformOrigin: 'bottom right',
        marginRight: '3px'
      }),
}))
</script>
