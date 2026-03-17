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
.control-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-select-label {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-select-input {
  padding: 0.35rem 0.5rem;
  border: 1px solid #2a2a4e;
  border-radius: 4px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 0.8rem;
}
</style>
