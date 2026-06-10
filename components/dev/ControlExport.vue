<template>
  <div v-if="exportFn" class="dev-control-export">
    <div class="dev-control-export-header">
      <button class="dev-control-export-toggle" @click="expanded = !expanded">
        <span class="dev-control-export-arrow" :class="{ 'dev-control-export-arrow--open': expanded }">&#9654;</span>
        <span class="dev-control-export-label">Export</span>
      </button>
      <button
        v-if="expanded"
        class="dev-control-export-copy"
        :class="{ 'dev-control-export-copy--copied': copied }"
        @click="copy"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre v-if="expanded" class="dev-control-export-code">{{ preview }}</pre>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  config: { type: Object, required: true },
  exportFn: { type: Function, default: null },
})

const preview = computed(() => props.exportFn?.(props.config) ?? '')

const expanded = ref(false)
const copied = ref(false)
function copy() {
  navigator.clipboard.writeText(preview.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
.dev-control-export {
  background: #0d0d1a;
  border-top: 1px solid #2a2a4e;
  padding: 0.5rem 0.75rem;
}

.dev-control-export-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.dev-control-export-toggle {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.dev-control-export-arrow {
  font-size: 0.5rem;
  color: #555;
  transition: transform 0.15s;
}

.dev-control-export-arrow--open {
  transform: rotate(90deg);
}

.dev-control-export-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #555;
}

.dev-control-export-copy {
  background: #3949ab;
  border: 1px solid #5c6bc0;
  border-radius: 4px;
  color: #ccc;
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
}

.dev-control-export-copy:hover {
  background: #5c6bc0;
}

.dev-control-export-copy--copied {
  background: #2e7d32;
  border-color: #4caf50;
}

.dev-control-export-code {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  line-height: 1.4;
  color: #8be9fd;
  white-space: pre;
}
</style>
