<template>
  <!-- Embed mode: show ONLY the embed component with no wrapper -->
  <FilterOldEmbed
    v-if="embed"
    ref="embedRef"
    :filters="filters.filter(f => f.key).map(f => ({ key: f.key, operator: f.operator, val: f.val ?? '' }))"
    :availableKeyDefs="availableKeyDefs"
    :valSuggestions="valSuggestions"
    :filterKeyDefs="filterKeyDefs"
    @update:filters="onEmbedFiltersUpdate"
    @requestKeySuggestions="onRequestKeySuggestions"
    @requestValSuggestions="onRequestValSuggestions"
  />

  <div v-else>
    <!-- label -->
    <div
      class="text-11 border-b-1 font-semi mb-2 flex justify-between"
      :class="disabled ? 'pointer-events-none opacity-80' : ''"
    >
      Filter:
      <div v-if="!onlyTime && !disabled && (filters.length > 0 || timeframe) && !isAdding" role="button" tabindex="0" class="flex items-center text-grape-500 hover:text-black cursor-pointer" @click="startAdd" @keydown.enter.prevent="startAdd" @keydown.space.prevent="startAdd">
        Add
        <UxIcon id="plus" class="w-[8px] ml-1" />
      </div>
    </div>

    <!-- is Disabled -->
    <div v-if="disabled" class="flex items-center gap-3 text-grey-400/80 text-16 font-semi text-nowrap ">
      <div>Not Applicable</div>
    </div>

    <!-- Time-only mode: just show the timeframe selector -->
    <div v-else-if="onlyTime" class="flex items-center gap-2 flex-wrap">
      <FilterOldTimeframe v-if="timeframe" :modelValue="timeframeValue" :options="timeframeOptions" @update:modelValue="$emit('update:timeframeValue', $event)" />
    </div>

    <!-- Has no filters and not adding (and no timeframe) -->
    <div v-else-if="filters.length == 0 && !isAdding && !timeframe && !disabled" role="button" tabindex="0" class="flex items-center text-grape text-16 font-bold text-nowrap cursor-pointer hover:text-black" @click="startAdd" @keydown.enter.prevent="startAdd" @keydown.space.prevent="startAdd">
      Add a Filter
      <UxIcon id="plus" class="w-[14px] ml-10" />
    </div>

    <!-- Filter list (adding inline edit + existing filters + timeframe) -->
    <div v-else-if="(filters.length > 0 || isAdding || timeframe) && !disabled" class="flex items-center gap-2 flex-wrap">
      <!-- Inline add (appears first/left) -->
      <FilterOldInlineEdit
        v-if="isAdding"
        :filterKeyDefs="filterKeyDefs"
        :availableKeyDefs="availableKeyDefs"
        :valSuggestions="currentValSuggestions"
        :initialOperator="FILTER_DEFAULT_OP"
        @complete="onAddComplete"
        @cancel="cancelAdd"
        @requestKeySuggestions="onRequestKeySuggestions({ applyExistingFilter: true })"
        @requestValSuggestions="onRequestValSuggestions({ key: $event.key, applyExistingFilter: true })"
      />

      <!-- Existing filters -->
      <template v-for="(filter, index) in filters" :key="filter.key">
        <!-- Inline edit mode for this filter -->
        <FilterOldInlineEdit
          v-if="editingIndex === index"
          :filterKeyDefs="filterKeyDefs"
          :initialKey="filter.key"
          :initialVal="filter.val"
          :initialOperator="filter.operator"
          :availableKeyDefs="availableKeyDefsForEdit(filter.key)"
          :valSuggestions="currentValSuggestions"
          :focusKey="false"
          @complete="onEditComplete(index, $event)"
          @cancel="cancelEdit"
          @requestKeySuggestions="onRequestKeySuggestions"
          @requestValSuggestions="onRequestValSuggestions"
        />
        <!-- Display mode -->
        <FilterOldItem v-else
          :_key="filter.key"
          :operator="filter.operator"
          :val="filter.val ?? ''"
          :isTagFilter="isTagFilter(filter.key)"
          @click="startEdit(index)"
          @delete="removeFilter(filter.key)"
        />
      </template>

      <!-- Timeframe filter (always last, before Manage) -->
      <FilterOldTimeframe v-if="timeframe" :modelValue="timeframeValue" :options="timeframeOptions" @update:modelValue="$emit('update:timeframeValue', $event)" />

      <!-- Manage link -->
      <div @click="openFilterManager" class="text-11 text-grape font-semi pl-2 cursor-pointer hover:text-black">Manage</div>
    </div>

    <!-- Modal -->
    <UxModal v-model:open="isManaging" :close-btn="false" :at-top="true">
      <FilterOldManage
        :filters="filters"
        :availableKeyDefs="availableKeyDefs"
        :filterKeyDefs="filterKeyDefs"
        :valSuggestions="valSuggestions"
        :timeframe="timeframe"
        :timeframeValue="timeframeValue"
        :timeframeOptions="timeframeOptions"
        @update:timeframeValue="$emit('update:timeframeValue', $event)"
        @close="onManageClose"
        @requestKeySuggestions="onRequestKeySuggestions"
        @requestValSuggestions="onRequestValSuggestions"
      />
    </UxModal>
  </div>
</template>

<!-- Presentational — the timeframe value itself (route query, store, whatever
     the consumer uses) is threaded through as timeframeValue/timeframeOptions
     rather than read from a store here. See FilterTimeframe. -->
<script setup>
// Props matching UxFilter interface
const props = defineProps({
  keySuggestions: { type: Array },
  filterKeyDefs : { type: Array, default: () => [] },
  valSuggestions: { type: Object },
  keyValFilters : { type: Array },
  showNewBtn    : { type: Boolean, default: true },
  showPlusIcon  : { type: Boolean, default: true },
  timeframe     : { type: Boolean, default: true },
  timeframeValue  : { default: null },
  timeframeOptions: { type: Array, default: () => [] },
  disabled      : { type: Boolean, default: false },
  onlyTime      : { type: Boolean, default: false },
  embed         : { type: Boolean, default: false },
})

// Emits matching UxFilter interface
const emit = defineEmits([
  'update:keyValFilters',
  'update:timeframeValue',
  'requestKeySuggestions',
  'requestValSuggestions'
])

// Modal state
const isManaging = ref(false)

// Inline editing state
const isAdding = ref(false)
const editingIndex = ref(null)
const currentEditKey = ref('')

// Embed mode ref
const embedRef = ref(null)

// keyValFilters: array of { key, val, operator? }. Internal format uses operator from utils/filters (eq, neq, ...).
const filters = computed({
  get: () => {
    return (props.keyValFilters || [])
      .filter(f => f.key)
      .map(f => ({
        key: f.key,
        operator: f.operator || FILTER_DEFAULT_OP,
        val: f.val
      }))
  },
  set: (newFilters) => {
    // backfill default OP if unspecified
    const keyValFilters = newFilters.map(f => ({
      key: f.key,
      operator: f.operator || FILTER_DEFAULT_OP,
      val: f.val
    }))
    emit('update:keyValFilters', keyValFilters)
  }
})

// Normalize to FilterKeyDefinition[]: from filterKeyDefs or keySuggestions (legacy)
const allKeyDefs = computed(() => {
  if (props.filterKeyDefs?.length > 0) {
    return props.filterKeyDefs
  }
  if (props.keySuggestions?.length > 0) {
    return props.keySuggestions.map((s) =>
      typeof s === 'string' ? { key: s, label: s, type: FilterType.ATTRIBUTE } : s,
    )
  }
  return []
})

// Available key defs for add (exclude used keys)
const availableKeyDefs = computed(() => {
  const usedKeys = filters.value.map((f) => f.key)
  return allKeyDefs.value.filter((d) => !usedKeys.includes(d.key))
})

const isTagFilter = (key) => {
  const def = props.filterKeyDefs?.find((d) => d.key === key)
  return !def || def.type === FilterType.TAG
}

// For editing, include the current filter's key in available suggestions
const availableKeyDefsForEdit = (currentKey) => {
  const usedKeys = filters.value.map((f) => f.key).filter((k) => k !== currentKey)
  return allKeyDefs.value.filter((d) => !usedKeys.includes(d.key))
}

// Current value suggestions based on the key being edited
const currentValSuggestions = computed(() => {
  if (!props.valSuggestions || !currentEditKey.value) return []
  return props.valSuggestions[currentEditKey.value] || []
})

// Handle key suggestion requests
const onRequestKeySuggestions = ({ applyExistingFilter } = {}) => {
  emit('requestKeySuggestions', { applyExistingFilter })
}

// Handle value suggestion requests
const onRequestValSuggestions = ({ key, applyExistingFilter } = {}) => {
  currentEditKey.value = key
  emit('requestValSuggestions', { key, applyExistingFilter })
}

// Start adding a new filter
const startAdd = () => {
  // If in embed mode, delegate to embed component
  if (props.embed && embedRef.value) {
    embedRef.value.startAdd()
    return
  }

  editingIndex.value = null
  isAdding.value = true
}

// Cancel adding
const cancelAdd = () => {
  isAdding.value = false
  currentEditKey.value = ''
}

// Complete adding a new filter
const onAddComplete = ({ key, val, operator }) => {
  const newFilters = [...(props.keyValFilters || []), { key, val, operator: operator || FILTER_DEFAULT_OP }]
  emit('update:keyValFilters', newFilters)
  isAdding.value = false
  currentEditKey.value = ''
}

// Start editing an existing filter
const startEdit = (index) => {
  isAdding.value = false
  editingIndex.value = index
  currentEditKey.value = filters.value[index].key
}

// Cancel editing
const cancelEdit = () => {
  editingIndex.value = null
  currentEditKey.value = ''
}

// Complete editing an existing filter
const onEditComplete = (index, { key, val, operator }) => {
  const newFilters = [...(props.keyValFilters || [])]
  newFilters[index] = { key, val, operator: operator || FILTER_DEFAULT_OP }
  emit('update:keyValFilters', newFilters)
  editingIndex.value = null
  currentEditKey.value = ''
}

// Open the filter manager modal
const openFilterManager = () => {
  // Cancel any inline editing first
  isAdding.value = false
  editingIndex.value = null
  isManaging.value = true
}

// Handle modal close with updated filters
const onManageClose = (updatedFilters) => {
  isManaging.value = false
  if (updatedFilters) {
    filters.value = updatedFilters
  }
}

// Remove a filter by key
const removeFilter = (keyToDelete) => {
  const newFilters = props.keyValFilters.filter(f => f.key !== keyToDelete)
  emit('update:keyValFilters', newFilters)
}

// Handle embed filters update (each item: { key, val, operator? })
const onEmbedFiltersUpdate = (updatedFilters) => {
  const withOperator = (updatedFilters || []).map(f => ({
    key: f.key,
    val: f.val,
    operator: f.operator || FILTER_DEFAULT_OP
  }))
  emit('update:keyValFilters', withOperator)
}

// Expose createFilter method for programmatic access (starts inline add)
const createFilter = () => {
  startAdd()
}

defineExpose({ createFilter })
</script>
