<template>
  <thead class="sticky top-0 _table-head" :class="(compact) ? 'z-[1]' : 'z-[2]'">
    <slot/>
    <!-- border -->
  </thead>
</template>

<style scoped>
._table-head.td, ._table-head.th{
  padding: 0;
  border-top: none;
}
</style>

<script setup>
defineProps({
  compact: Boolean,
})
</script>
