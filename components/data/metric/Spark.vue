<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       class="w-0 min-w-full"
       width="100%"
       height="100%"
       style="transform:scaleY(-1); overflow:visible;"
       preserveAspectRatio="none"
       :viewBox="graph.viewBox">

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
  </svg>
</template>

<script setup>

const props = defineProps({
  data        : {type:Array, required: true},
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

</script>

