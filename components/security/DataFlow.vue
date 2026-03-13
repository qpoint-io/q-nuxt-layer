<template>
  <span class="inline-flex items-center gap-0 whitespace-nowrap">
    <!-- Source dot -->
    <span
      class="w-[10px] h-[10px] rounded-full shrink-0"
      :style="{ backgroundColor: dotColor }"
    />

    <!-- Line from dot to first tag -->
    <span class="w-[8px] h-[2px] shrink-0" :style="{ backgroundColor: lineColor }" />

    <!-- Data type tags with connecting lines -->
    <template v-for="(type, i) in types" :key="i">
      <span
        class="inline-flex items-center px-[6px] py-[1px] rounded-full text-[11px] font-bold leading-tight border shrink-0"
        :style="{ color: tagTextColor, borderColor: lineColor, backgroundColor: tagBgColor }"
      >{{ type }}</span>
      <!-- Line between tags or to arrow -->
      <span class="w-[8px] h-[2px] shrink-0" :style="{ backgroundColor: lineColor }" />
    </template>

    <!-- Arrow head -->
    <span
      class="w-0 h-0 shrink-0"
      :style="{
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: `7px solid ${lineColor}`,
      }"
    />
  </span>
</template>

<script setup>
const props = defineProps({
  types: { type: Array, default: () => ['PII'] },
  color: { type: String, default: 'red' },
})

const palette = computed(() => {
  const palettes = {
    red:   { dot: '#1a1a1a', line: '#dc2626', tagText: '#dc2626', tagBg: '#fef2f2' },
    grape: { dot: '#1a1a1a', line: '#8b5cf6', tagText: '#8b5cf6', tagBg: '#f5f3ff' },
    black: { dot: '#1a1a1a', line: '#1a1a1a', tagText: '#1a1a1a', tagBg: '#f5f5f5' },
  }
  return palettes[props.color] || palettes.red
})

const dotColor     = computed(() => palette.value.dot)
const lineColor    = computed(() => palette.value.line)
const tagTextColor = computed(() => palette.value.tagText)
const tagBgColor   = computed(() => palette.value.tagBg)
</script>
