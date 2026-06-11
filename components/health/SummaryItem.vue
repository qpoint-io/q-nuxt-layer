<template>
  <div class="flex gap-2 justify-between items-center hairline py-1 pr-2">
    <!-- Icon -->
    <div class="min-w-2">
      <UxIcon id="exclaim" v-if="status === 'hot'" class="h-[18px] text-signal-error ml-1" />
    </div>

    <div class="text-14 font-semi flex-1 mr-10" :class="status === 'hot' ? 'font-bold' : ''">{{ message }}</div>
    <div class="text-14 font-exbold" :class="status === 'hot' ? 'font-bold' : ''">{{ label }}</div>
    <div
      class="text-12 w-[34px] h-[34px] text-center rounded-full text-content border-3 border-surface font-semi shadow-sm"
      :class="getSeverityColor(status)"
    >
    </div>
  </div>
</template>

<script setup>
defineProps({
  status:  { type: String, required: true },
  label:   { type: String, default: '' },
  message: { type: String, default: '' },
})

function getSeverityColor(severity) {
  // Full literal class strings (Tailwind content scanning); warm rides
  // signal-warning/60 to keep the 4-step ladder within the token set.
  const colors = {
    hot:  'bg-signal-error',
    warn: 'bg-signal-warning',
    warm: 'bg-signal-warning/60',
    cool: 'bg-signal-success',
  }
  return colors[severity] || colors.cool
}
</script>
