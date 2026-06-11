<template>
  <label class="control-text">
    <span class="control-text-label">{{ label }}</span>
    <input type="text" class="control-text-input" :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" />
  </label>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Token-backed with raw-channel fallbacks — see DevControls. */
.control-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-text-label {
  font-size: 0.75rem;
  color: rgb(var(--qp-content-muted, 170 170 170));
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-text-input {
  padding: 0.35rem 0.5rem;
  border: 1px solid rgb(var(--qp-stroke, 42 42 78));
  border-radius: 4px;
  background: rgb(var(--qp-surface, 26 26 46));
  color: rgb(var(--qp-content, 204 204 204));
  font-size: 0.8rem;
  font-family: monospace;
  outline: none;
  min-width: 80px;
}

.control-text-input:focus {
  border-color: rgb(var(--qp-primary, 57 73 171));
}
</style>
