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
  const classes = {
    critical: { circle: 'bg-red-500', text: 'text-red-700' },
    high:     { circle: 'bg-orange-500', text: 'text-orange-700' },
    medium:   { circle: 'bg-yellow-500', text: 'text-yellow-700' },
    low:      { circle: 'bg-gray-400', text: 'text-gray-600' },
  }
  return classes[props.severity] || classes.low
})

const severityText = computed(() => {
  const textMap = { critical: 'crit!', high: 'high', medium: 'medium', low: 'low' }
  return textMap[props.severity] || props.severity
})
</script>
