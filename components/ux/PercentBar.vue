<template>
  <div class="w-full relative flex items-center pl-2 text-16 font-semi">
    <div class="text-ellipsis overflow-hidden">
      <div class="absolute top-0 left-0 bg-primary/15 h-full" :style="`width: ${percent}%`"></div>
    </div>
    <div v-if="title" class="text-13 relative min-w-[60px] text-ellipsis overflow-hidden whitespace-nowrap">{{ title }}</div>
    <div class="relative overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  title   : {type:String },
  percent : {type:Number, required:true},
})
</script>
