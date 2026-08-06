<template>
  <div class="w-full relative flex items-center font-semi" :class="compact ? 'pl-1.5 text-12' : 'pl-2 text-16'">
    <div class="text-ellipsis overflow-hidden">
      <div class="absolute top-0 left-0 bg-primary/15 h-full" :style="`width: ${percent}%`"></div>
    </div>
    <div
      v-if="title"
      class="relative text-ellipsis overflow-hidden whitespace-nowrap"
      :class="compact ? '' : 'text-13'"
      :style="compact ? { minWidth: '36px', fontSize: '9px', lineHeight: '11px' } : { minWidth: '60px' }"
    >{{ title }}</div>
    <div class="relative overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  title   : {type:String },
  percent : {type:Number, required:true},
  // Dense contexts (e.g. SurfacePanel compact): smaller label with tight
  // leading, so the h-full fill band shrinks with it.
  compact : {type:Boolean, default:false},
})
</script>
