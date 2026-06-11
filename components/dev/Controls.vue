<template>
  <div class="dev-controls" :class="{ 'dev-controls--hidden': !visible }">
    <button class="dev-controls-toggle" @click="visible = !visible">
      {{ visible ? 'Hide Controls' : 'Controls' }}
    </button>
    <div v-show="visible" class="dev-controls-panel">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialVisible: { type: Boolean, default: true },
})

const visible = ref(props.initialVisible)
</script>

<style scoped>
/* Token-backed with raw-channel fallbacks: vue/-barrel consumers
   (qflow/qmap) don't load tokens.css and keep the original dark-navy
   look; token consumers follow the theme. No Tailwind/@apply here. */
.dev-controls {
  flex-shrink: 0;
  position: relative;
}

.dev-controls-toggle {
  position: absolute;
  top: -1.5rem;
  right: 0.75rem;
  color: rgb(var(--qp-content-subtle, 85 85 85));
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 1;
}

.dev-controls-toggle:hover {
  color: rgb(var(--qp-content-muted, 153 153 153));
}

.dev-controls-panel {
  background: rgb(var(--qp-surface-sunken, 22 22 42));
  border-top: 1px solid rgb(var(--qp-stroke, 42 42 78));
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
