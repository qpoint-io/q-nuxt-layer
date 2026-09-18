<!-- Presentational — like the rest of the Filter namespace, this doesn't touch
     any store. A consumer wires update:modelValue/update:filterKey into the
     same keyValFilters state that feeds its Filter bar so the two stay in
     sync (see phase2-global-filter.vue). -->
<template>
  <div class="inline-flex ml-2 items-stretch rounded-full rounded-tl-4 rounded-bl-4 bg-surface border-2 border-blue">
    <img class="w-12 -ml-2" :src="filterEndcap" />

    <div class="flex items-center gap-2 px-4 border-l-1 border-r-1 border-stroke shrink-0">
      <span class="text-14 italic text-blue whitespace-nowrap">Add Filter</span>
      <UxIcon id="arrow-right" class="w-2 text-blue" />
      <select
        v-if="filterKeyDefs.length > 1"
        :value="filterKey"
        @change="$emit('update:filterKey', $event.target.value)"
        class="text-14 font-bold text-blue bg-transparent border-none outline-none focus:ring-0 cursor-pointer pr-4"
      >
        <option v-for="def in filterKeyDefs" :key="def.key" :value="def.key">{{ def.label ?? def.key }}</option>
      </select>
      <span v-else class="text-14 font-bold text-blue whitespace-nowrap">{{ currentKeyLabel }}</span>
    </div>

    <div class="flex items-center gap-2 px-3 py-1.5 flex-wrap">
      <button
        type="button"
        class="text-12 font-med rounded-[6px] border-2 px-4  whitespace-nowrap transition-colors"
        :class="modelValue == null ? 'border-blue bg-blue/10 text-blue' : 'border-stroke text-content-subtle hover:border-blue hover:text-blue'"
        @click="$emit('update:modelValue', null)"
      >
        View All
      </button>
      <button
        v-for="option in options" :key="option.value"
        type="button"
        class="text-12 font-med rounded-[6px] border-2 px-4  whitespace-nowrap transition-colors"
        :class="modelValue === option.value ? 'border-blue bg-blue/10 text-blue' : 'border-stroke text-content-subtle hover:border-blue hover:text-blue'"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import filterEndcap from '~/assets/svgs/filter/bar.svg'

const props = defineProps({
  // FilterKeyDefinition[] — only rendered as a dropdown when there's more
  // than one; a single fixed key renders as static label text.
  filterKeyDefs: { type: Array, default: () => [] },
  filterKey: { type: String, default: '' },
  // { value, label }[] — quick-select values for the current key.
  options: { type: Array, default: () => [] },
  // Currently selected value; null/undefined = "View All".
  modelValue: { default: null },
})

defineEmits(['update:modelValue', 'update:filterKey'])

const currentKeyLabel = computed(() => {
  const def = props.filterKeyDefs.find(d => d.key === props.filterKey)
  return def?.label ?? def?.key ?? props.filterKey
})
</script>
