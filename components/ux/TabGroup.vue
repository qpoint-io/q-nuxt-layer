<template>
  <div class="flex items-center justify-between">
    <div class="inline-flex rounded-8 border border-content overflow-hidden">
      <button
        v-for="opt in normalized"
        :key="opt.value"
        class="px-2.5 py-0 text-12 leading-5 font-med"
        :class="opt.value === modelValue
          ? 'bg-content text-surface'
          : 'bg-transparent text-content hover:bg-content/10'"
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
     Ink, not tint (design c110, Mark 2026-10-02): the selected segment is
     solid content-on-surface (black/white, inverting in dark mode through the
     tokens), the rest are transparent with content text, inside a content
     border; short (py-0, text-12 on a 20 px line — leading-5, not the scale's 24).
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
