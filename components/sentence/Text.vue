<template>
  <input
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
    :class="[pillClass, 'flex-1 min-w-[200px]']"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: String },
  placeholder: { type: String },
})

const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

const pillClass = 'border-1 border-black rounded-full px-3 h-7 text-13 font-semi bg-white cursor-pointer appearance-none'
</script>
