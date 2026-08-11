<template>
  <span class="relative inline-flex items-center">
    <!-- Invisible mirror of the SELECTED option's label — it is the only
         in-flow content, so it sets the pill's width. The select itself is
         absolutely positioned: a native select always sizes to its WIDEST
         option, and even min-w-0 in a grid can't stop that max-content from
         driving the track — taking it out of flow can. Same font/padding/
         border metrics as the select so the widths match exactly. -->
    <span
      class="invisible whitespace-pre border-1 border-transparent py-0 pr-8 pl-3 text-13 font-semi"
      aria-hidden="true"
    >{{ label }}</span>
    <select
      ref="el"
      :value="modelValue"
      @change="onChange"
      class="absolute inset-0 h-full w-full border-1 border-content rounded-full py-0 pr-8 pl-3 text-13 font-semi bg-surface cursor-pointer"
    >
      <slot />
    </select>
  </span>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number] },
})

const emit = defineEmits(['update:modelValue'])

const el = ref(null)
// SSR seed: the value itself (right whenever label === value, which covers
// sentence-style options); the mounted sync corrects display-label cases
// like <option value="http">Send HTTP Request</option>.
const label = ref(String(props.modelValue ?? ''))
const sync = () => {
  label.value = el.value?.selectedOptions?.[0]?.text || String(props.modelValue ?? '')
}
onMounted(sync)
onUpdated(sync)
watch(() => props.modelValue, () => nextTick(sync))

function onChange(e) {
  emit('update:modelValue', e.target.value)
  nextTick(sync)
}
</script>

<style scoped>
/* The chevron is @tailwindcss/forms' background-image SVG — its stroke is
   baked into the data URI, so text-color utilities can't recolor it. Same
   path, re-stroked grape-400 (#AB86F6 — keep in sync with the token). */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23AB86F6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}
</style>
