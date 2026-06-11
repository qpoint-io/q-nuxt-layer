<template>
  <div class="flex items-center gap-2 flex-wrap mb-3">
    <span class="text-primary text-13 font-semi whitespace-nowrap min-w-[90px]">{{ label }}</span>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String },
})
</script>
