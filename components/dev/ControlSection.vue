<template>
  <div class="control-section">
    <div class="section-header" @click="open = !open">
      <span class="section-title">{{ title }}</span>
      <span class="section-toggle">{{ open ? 'hide' : 'show' }}</span>
    </div>
    <div v-show="open" class="section-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  collapsed: { type: Boolean, default: false },
})

const open = ref(!props.collapsed)
</script>

<style scoped>
.control-section {
  min-width: 80px;
  margin-top: 0;
  flex-shrink: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(var(--qp-content-subtle, 136 136 136));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-toggle {
  font-size: 0.6rem;
  color: rgb(var(--qp-content-subtle, 85 85 85));
  text-transform: lowercase;
}

.section-toggle:hover {
  color: rgb(var(--qp-content-muted, 153 153 153));
}

.section-body {
  margin-top: 0.5rem;
}
</style>
