<template>
  <div class="flex text-13 gap-[2px]">
    <div>{{ changeIndicator + value }}</div>
    <IconTriangle class="w-3 triangle" />
  </div>
</template>

<script setup>
const props = defineProps({
  value : {},
  change: {type:Number, default:0},
})

const changeDirection = computed(()=>{
  if(props.change > 0)
    return 'up'
  if(props.change < 0)
    return 'down'
  return 'static'
})

const changeIndicator = computed(()=>{
  if( changeDirection.value == 'up')
    return '+'
  if( changeDirection.value == 'down')
    return '-'
  return ''
})

const triangleFlip = computed(()=>{
  if(props.change < 0)
    return `scaleY(-1)`
  return `scaleY(1)`

})
</script>


<style>
  .triangle{
    transform: v-bind( triangleFlip );
  }
  svg{}
</style>
