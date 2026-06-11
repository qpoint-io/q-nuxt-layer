<template>
  <div class="w-full h-full absolute">
    <div class="left-right-borders" />
    <div class="flex flex-col justify-between h-full">
      <!-- TODO : standardize border styles -->
      <div
        v-for="i in stops+2" :key="i"
        class="border-b-1 border-b-content/20 relative" >
          <div class="absolute top-[-10px] text-12 font-med text-content-muted" style="right: calc(100% + 6px)">{{ getStopValue(i) }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.left-right-borders:before, .left-right-borders:after{
  content:"";
  height:calc(100% + 30px);
  top:-15px;
  @apply w-full block absolute border-l-3 border-l-content border-r-3 border-r-content;
}
</style>

<script setup>

const props = defineProps({
  top    : {type: Number, required:true},
  bottom : {type: Number, required:true},
  stops  : {type: Number, required:true},
})

// return value of stop
const getStopValue = (index)=>{
  let i = index - 1
  let incrament = (props.top - props.bottom) / (props.stops+1)
  let returnVal = props.top - (incrament * i)
  if(props.top > 1)
    return Math.round( returnVal )

  return Math.round(returnVal * 100) / 100
}

</script>
