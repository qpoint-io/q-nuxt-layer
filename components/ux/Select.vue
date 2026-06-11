<template>
  <select
    :value="modelValue"
    class="_qp-select-caret min-w-[160px] rounded-8 border border-stroke bg-surface px-3 py-2 pr-8 text-14 text-content bg-no-repeat cursor-pointer appearance-none"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot />
  </select>
</template>

<!-- Bordered form select. For the inline borderless variant use UxSimpleSelect. -->
<!-- Unscoped: same theme-aware caret as UxSimpleSelect (identical rule, harmless dedupe). -->
<style>
._qp-select-caret {
  background-position: right 0.4rem center;
  background-size: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
.dark ._qp-select-caret {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%23AAAAAA' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
</style>

<script setup>
defineProps({
  modelValue: { type: [String, Number] },
})

defineEmits(['update:modelValue'])
</script>
