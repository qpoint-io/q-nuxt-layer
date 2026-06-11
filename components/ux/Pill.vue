<template>
  <span class="text-12 font-med px-2 py-0.5 rounded-4 inline-block" :class="toneClass">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  // read-only category/status badge — for dismissible tags use UxTag
  tone: { type: String, default: 'grey' },
})

const toneClass = computed(() => ({
  grape: 'text-primary bg-primary/10',
  leaf:  'text-signal-success bg-signal-success/15',
  grey:  'text-content-subtle bg-surface-sunken',
  warn:  'text-signal-error bg-signal-error/10',
}[props.tone] || 'text-content-subtle bg-surface-sunken'))
</script>
