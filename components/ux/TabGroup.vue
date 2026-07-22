<template>
  <div class="flex items-center justify-between">
    <div class="inline-flex rounded-8 border border-stroke overflow-hidden">
      <button
        v-for="opt in normalized"
        :key="opt.value"
        class="px-3 py-1.5 text-13 font-med"
        :class="opt.value === modelValue
          ? 'bg-primary/15 text-primary'
          : 'bg-surface text-content-subtle hover:text-primary'"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
    <div v-if="$slots.right">
      <slot name="right" />
    </div>
  </div>
</template>

<!-- Compact joined-segment switcher (the 24h/7d/30d range-picker look).
     Always exactly one segment selected (clicking the active segment is a
     no-op) — for filter semantics with deselection use UxFilterGroup. -->

<script setup>
const props = defineProps({
  // strings or { value, label } objects
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: null },
})

defineEmits(['update:modelValue'])

const normalized = computed(() =>
  props.options.map((o) => (typeof o === 'object' ? o : { value: o, label: o })),
)
</script>
