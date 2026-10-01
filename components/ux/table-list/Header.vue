<template>
  <!-- Pins under the page's sticky band (`--q-sticky-top`, published by
       useStickyBand; 0 when the page has none). Compact tables are nested
       readouts and pin to their own top. Inside a scroll box (UxOverflowX,
       UxModal) the band offset is reset to 0. -->
  <thead class="sticky _table-head" :class="(compact) ? 'top-0 z-[1]' : '_pin z-[2]'">
    <slot/>
    <!-- border -->
  </thead>
</template>

<style scoped>
._pin{
  top: var(--q-sticky-top, 0px);
}
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
