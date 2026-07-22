<template>
  <div class="flex items-start gap-2.5">
    <div class="flex  items-center gap-3">
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
    </div>
    <slot />
    <button
      v-if="add"
      class="mt-1 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-grape-400 bg-surface text-content"
      @click="$emit('add')"
    >
      <UxIcon id="plus" class="h-3 w-3" />
    </button>
    <div v-else class="w-[26px] shrink-0"></div>
  </div>
</template>

<script setup>
// A value set at this level of the enforcement cascade: minimal select
// (UxSimpleSelect) with a "Configure.." link and an optional ⊕ add button
// emitting `add` (absent buttons keep a 26px spacer so columns stay aligned,
// per the Figma design). The default slot renders between "Config.." and the
// ⊕ — for per-row actions a consumer stacks alongside, e.g. a remove button.
defineProps({
  value: { type: String, required: true },
  options: { type: Array, required: true },
  add: { type: Boolean, default: false },
})

defineEmits(['update:value', 'add'])
</script>
