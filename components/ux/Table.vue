<template>
  <table class="ux-table w-full text-14" :class="[`_${variant}`, { _hover: hover }]">
    <slot />
  </table>
</template>

<script setup>
defineProps({
  // line = underlined header (doc/API tables), band = grey header band (dashboards)
  variant: { type: String, default: 'line' },
  // row hover highlight
  hover:   { type: Boolean, default: false },
})
</script>

<style scoped>
/* Static doc/content table. For sortable/searchable/expandable data, use UxTableList. */
.ux-table :deep(tbody) {
  @apply text-content-muted;
}

.ux-table._line :deep(thead tr) {
  @apply text-left border-b border-stroke;
}
.ux-table._line :deep(th) {
  @apply py-2 pr-4 font-semi text-content;
}
.ux-table._line :deep(tbody tr) {
  @apply border-b border-stroke;
}
.ux-table._line :deep(td) {
  @apply py-2 pr-4;
}

.ux-table._band :deep(thead tr) {
  @apply bg-surface-sunken text-left text-12 text-content-muted uppercase tracking-wider;
}
.ux-table._band :deep(th) {
  @apply px-4 py-3 font-semi;
}
.ux-table._band :deep(tbody) {
  @apply divide-y divide-stroke;
}
.ux-table._band :deep(td) {
  @apply px-4 py-2.5;
}

.ux-table._hover :deep(tbody tr) {
  @apply transition-colors;
}
.ux-table._hover :deep(tbody tr:hover) {
  @apply bg-surface-sunken;
}
</style>
