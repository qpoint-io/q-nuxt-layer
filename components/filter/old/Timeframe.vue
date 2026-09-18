<template>
  <div class="relative" ref="containerRef">
    <!-- Filter pill -->
    <div
      class="flex items-center gap-1 text-11 font-med border-2 border-grape-400 rounded-full h-6 px-3 whitespace-nowrap cursor-pointer hover:bg-grape-50 transition-colors"
      @click="toggleDropdown"
    >
      <div class="text-grey-500/90">When</div>
      <div class="text-grey-500/90"> = </div>
      <div>{{ currentLabel }}</div>
      <UxIcon id="down-arrow" class="w-[8px] ml-1 text-grape-400" />
    </div>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-50 top-full left-0 mt-2 bg-white border border-grey-200 rounded-lg shadow-lg overflow-hidden min-w-[160px]"
    >
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="px-4 hover:bg-grape-100 cursor-pointer text-13 flex items-center justify-between border-b-1 border-b-grey-200"
        :class="{ 'bg-grape-50': modelValue === option.value }"
      >
        <span>{{ option.label }}</span>
        <UxIcon id="check" v-if="modelValue === option.value" class="w-3 text-grape" />
      </div>
    </div>
  </div>
</template>

<!-- Presentational only — the timeframe value lives wherever the consumer
     keeps it (route query, store, local state). Wire that up locally and
     pass it in as modelValue/options. -->
<script setup>
const props = defineProps({
  modelValue: { default: null },
  // { value, label }[]
  options: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue'])

// Dropdown state
const showDropdown = ref(false)
const containerRef = ref(null)

// Compute current label
const currentLabel = computed(() => {
  const option = props.options.find(o => o.value === props.modelValue)
  return option?.label ?? props.options[0]?.label ?? ''
})

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Select an option
const selectOption = (option) => {
  emit('update:modelValue', option.value)
  showDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
