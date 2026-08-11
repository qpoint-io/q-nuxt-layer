<template>
  <input
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    :size="size"
    @input="onInput"
    :class="pillClass"
  />
</template>

<script setup>
// Sized to its content via the native `size` attribute — the pill grows as
// you type, so it sits inline in a sentence like SentenceSelect/Number do.
// Callers that want a fixed or filling width pass classes (e.g. "flex-1").
const props = defineProps({
  modelValue: { type: String },
  placeholder: { type: String },
})

const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

// Content length wins; fall back to the placeholder so empty inputs still fit
// their hint. Floor of 4 keeps the pill clickable when both are empty.
const size = computed(() =>
  Math.max(4, String(props.modelValue ?? '').length, String(props.placeholder ?? '').length) + 1,
)

const pillClass = 'border-1 border-content rounded-full px-3 h-7 text-13 font-semi bg-surface cursor-pointer appearance-none'
</script>
