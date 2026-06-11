<template>
  <label class="control-select">
    <span class="control-select-label">{{ label }}</span>
    <select class="control-select-input" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
})

defineEmits(['update:modelValue'])

const normalizedOptions = computed(() =>
  props.options.map(o => typeof o === 'string' ? { value: o, label: o.charAt(0).toUpperCase() + o.slice(1) } : o)
)
</script>

<style scoped>
/* Token-backed with raw-channel fallbacks — see DevControls. */
.control-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-select-label {
  font-size: 0.75rem;
  color: rgb(var(--qp-content-muted, 170 170 170));
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-select-input {
  padding: 0.35rem 0.5rem;
  border: 1px solid rgb(var(--qp-stroke, 42 42 78));
  border-radius: 4px;
  background: rgb(var(--qp-surface, 26 26 46));
  color: rgb(var(--qp-content, 204 204 204));
  font-size: 0.8rem;
}
</style>
