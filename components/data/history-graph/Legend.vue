<template>
  <div class="inline-flex" :class="horizontal ? 'flex-row flex-wrap gap-x-6 gap-y-2' : 'flex-col gap-3'">
    <div v-for="item in series" :key="item.key" class="flex items-center gap-3">
      <span class="h-3.5 w-3.5 shrink-0 rounded-sm" :style="{ background: item.color }" />
      <span class="font-med text-content" :style="{ fontSize: `${fontSize}px` }">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  series     : { type: Array, required: true }, // [{ key, label, color }] — color pre-resolved
  horizontal : { type: Boolean, default: false },
  fontSize   : { type: Number, default: 15 },    // legend label font size in px
})
</script>
