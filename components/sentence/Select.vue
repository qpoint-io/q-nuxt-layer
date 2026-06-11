<template>
  <div class="relative inline-flex items-center ">
    <select
      :value="modelValue"
      @change="onChange"
      class="border-1 border-content rounded-full py-0 pr-12 pl-3 text-13 font-semi bg-surface cursor-pointer appearance-none"
    >
      <slot />
    </select>
    <!-- <UxIcon id="triangle" class="absolute right-2 w-[10px] text-black rotate-180 pointer-events-none" /> -->
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number] },
})

const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<style scoped>
select::-ms-expand { display: none; }
select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}
</style>
