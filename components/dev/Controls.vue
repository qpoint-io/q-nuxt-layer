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

defineProps({
  initialVisible: { type: Boolean, default: true },
})

const visible = ref(true)
</script>

<style scoped>
.dev-controls {
  flex-shrink: 0;
  position: relative;
}

.dev-controls-toggle {
  position: absolute;
  top: -1.5rem;
  right: 0.75rem;
  background: #16162a;
  border: 1px solid #2a2a4e;
  border-bottom: none;
  color: #555;
  font-size: 0.6rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 1;
}

.dev-controls-toggle:hover {
  color: #999;
}

.dev-controls-panel {
  background: #16162a;
  border-top: 1px solid #2a2a4e;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
