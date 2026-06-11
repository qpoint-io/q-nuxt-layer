<template>
  <code
    class="font-mono text-[0.9em] px-1.5 py-0.5 rounded-4"
    :class="tone == 'warn' ? 'bg-signal-warning/20' : 'bg-surface-sunken'"
  >
    <slot />
  </code>
</template>

<script setup>
defineProps({
  // grey = default, warn = caution callouts
  tone: { type: String, default: 'grey' },
})
</script>
