<template>
  <div class="flex items-center gap-3">
    <div class="border-1 rounded-4 border-grape px-2">
      <UxSimpleSelect
        :model-value="value"
        class="text-content"
        @update:model-value="$emit('update:value', $event)"
      >
        <option v-for="o in options" :key="o">{{ o }}</option>
      </UxSimpleSelect>
    </div>
    <button class="text-12 font-semi leading-none text-grape-500">Config..</button>
    <button
      v-if="deletable"
      class="flex h-4 w-4 shrink-0 items-center justify-center text-content-subtle hover:text-error"
      @click="$emit('delete')"
    >
      <UxIcon id="x" class="w-4" />
    </button>
  </div>
</template>

<script setup>
// A value set at this level of the enforcement cascade: minimal select
// (UxSimpleSelect) with a "Config.." link and, when `deletable`, an ✕ that
// emits `delete` (clear this level's value, falling back to the inherited
// one). Adding another value to the cell is the parent's concern — compose
// an add button alongside, outside this component.
defineProps({
  value: { type: String, required: true },
  options: { type: Array, required: true },
  deletable: { type: Boolean, default: false },
})

defineEmits(['update:value', 'delete'])
</script>
