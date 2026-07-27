<template>
  <div class="w-[111px]">
    <div class="relative mb-1.5 h-[8px] w-full bg-grey-300 rounded-full">
      <div class="absolute inset-y-0 left-0 bg-grape-500 rounded-full" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="flex items-baseline gap-2 whitespace-nowrap text-content">
      <span class="text-18 font-bold leading-none">{{ percent }}<span class="text-[10px]">%</span></span>
      <span class="text-[12px] font-bold leading-none">{{ fraction }}</span>
      <span class="text-[9px] font-med leading-none">Controls</span>
    </div>
  </div>
</template>

<script setup>
// Per-framework compliance completeness: mini progress bar over
// "84% · 14 / 18 · Controls".
defineProps({
  percent: { type: Number, required: true },
  fraction: { type: String, required: true },
})
</script>
