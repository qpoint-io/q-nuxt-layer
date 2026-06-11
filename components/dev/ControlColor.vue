<template>
  <div class="control-color">
    <span class="control-color-label">{{ label }}</span>
    <div class="control-color-field">
      <div class="control-color-swatch" :style="{ background: swatchColor }">
        <input type="color" class="control-color-native" :value="hexForPicker" @input="onPickerInput" />
      </div>
      <span class="control-color-hash">#</span>
      <input type="text" class="control-color-input" :value="modelValue" :placeholder="placeholder" maxlength="6" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: 'ffffff' },
})

const emit = defineEmits(['update:modelValue'])

const swatchColor = computed(() => {
  const v = props.modelValue || props.placeholder
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v}`
  return v
})

const hexForPicker = computed(() => {
  const v = props.modelValue || props.placeholder
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v}`
  return '#ffffff'
})

function onPickerInput(e) {
  emit('update:modelValue', e.target.value.slice(1))
}
</script>

<style scoped>
.control-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-color-label {
  font-size: 0.75rem;
  color: rgb(var(--qp-content-muted, 170 170 170));
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-color-field {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid rgb(var(--qp-stroke, 42 42 78));
  border-radius: 4px;
  background: rgb(var(--qp-surface, 26 26 46));
  overflow: hidden;
}

.control-color-swatch {
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  border-right: 1px solid rgb(var(--qp-stroke, 42 42 78));
}

.control-color-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  padding: 0;
  border: none;
}

.control-color-hash {
  color: rgb(var(--qp-content-subtle, 102 102 102));
  font-family: monospace;
  font-size: 0.8rem;
  padding-left: 0.4rem;
  user-select: none;
}

.control-color-input {
  width: 4.5rem;
  padding: 0.3rem 0.4rem 0.3rem 0.15rem;
  border: none;
  background: transparent;
  color: rgb(var(--qp-content, 204 204 204));
  font-family: monospace;
  font-size: 0.8rem;
  outline: none;
}
</style>
