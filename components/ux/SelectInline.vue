<template>
  <!-- An inline view switcher: the current option's label and a small primary
       caret, no box — for a card's title row (DataMachine #title-right) or a
       sentence. The menu, keyboard and accessibility are a native <select>,
       invisible and stretched over the label (the FilterTriggerBar key-segment
       idiom). The focus ring is keyboard-only: Chrome reports a clicked <select>
       as :focus-visible, so a pointer press suppresses the ring until the next
       key press (the trigger bar dropped its ring for that reason, c95). Never
       wider than its container: a long label truncates, the caret stays. -->
  <span
    class="group relative inline-flex max-w-full items-center gap-1.5 rounded-4"
    :class="focused && !viaPointer ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-surface' : ''"
  >
    <!-- option values are indexes, so numbers and other non-string values round-trip unchanged -->
    <select
      :value="selectedIndex"
      :aria-label="ariaLabel"
      class="absolute inset-0 w-full cursor-pointer opacity-0"
      @change="onChange"
      @pointerdown="viaPointer = true"
      @keydown="viaPointer = false"
      @focus="focused = true"
      @blur="focused = false"
    >
      <option v-for="(o, i) in options" :key="i" :value="i">{{ o.label ?? o.value }}</option>
    </select>
    <span class="min-w-0 truncate text-14 font-bold text-content-muted group-hover:text-content">{{ currentLabel }}</span>
    <UxIcon id="triangle" class="w-2.5 shrink-0 rotate-180 text-primary" />
  </span>
</template>

<script setup>
const props = defineProps({
  // { value, label }[] — label falls back to the value
  options: { type: Array, default: () => [] },
  // the selected option's value, compared with === (untyped: any primitive)
  modelValue: { default: undefined },
  // the control's accessible name — the visible text is only the current option
  ariaLabel: { type: String, default: 'View' },
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)
const viaPointer = ref(false)

// no match → the first option shows (and the select agrees), nothing emitted
const selectedIndex = computed(() => Math.max(0, props.options.findIndex(o => o.value === props.modelValue)))
const currentLabel = computed(() => {
  const o = props.options[selectedIndex.value]
  return o ? (o.label ?? o.value) : ''
})

const onChange = e => {
  const o = props.options[Number(e.target.value)]
  if (o) emit('update:modelValue', o.value)
}
</script>
