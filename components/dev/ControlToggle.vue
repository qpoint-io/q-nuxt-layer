<template>
  <label class="control-toggle">
    <span class="control-toggle-label">{{ label }}</span>
    <input type="checkbox" class="control-toggle-input" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
    <span class="control-toggle-track" :class="{ 'control-toggle-track--on': modelValue }">
      <span class="control-toggle-thumb" />
    </span>
  </label>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: Boolean, required: true },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Token-backed with raw-channel fallbacks — see DevControls. */
.control-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-toggle-label {
  font-size: 0.75rem;
  color: rgb(var(--qp-content-muted, 170 170 170));
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.control-toggle-track {
  position: relative;
  width: 2rem;
  height: 1.1rem;
  background: rgb(var(--qp-stroke, 42 42 78));
  border-radius: 0.55rem;
  transition: background 0.15s ease;
  flex-shrink: 0;
}

.control-toggle-track--on {
  background: rgb(var(--qp-primary, 57 73 171));
}

.control-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.1rem - 4px);
  height: calc(1.1rem - 4px);
  background: rgb(var(--qp-content-subtle, 136 136 136));
  border-radius: 50%;
  transition: transform 0.15s ease, background 0.15s ease;
}

.control-toggle-track--on .control-toggle-thumb {
  transform: translateX(calc(2rem - 1.1rem));
  background: rgb(var(--qp-on-primary, 96 165 250));
}
</style>
