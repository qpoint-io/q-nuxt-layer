<template>
  <label class="control-slider">
    <span class="control-slider-label">{{ label }} <span class="control-slider-value">{{ displayValue }}{{ suffix || '' }}</span></span>
    <input type="range" class="control-slider-input" :min="min" :max="max" :step="step" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))" />
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  suffix: { type: String, default: undefined },
})

defineEmits(['update:modelValue'])

const displayValue = computed(() => {
  const decimals = props.step < 1 ? String(props.step).split('.')[1]?.length || 1 : 0
  return props.modelValue.toFixed(decimals)
})
</script>

<style scoped>
.control-slider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-slider-label {
  font-size: 0.75rem;
  color: rgb(var(--qp-content-muted, 170 170 170));
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-slider-value {
  color: rgb(var(--qp-primary, 96 165 250));
  font-family: monospace;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  margin-left: 0.4rem;
}

.control-slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgb(var(--qp-stroke, 42 42 78));
  border-radius: 2px;
  outline: none;
  min-width: 80px;
  margin-top: 0;
}

.control-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgb(var(--qp-primary, 57 73 171));
  cursor: pointer;
  border: 2px solid rgb(var(--qp-surface, 96 165 250));
}

.control-slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgb(var(--qp-primary, 57 73 171));
  cursor: pointer;
  border: 2px solid rgb(var(--qp-surface, 96 165 250));
}
</style>
