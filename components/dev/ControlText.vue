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
.control-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.control-text-label {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  min-width: 7rem;
  text-align: right;
}

.control-text-input {
  padding: 0.35rem 0.5rem;
  border: 1px solid #2a2a4e;
  border-radius: 4px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 0.8rem;
  font-family: monospace;
  outline: none;
  min-width: 80px;
}

.control-text-input:focus {
  border-color: #3949ab;
}
</style>
