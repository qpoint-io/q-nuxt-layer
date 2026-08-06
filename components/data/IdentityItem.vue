<template>
  <div class="flex items-center gap-4">
    <span class="shrink-0 flex items-center justify-center"><slot /></span>
    <div class="">
      <div class="text-11 text-content-subtle">{{ label }}</div>
      <div class="text-13 font-semi text-content -mt-1.5">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
// One cell in the agent/entity identity row: leading visual (slot) + label/value.
// The slot takes whatever leading element the consumer wants — an icon, an
// avatar circle with an initial, etc.
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
})
</script>
