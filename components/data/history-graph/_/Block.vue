<template>
  <div class="shrink-0" :style="{ width: `${size}px`, height: `${size}px`, background: color }" :title="title" />
</template>

<script setup>
defineProps({
  color : { type: String, required: true },
  title : { type: String, default: '' },
  size  : { type: Number, default: 6 },
})
</script>
