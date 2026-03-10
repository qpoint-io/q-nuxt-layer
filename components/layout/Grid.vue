<template>
  <div :class="`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columnsValue} ${gridClass} gap-8 lg:gap-24 `">
    <slot />
  </div>
</template>


<script setup>
const props = defineProps({
  class: { type: String, default: '' },
  columns: { default: 2 }
})

const gridClass = computed(() => {
  return props.class || 'grid'
})

const columnsValue = computed(() => {
  return typeof props.columns === 'string' ? parseInt(props.columns, 10) : props.columns
})
</script>
