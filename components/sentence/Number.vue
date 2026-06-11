<template>
  <input
    type="number"
    :value="modelValue"
    @input="onInput"
    :class="[pillClass, 'w-16 text-center']"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: [Number, String] },
})

const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', Number(e.target.value))
}

const pillClass = 'border-1 border-content rounded-full px-3 h-7 text-13 font-semi bg-surface cursor-pointer appearance-none'
</script>
