<template>
  <svg
    :viewBox="`0 0 ${viewW} ${viewH}`"
    class="block"
    style="width: 100%; height: auto"
    aria-hidden="true"
  >
    <template v-for="(row, r) in matrix">
      <path
        v-for="(cell, c) in row"
        :key="`${r}-${c}`"
        :d="cell.digit ? ONE_PATH : ZERO_PATH"
        :transform="`translate(${xPos[r][c]}, ${r * ROW_PITCH})`"
        :fill="cell.highlighted ? highlightColor : baseColor"
      />
    </template>
  </svg>
</template>

<script setup>
// AgentBinary — the pawn's "working" decoration, rebuilt from binarya.svg as a
// live component: every digit is one of two glyph paths (a boxy 0, a bar 1)
// packed by true advance width, exactly like the source art. Digits change by
// swapping a 0 and a 1 within a row — row widths never change, so the block
// stays perfectly stable — and the purple highlight runs re-roll on their own
// clock. All timing is prop-driven so the feel can be dialed in live; timers
// restart when the props change and never run server-side or under
// prefers-reduced-motion.

// Glyph geometry lifted verbatim from assets/svgs/pixel-pawns/binarya.svg
// (kept on disk as the art source of record).
const ZERO_PATH = 'M6.08,0v7.5H0V0h6.08ZM4.56,6V1.5H1.52v4.5h3.04Z'
const ONE_PATH  = 'M0,0h3.04v7.5h-1.52v-6h-1.52v-1.5Z'
const ADVANCE   = { 0: 7.6, 1: 4.56 }   // per-glyph advance incl. letter-space
const TRAILING  = 1.52                   // letter-space after the last glyph
const GLYPH_H   = 7.5
const ROW_PITCH = 12.6

// The four rows of binarya.svg, digits + highlighted indices — the initial
// matrix reproduces the static art so SSR and first paint match it.
const ART = [
  { digits: [0, 0, 1, 0, 1, 1, 0], hi: [0, 1, 2] },
  { digits: [0, 0, 1, 0, 1, 1, 0], hi: [3, 4, 5] },
  { digits: [0, 0, 1, 1, 0, 1, 0], hi: [5, 6] },
  { digits: [0, 0, 1, 0, 1, 1, 0], hi: [0, 1] },
]

const props = defineProps({
  rows:           { type: Number, default: 4 },
  cols:           { type: Number, default: 7 },
  // Every flipMs, swap a 0 and a 1 within flipCount random row(s).
  flipMs:         { type: Number, default: 800 },
  flipCount:      { type: Number, default: 1 },
  // Every highlightMs, re-roll highlightRuns runs of 2–3 purple digits.
  highlightMs:    { type: Number, default: 1600 },
  highlightRuns:  { type: Number, default: 3 },
  // false renders the static matrix; prefers-reduced-motion also disables.
  animate:        { type: Boolean, default: true },
  baseColor:      { type: String, default: '#4d5c5a' },
  highlightColor: { type: String, default: '#ab86f6' },
})

const buildMatrix = () => {
  const m = []
  for (let r = 0; r < props.rows; r++) {
    const art = ART[r % ART.length]
    const row = []
    for (let c = 0; c < props.cols; c++) {
      row.push({
        digit: art.digits[c % art.digits.length],
        highlighted: art.hi.includes(c % art.digits.length),
      })
    }
    m.push(row)
  }
  return m
}

const matrix = ref(buildMatrix())
watch(() => [props.rows, props.cols], () => { matrix.value = buildMatrix() })

const xPos = computed(() => matrix.value.map((row) => {
  let x = 0
  return row.map((cell) => {
    const cur = x
    x += ADVANCE[cell.digit]
    return cur
  })
}))

const round2 = n => Math.round(n * 100) / 100
const viewW = computed(() => round2(Math.max(...matrix.value.map(row =>
  row.reduce((x, cell) => x + ADVANCE[cell.digit], 0) - TRAILING,
))))
const viewH = computed(() => round2((matrix.value.length - 1) * ROW_PITCH + GLYPH_H))

// Swap a random 0 with a random 1 inside one row — digits visibly change
// while the row's total width (and therefore the viewBox) stays constant.
const flip = () => {
  for (let n = 0; n < props.flipCount; n++) {
    const row = matrix.value[Math.floor(Math.random() * matrix.value.length)]
    const zeros = [], ones = []
    row.forEach((cell, i) => (cell.digit ? ones : zeros).push(i))
    if (!zeros.length || !ones.length) continue
    row[zeros[Math.floor(Math.random() * zeros.length)]].digit = 1
    row[ones[Math.floor(Math.random() * ones.length)]].digit = 0
  }
}

const rehighlight = () => {
  matrix.value.forEach(row => row.forEach((cell) => { cell.highlighted = false }))
  for (let n = 0; n < props.highlightRuns; n++) {
    const row = matrix.value[Math.floor(Math.random() * matrix.value.length)]
    const len = 2 + Math.floor(Math.random() * 2)
    const start = Math.floor(Math.random() * Math.max(1, row.length - len + 1))
    for (let c = start; c < Math.min(start + len, row.length); c++) row[c].highlighted = true
  }
}

let flipTimer, highlightTimer
const stop = () => {
  clearInterval(flipTimer)
  clearInterval(highlightTimer)
}
const start = () => {
  stop()
  if (!props.animate) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  flipTimer = setInterval(flip, props.flipMs)
  highlightTimer = setInterval(rehighlight, props.highlightMs)
}

onMounted(start)
onUnmounted(stop)
watch(() => [props.animate, props.flipMs, props.highlightMs], start)
</script>
