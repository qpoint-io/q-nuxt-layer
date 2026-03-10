<template>
  <div class="_background w-full h-full" :class="temperature">
    <slot />
  </div>
</template>

<style scoped>
  /* When hot, make bg red */
  ._is_hot{
    @apply bg-warn bg-opacity-30;
  }
</style>

<script setup>
const props = defineProps({
  val        : { type: Number },
  healthMode : { type:Function, default:healthModes.NEVER_HOT },
})

// determine if value is hot
const temperature = computed(()=>{
  if( typeof props.healthMode == 'function' ){
    if(props.healthMode( props.val ))
      return '_is_hot'
  }
  return ''
})
</script>
