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
  background: rgb(var(--qp-surface-sunken, 13 13 26));
  border-top: 1px solid rgb(var(--qp-stroke, 42 42 78));
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
  color: rgb(var(--qp-content-subtle, 85 85 85));
  transition: transform 0.15s;
}

.dev-control-export-arrow--open {
  transform: rotate(90deg);
}

.dev-control-export-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--qp-content-subtle, 85 85 85));
}

.dev-control-export-copy {
  background: rgb(var(--qp-primary, 57 73 171));
  border: 1px solid rgb(var(--qp-primary, 92 107 192));
  border-radius: 4px;
  color: rgb(var(--qp-content, 204 204 204));
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
}

.dev-control-export-copy:hover {
  /* brightness instead of a second primary shade — survives tokenization */
  filter: brightness(1.2);
}

.dev-control-export-copy--copied {
  background: rgb(var(--qp-success, 46 125 50));
  border-color: rgb(var(--qp-success, 76 175 80));
}

.dev-control-export-code {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  line-height: 1.4;
  color: rgb(var(--qp-info, 139 233 253));
  white-space: pre;
}
</style>
