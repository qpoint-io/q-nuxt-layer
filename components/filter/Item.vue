<!-- A column in Filter's table — key and operator are fixed here (not editable);
     only the value is interactive, via a closed dropdown over valSuggestions.
     Change the key or operator itself in the Manage modal. -->
<template>
  <div ref="containerRef" class="relative flex flex-col min-w-0">
    <div class="flex items-center justify-between gap-2 text-13 font-med italic text-blue px-3 border-b-2 border-blue/40 min-h-[32px]">
      <span class="truncate">{{ _key }}:</span>
      <button type="button" class="text-content-subtle hover:text-content shrink-0 flex items-center" @click.stop="$emit('delete')">
        <UxIcon id="x" class="w-4" />
      </button>
    </div>
    <div
      role="button" tabindex="0"
      class="flex items-center gap-2 text-13 font-bold text-blue bg-surface px-3 whitespace-nowrap"
      :class="[isTagFilter ? '' : 'cursor-pointer hover:bg-blue/5', roundLeft ? 'rounded-bl-4' : '']"
      @click="toggleDropdown" @keydown.enter.prevent="toggleDropdown" @keydown.space.prevent="toggleDropdown"
    >
      <UxIcon v-if="operator === 'neq'" id="no" class="w-3 shrink-0" />
      <span class="truncate">{{ displayValue }}</span>
      <UxIcon v-if="!isTagFilter" id="down-arrow" class="w-3 shrink-0 opacity-50" />
    </div>

    <div v-if="showDropdown && valSuggestions.length > 0"
      class="absolute z-50 top-full left-0 mt-1 bg-surface border border-stroke rounded shadow-lg overflow-y-auto min-w-[160px] max-h-[300px]">
      <div v-for="suggestion in valSuggestions" :key="suggestion"
        @click="selectVal(suggestion)"
        class="px-3 py-2 hover:bg-primary/10 cursor-pointer text-12 text-content"
        :class="{ 'bg-primary/5': suggestion === val }">
        {{ formatVal ? formatVal(suggestion) : suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  _key: { type: String },
  val: { type: String },
  operator: { type: String },
  isTagFilter: { type: Boolean, default: false },
  // string[] offered in the value dropdown — the current key's suggestions.
  valSuggestions: { type: Array, default: () => [] },
  // Display-only formatter from the key definition (FilterKeyDefinition.formatVal).
  formatVal: { type: Function, default: null },
  // True when this is the table's leftmost column, so its value box's
  // bottom-left corner can match the table's rounded corner (the table
  // itself has no overflow-hidden, so nothing does this automatically).
  roundLeft: { type: Boolean, default: false },
})

const emit = defineEmits(['delete', 'update:val'])

const displayValue = computed(() => {
  if (props.isTagFilter && !props.val) return 'tag exists'
  return props.formatVal ? props.formatVal(props.val ?? '') : props.val
})

const showDropdown = ref(false)

const toggleDropdown = () => {
  if (props.isTagFilter) return
  showDropdown.value = !showDropdown.value
}

const selectVal = (val) => {
  emit('update:val', val)
  showDropdown.value = false
}

const containerRef = ref(null)

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
