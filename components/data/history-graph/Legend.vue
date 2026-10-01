<template>
  <!-- horizontal + wrap (default): items wrap onto more lines. horizontal + no wrap: one line
       that never sets the chart's width (w-0 min-w-full — it takes the width the columns give);
       items share it and long labels truncate with an ellipsis, the full label on hover — and it
       sits tighter (6 px swatch → label, 12 px between items; wrap keeps 12 / 24). -->
  <div class="inline-flex" :class="horizontal ? (wrap ? 'flex-row flex-wrap gap-x-6 gap-y-2' : 'flex-row flex-nowrap gap-x-3 w-0 min-w-full overflow-hidden') : 'flex-col gap-3'">
    <div v-for="item in series" :key="item.key" class="flex items-center" :class="horizontal && !wrap ? 'min-w-0 gap-1.5' : 'gap-3'">
      <span class="h-3.5 w-3.5 shrink-0 rounded-sm" :style="{ background: item.color }" />
      <span class="font-med text-content" :class="horizontal && !wrap ? 'truncate' : ''" :style="{ fontSize: `${fontSize}px` }" :title="horizontal && !wrap ? item.label : undefined">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  series     : { type: Array, required: true }, // [{ key, label, color }] — color pre-resolved
  horizontal : { type: Boolean, default: false },
  fontSize   : { type: Number, default: 15 },    // legend label font size in px
  wrap       : { type: Boolean, default: true }, // horizontal only: false = one line, labels truncate with an ellipsis
})
</script>
