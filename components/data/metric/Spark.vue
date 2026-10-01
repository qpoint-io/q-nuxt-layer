<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       class="w-0 min-w-full"
       width="100%"
       height="100%"
       style="transform:scaleY(-1); overflow:visible;"
       preserveAspectRatio="none"
       :viewBox="graph.viewBox">

    <!-- with not-collected days (count: null) each unbroken run draws on its
         own — a fill closed to the baseline at the run's ends, the stroke on
         its top edge only — and a lone known day is a dot, so a gap never
         reads as a zero -->
    <template v-if="graph.lines">
      <polygon
        v-for="(seg, i) in graph.segments" :key="`a${i}`"
          :style="{ fill: fillColor, stroke: 'none' }"
          :points="seg"
      />
      <template v-if="fillColor == 'none' || Number(strokeWidth) > 0">
        <polyline
          v-for="(line, i) in graph.lines" :key="`l${i}`"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
            stroke-linecap="round"
            :style="{ fill: 'none', stroke: strokeColor, strokeWidth }"
            :points="line"
        />
      </template>
      <polyline
        v-for="(d, i) in graph.dots" :key="`d${i}`"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          :style="{ fill: 'none', stroke: dotColor, strokeWidth: dotWidth }"
          :points="`${d.x} ${d.y} ${d.x} ${d.y}`"
      />
    </template>

    <template v-else>
      <polygon
        v-if="fillColor != 'none'"
          vector-effect="non-scaling-stroke"
          stroke-linejoin="round"
          :style="{ fill: fillColor, stroke: strokeColor, strokeWidth }"
          :points="graph.points"
      />
      <polyline
        v-else
          vector-effect="non-scaling-stroke"
          stroke-linejoin="round"
          stroke-linecap="round"
          :style="{ fill: 'none', stroke: strokeColor, strokeWidth }"
          :points="graph.points">
      </polyline>
    </template>
  </svg>
</template>

<script setup>

const props = defineProps({
  data        : {type:Array, required: true},   // [{ count }] — count: null (or a null entry) = not collected: the line breaks there
  ceiling     : {type:Number},
  fillColor   : {default:'currentColor'},
  strokeColor : {default:'currentColor'},
  strokeWidth : {default:0},
  padding     : {default:0}
})

// convert the data into a svg line
const graph = computed( ()=>{
  return svgMachine.sparkChart( props.data, props.ceiling, props.padding, props.fillColor !== 'none' )
})

// a lone known day between gaps: a round-capped zero-length stroke, in the
// line's ink (or the fill's, for an unstroked area), a little wider than the line
const dotColor = computed(() => (Number(props.strokeWidth) > 0 || props.fillColor === 'none' ? props.strokeColor : props.fillColor))
const dotWidth = computed(() => Math.max(3, Number(props.strokeWidth) * 2))

</script>
