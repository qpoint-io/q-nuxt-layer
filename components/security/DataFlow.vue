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
  // Token-backed (inline styles — DOM resolves var()); pastel tag fills
  // become low-alpha signal tints so they read on a dark surface too.
  const palettes = {
    red:   { dot: qp('content'), line: qp('error'),   tagText: qp('error'),   tagBg: qp('error', 0.08) },
    grape: { dot: qp('content'), line: qp('primary'), tagText: qp('primary'), tagBg: qp('primary', 0.08) },
    black: { dot: qp('content'), line: qp('content'), tagText: qp('content'), tagBg: qp('surface-sunken') },
  }
  return palettes[props.color] || palettes.red
})

const dotColor     = computed(() => palette.value.dot)
const lineColor    = computed(() => palette.value.line)
const tagTextColor = computed(() => palette.value.tagText)
const tagBgColor   = computed(() => palette.value.tagBg)
</script>
