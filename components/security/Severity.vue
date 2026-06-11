<template>
  <div class="flex items-center gap-2 text-12">
    <div
      class="w-3 h-3 rounded-full flex-shrink-0"
      :class="severityClasses.circle"
    ></div>
    <span
      class="text-sm font-medium"
      :class="severityClasses.text"
    >
      {{ severityText }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  severity: {
    type: String,
    required: true,
    validator: (value) => ['critical', 'high', 'medium', 'low'].includes(value)
  },
})

const severityClasses = computed(() => {
  // Full literal class strings (Tailwind content scanning); the /60 tier
  // keeps the 4-step severity ladder within the signal-token vocabulary.
  const classes = {
    critical: { circle: 'bg-signal-error', text: 'text-signal-error' },
    high:     { circle: 'bg-signal-warning', text: 'text-signal-warning' },
    medium:   { circle: 'bg-signal-warning/60', text: 'text-signal-warning/80' },
    low:      { circle: 'bg-stroke-strong', text: 'text-content-muted' },
  }
  return classes[props.severity] || classes.low
})

const severityText = computed(() => {
  const textMap = { critical: 'crit!', high: 'high', medium: 'medium', low: 'low' }
  return textMap[props.severity] || props.severity
})
</script>
