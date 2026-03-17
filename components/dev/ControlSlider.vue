<template>
  <label class="control-slider">
    <span class="control-slider-label">{{ label }} <span v-if="suffix !== undefined" class="control-slider-value">{{ modelValue }}{{ suffix }}</span></span>
    <input type="range" class="control-slider-input" :min="min" :max="max" :step="step" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))" />
  </label>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  suffix: { type: String, default: undefined },
})

defineEmits(['update:modelValue'])
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
  color: #aaa;
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-slider-value {
  color: #60a5fa;
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
  background: #2a2a4e;
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
  background: #3949ab;
  cursor: pointer;
  border: 2px solid #60a5fa;
}

.control-slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3949ab;
  cursor: pointer;
  border: 2px solid #60a5fa;
}
</style>
