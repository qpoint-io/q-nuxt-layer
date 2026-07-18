<template>
  <div class="_data-smile flex items-center gap-4">

    <!-- Smile graphic — three strokes sharing one circular-arc curve.
         viewBox padded well beyond the curve so the thick white background
         and its shadow are never clipped. -->
    <svg
      :width="size"
      :height="size * vbH / VBW"
      :viewBox="`0 ${vbTop} ${VBW} ${vbH}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Soft shadow, scoped to the white background stroke only.
             userSpaceOnUse + full-viewBox region: the default region is a %
             of the path's bounding box, which is near-flat (~30px tall) and
             clips the shadow. Anchoring to the whole viewBox fixes that. -->
        <filter
          :id="`smile-shadow-${uid}`"
          filterUnits="userSpaceOnUse"
          x="0" :y="vbTop" :width="VBW" :height="vbH"
        >
          <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.14" />
        </filter>

        <!-- Value gradient (light → dark of the active range).
             userSpaceOnUse so it spans the chord regardless of the fill path's
             bounding box — a near-flat arc has ~zero-height bbox, and an
             objectBoundingBox gradient there fails to paint (invisible fill). -->
        <linearGradient :id="`smile-grad-${uid}`" gradientUnits="userSpaceOnUse" :x1="x0" y1="0" :x2="x1" y2="0">
          <stop offset="0%" :stop-color="activeRange.from" />
          <stop offset="100%" :stop-color="activeRange.to" />
        </linearGradient>
      </defs>

      <!-- 1. White background + shadow -->
      <path
        :d="d" fill="none" stroke="#fff" :stroke-width="BG_W" stroke-linecap="round"
        :filter="`url(#smile-shadow-${uid})`"
      />

      <!-- 2. Light track -->
      <path
        :d="d" fill="none" :stroke="activeRange.track" :stroke-width="FILL_W" stroke-linecap="round"
      />

      <!-- 3. Gradient fill — partial length via pathLength normalization.
           Skipped entirely at 0: a round cap renders a zero-length dash as a
           dot, and the "0 100" pattern repeats onto the endpoint (a 2nd dot). -->
      <path
        v-if="clamped > 0"
        :d="d" fill="none" :stroke="`url(#smile-grad-${uid})`" :stroke-width="FILL_W" stroke-linecap="round"
        pathLength="100" :stroke-dasharray="`${clamped} 100`"
        class="_fill"
      />
    </svg>

    <!-- Numeric readout (slot overrides; receives the value) -->
    <slot v-if="showValue" :value="rounded">
      <span
        class="font-bold leading-none tabular-nums"
        :style="{ color: activeRange.to, fontSize: `${size * 0.34}px` }"
      >
        {{ rounded }}
      </span>
    </slot>
  </div>
</template>

<style scoped>
  ._data-smile ._fill {
    @apply duration-500 ease-in-out-quint;
  }
  ._data-smile path {
    @apply duration-500 ease-in-out-quint;
  }
</style>

<script setup>
const props = defineProps({
  value:     { type: Number,  default: 50 },     // 0–100; clamped
  size:      { type: Number,  default: 180 },    // svg width in px (height grows with curve)
  curve:     { type: Number,  default: 78 },     // max bend in viewBox units (0 = flat line, ~110 max before clipping)
  showValue: { type: Boolean, default: true },   // render the numeric readout
  ranges: {
    type: Array,
    default: () => [
      { max: 40,  track: '#F6D9D5', from: '#E05A4E', to: '#C0392B' }, // red    — frown
      { max: 70,  track: '#FBE3C2', from: '#F7A93C', to: '#E8820C' }, // orange — flat
      { max: 100, track: '#C9EED5', from: '#63D38C', to: '#2FA862' }, // green  — smile
    ],
  },
})

// Unique ids so multiple instances don't share gradient/filter defs
const uid = useId()

// Geometry — fixed endpoints, value-driven control point.
// Curve lives inset within a padded viewBox so the thick white background
// stroke (BG_W) + drop shadow have room on every side and never clip.
const VBW = 280                     // viewBox width
const x0 = 40, x1 = 240, yMid = 110  // chord endpoints
const HALF_CHORD = (x1 - x0) / 2    // 100
const BG_W = 68                     // white background stroke (thick halo)
const FILL_W = 28                   // track + gradient fill stroke
const PAD = 52                      // room for halo (BG_W/2) + shadow beyond the curve

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
const rounded = computed(() => Math.round(clamped.value))

// Signed bulge depth at the midpoint: + dips DOWN (smile), - up (frown), 0 = flat.
const sagitta = computed(() => ((clamped.value - 50) / 50) * (props.curve / 2))

// Circular arc through the two fixed endpoints; radius derived from chord + sagitta.
const d = computed(() => {
  const a = HALF_CHORD
  const s = sagitta.value
  if (Math.abs(s) < 0.5) return `M ${x0},${yMid} L ${x1},${yMid}` // flat
  const r = (a * a + s * s) / (2 * Math.abs(s))
  const sweep = s > 0 ? 0 : 1                 // smile (down) sweeps CCW
  const largeArc = Math.abs(s) > a ? 1 : 0    // major arc past a semicircle
  return `M ${x0},${yMid} A ${r} ${r} 0 ${largeArc} ${sweep} ${x1},${yMid}`
})

// Snug viewBox window: wraps the endpoints + belly + a symmetric halo/shadow
// margin, so the curve is vertically centred with no wasted space (e.g. no
// empty band above a smile) and the shadow never clips.
const vbTop = computed(() => yMid + Math.min(0, sagitta.value) - PAD)
const vbH   = computed(() => Math.abs(sagitta.value) + 2 * PAD)

const activeRange = computed(() =>
  props.ranges.find(r => clamped.value <= r.max) ?? props.ranges[props.ranges.length - 1]
)
</script>
