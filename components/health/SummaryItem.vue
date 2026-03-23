<template>
  <div class="flex gap-2 justify-between items-center hairline py-1 pr-2">
    <!-- Icon -->
    <div class="min-w-2">
      <UxIcon id="exclaim" v-if="status === 'hot'" class="h-[18px] text-red ml-1" />
    </div>

    <div class="text-14 font-semi flex-1 mr-10" :class="status === 'hot' ? 'font-bold' : ''">{{ message }}</div>
    <div class="text-14 font-exbold" :class="status === 'hot' ? 'font-bold' : ''">{{ label }}</div>
    <div
      class="text-12 w-[34px] h-[34px] text-center rounded-full text-gray-900 border-3 border-white font-semi shadow-sm"
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
  const colors = {
    hot:  'bg-[#FE0800]',
    warn: 'bg-[#ffc368]',
    warm: 'bg-[#f9db68]',
    cool: 'bg-[#8adf73]',
  }
  return colors[severity] || colors.cool
}
</script>
