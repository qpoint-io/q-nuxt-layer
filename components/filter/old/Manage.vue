<template>
  <div class="">
    <!-- header -->
    <div class="flex justify-between hairline pb-3">
      <div class="font-bold">Filter</div>
      <div class="flex gap-4 text-12 text-grape">
      </div>
    </div>

    <!-- filters -->
    <div class="mb-6">
      <template v-for="(filter, index) in localFilters" :key="filter.key + '-' + index">
        <!-- Display mode -->
        <FilterOldManageItem
          v-if="editingIndex !== index"
          :filter="filter"
          :filterKeyDefs="filterKeyDefs"
          @click="startEdit(index)"
          @delete="removeFilter(index)"
        />

        <!-- Edit mode for existing filter -->
        <div v-else class="flex items-center gap-3 py-2 hairline" @focusout="onEditRowFocusOut">
          <!-- Key selection -->
          <div class="relative">
            <input
              ref="editKeyInputRef"
              v-model="editingFilter.key"
              @focus="onEditKeyFocus"
              @blur="onEditKeyBlur"
              @input="filterEditKeySuggestions"
              @keydown.tab.prevent="selectFirstEditKeySuggestion"
              @keydown.enter.prevent="selectFirstEditKeySuggestion"
              @keydown.escape="cancelEdit"
              placeholder="Select key..."
              class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[140px] focus:outline-none focus:border-grape-400"
            />
            <!-- Key suggestions dropdown -->
            <div v-if="showEditKeySuggestions && filteredEditKeySuggestions.length > 0"
              class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[140px] max-h-[500px]">
              <div v-for="def in filteredEditKeySuggestions" :key="def.key"
                @mousedown.prevent="selectEditKey(def.key)"
                class="px-3 hover:bg-grape-100 cursor-pointer text-14 border-b-1 border-b-grey-200">
                {{ def.label ?? def.key }}
              </div>
            </div>
          </div>

          <select
            ref="editOperatorSelectRef"
            v-model="editingFilter.operator"
            :disabled="isOperatorLocked(editingFilter.key)"
            @change="onEditOperatorChange"
            class="text-14 font-med border border-grey-200 rounded pl-2 pr-7 py-1 focus:outline-none focus:border-grape-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option v-for="op in editingFilterValidOps" :key="op" :value="op">{{ FILTER_OP_LABELS[op] }}</option>
          </select>

          <!-- Value selection -->
          <div class="relative">
            <input
              ref="editValInputRef"
              v-model="editingFilter.val"
              @focus="onEditValFocus"
              @blur="onEditValBlur"
              @input="filterEditValSuggestions"
              @keydown.tab.prevent="selectFirstEditValSuggestion"
              @keydown.enter.prevent="confirmEdit"
              @keydown.escape="cancelEdit"
              placeholder="Enter value..."
              class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[160px] focus:outline-none focus:border-grape-400"
            />
            <!-- Value suggestions dropdown -->
            <div v-if="showEditValSuggestions && filteredEditValSuggestions.length > 0"
              class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[160px] max-h-[500px]">
              <div v-for="suggestion in filteredEditValSuggestions" :key="suggestion"
                @mousedown.prevent="selectEditVal(suggestion)"
                class="px-3 py-2 hover:bg-grape-100 cursor-pointer text-14 border-b-1 border-b-grey-200">
                {{ suggestion }}
              </div>
            </div>
          </div>

          <!-- Cancel button for edit -->
          <div @click="cancelEdit" class="flex text-12 gap-1 text-grey-400 hover:text-black cursor-pointer ml-auto">
            <UxIcon id="x" class="w-2" /> cancel edit
          </div>
        </div>
      </template>

      <!-- Timeframe row (non-deletable) -->
      <div v-if="timeframe" class="flex justify-between items-center hairline py-2">
        <div class="flex gap-3 text-14 font-med items-center">
          <div class="bg-grape-400 text-white rounded-full px-4 flex ">When</div>
          <div class="border-1 border-black rounded-full px-4">is</div>
          <FilterOldTimeframe
            :modelValue="timeframeValue"
            :options="timeframeOptions"
            @update:modelValue="$emit('update:timeframeValue', $event)"
          />
        </div>
        <!-- No delete button for timeframe -->
      </div>

      <!-- New filter row (when adding) -->
      <div v-if="isAdding" class="flex items-center gap-3 py-2 hairline" @focusout="onAddRowFocusOut">
        <!-- Key selection -->
        <div class="relative">
          <input
            ref="keyInputRef"
            v-model="newFilter.key"
            @focus="onKeyFocus"
            @blur="onKeyBlur"
            @input="filterKeySuggestions"
            @keydown.tab.prevent="selectFirstKeySuggestion"
            @keydown.enter.prevent="selectFirstKeySuggestion"
            @keydown.escape="cancelAdd"
            placeholder="Select key..."
            class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[140px] focus:outline-none focus:border-grape-400 "
          />
          <!-- Key suggestions dropdown -->
          <div v-if="showKeySuggestions && filteredKeySuggestions.length > 0"
            class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[140px] max-h-[500px]">
            <div v-for="def in filteredKeySuggestions" :key="def.key"
              @mousedown.prevent="selectKey(def.key)"
              class="px-3 hover:bg-grape-100 cursor-pointer text-14 border-b-1 border-b-grey-200">
              {{ def.label ?? def.key }}
            </div>
          </div>
        </div>

        <select
          ref="operatorSelectRef"
          v-model="newFilter.operator"
          :disabled="isOperatorLocked(newFilter.key)"
          @change="onNewOperatorChange"
          class="text-14 font-med border border-grey-200 rounded pl-2 pr-7 py-1 focus:outline-none focus:border-grape-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option v-for="op in newFilterValidOps" :key="op" :value="op">{{ FILTER_OP_LABELS[op] }}</option>
        </select>

        <!-- Value selection -->
        <div class="relative w-full">
          <input
            ref="valInputRef"
            v-model="newFilter.val"
            @focus="onValFocus"
            @blur="onValBlur"
            @input="filterValSuggestions"
            @keydown.tab.prevent="selectFirstValSuggestion"
            @keydown.enter.prevent="confirmAdd"
            @keydown.escape="cancelAdd"
            placeholder="Enter value..."
            class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[160px] focus:outline-none focus:border-grape-400 "
          />
          <!-- Value suggestions dropdown -->
          <div v-if="showValSuggestions && filteredValSuggestions.length > 0"
            class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[160px] max-h-[500px]">
            <div v-for="suggestion in filteredValSuggestions" :key="suggestion"
              @mousedown.prevent="selectVal(suggestion)"
              class="px-3 hover:bg-grape-100 cursor-pointer text-14 border-b-1 border-b-grey-200">
              {{ suggestion }}
            </div>
          </div>
        </div>

        <!-- Confirm/Cancel buttons for new filter -->
        <div @click="cancelAdd" class="flex text-12 gap-1 text-grey-400 hover:text-black cursor-pointer ml-auto">
          <UxIcon id="x" class="w-2" /> cancel
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center whitespace-nowrap text-12 font-med gap-2 text-grape hover:text-black cursor-pointer" @click="startAdd">
          <UxIcon id="plus-fat" class="w-3"/>
          Add Rule
        </div>
        <div v-if="localFilters.length" class="flex items-center whitespace-nowrap gap-2 text-12 font-med text-grape hover:text-black cursor-pointer" @click="clearAll">
          <UxIcon id="x" class="w-3"/>
          Delete All
        </div>
      </div>

      <div class="flex gap-3">
        <UxButton kind="stroke" class="h-9 text-14 font-med" @click="onCancel">
          Cancel
        </UxButton>
        <UxButton class="h-9 text-14 font-med" @click="onApply" :disabled="!filtersAreDifferent">
          <UxIcon id="check-fat" class="w-4 text-white mr-3" />
          Apply
        </UxButton>
      </div>
    </div>
  </div>
</template>

<!-- Presentational — the timeframe value/options come in as props (see
     FilterTimeframe) rather than reading a store directly, so consumers wire
     their own timeframe state locally. -->
<script setup>
const props = defineProps({
  filters: { type: Array, default: () => [] },
  availableKeyDefs: { type: Array, default: () => [] },
  valSuggestions: { type: Object, default: () => ({}) },
  filterKeyDefs: { type: Array, default: () => [] },
  timeframe: { type: Boolean, default: true },
  timeframeValue: { default: null },
  timeframeOptions: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'close',
  'update:timeframeValue',
  'requestKeySuggestions',
  'requestValSuggestions'
])

// Local copy of filters for editing
const localFilters = ref([])

// Initialize local filters from props
watch(() => props.filters, (newFilters) => {
  localFilters.value = [...newFilters]
}, { immediate: true })

// determine if localFilters is different from props.filters
const filtersAreDifferent = computed(() => {
  return JSON.stringify(localFilters.value) !== JSON.stringify(props.filters)
})

// Adding state
const isAdding = ref(false)
const newFilter = ref({ key: '', operator: FILTER_DEFAULT_OP, val: '' })

// Editing state
const editingIndex = ref(null)
const editingFilter = ref({ key: '', operator: FILTER_DEFAULT_OP, val: '' })

const newFilterValidOps = computed(() => getOperatorsForFilterKey(props.filterKeyDefs, newFilter.value.key))
const editingFilterValidOps = computed(() => getOperatorsForFilterKey(props.filterKeyDefs, editingFilter.value.key))

const isOperatorLocked = (key) => getOperatorsForFilterKey(props.filterKeyDefs, key).length === 1

const isTagFilter = (key) => {
  if (!props.filterKeyDefs?.length) return false
  const def = props.filterKeyDefs.find((d) => d.key === key)
  return !def || def.type === FilterType.TAG
}

const canConfirmAdd = computed(() =>
  newFilter.value.key && (newFilter.value.val || isTagFilter(newFilter.value.key)),
)
const canConfirmEdit = computed(() =>
  editingFilter.value.key &&
  (editingFilter.value.val || isTagFilter(editingFilter.value.key)) &&
  editingIndex.value !== null,
)

// Suggestion dropdown state
const showKeySuggestions = ref(false)
const showValSuggestions = ref(false)
const showEditKeySuggestions = ref(false)
const showEditValSuggestions = ref(false)

// Input refs
const keyInputRef = ref(null)
const valInputRef = ref(null)
const operatorSelectRef = ref(null)
const editKeyInputRef = ref(null)
const editValInputRef = ref(null)
const editOperatorSelectRef = ref(null)

// Filtered suggestions based on input
const filteredKeySuggestions = computed(() => {
  if (!props.availableKeyDefs?.length) return []
  const search = newFilter.value.key.toLowerCase()
  return props.availableKeyDefs.filter((d) =>
    (d.label ?? d.key).toLowerCase().includes(search),
  )
})

const filteredValSuggestions = computed(() => {
  const suggestions = props.valSuggestions?.[newFilter.value.key] || []
  if (!suggestions.length) return []
  const search = newFilter.value.val.toLowerCase()
  return suggestions.filter(s =>
    String(s).toLowerCase().includes(search)
  )
})

// Filtered suggestions for edit mode
const filteredEditKeySuggestions = computed(() => {
  if (!props.availableKeyDefs?.length) return []
  const search = editingFilter.value.key.toLowerCase()
  return props.availableKeyDefs.filter((d) =>
    (d.label ?? d.key).toLowerCase().includes(search),
  )
})

const filteredEditValSuggestions = computed(() => {
  const suggestions = props.valSuggestions?.[editingFilter.value.key] || []
  if (!suggestions.length) return []
  const search = editingFilter.value.val.toLowerCase()
  return suggestions.filter(s =>
    String(s).toLowerCase().includes(search)
  )
})

// Key input handlers
const onKeyFocus = () => {
  showKeySuggestions.value = true
  emit('requestKeySuggestions')
}

const onKeyBlur = () => {
  setTimeout(() => {
    showKeySuggestions.value = false
  }, 150)
}

const filterKeySuggestions = () => {
  showKeySuggestions.value = true
}

const focusNextAfterKey = (key, operatorRef, valRef) => {
  nextTick(() => {
    if (!isOperatorLocked(key)) operatorRef.value?.focus()
    else valRef.value?.focus()
  })
}

const selectKey = (key) => {
  newFilter.value.key = key
  const ops = getOperatorsForFilterKey(props.filterKeyDefs,key)
  if (!ops.includes(newFilter.value.operator)) newFilter.value.operator = ops[0]
  showKeySuggestions.value = false
  emit('requestValSuggestions', { key })
  focusNextAfterKey(key, operatorSelectRef, valInputRef)
}

const selectFirstKeySuggestion = () => {
  if (filteredKeySuggestions.value.length > 0) {
    selectKey(filteredKeySuggestions.value[0].key)
  } else if (newFilter.value.key) {
    showKeySuggestions.value = false
    emit('requestValSuggestions', { key: newFilter.value.key })
    focusNextAfterKey(newFilter.value.key, operatorSelectRef, valInputRef)
  }
}

// Value input handlers
const onValFocus = () => {
  showValSuggestions.value = true
  if (newFilter.value.key) {
    emit('requestValSuggestions', { key: newFilter.value.key })
  }
}

const onValBlur = () => {
  setTimeout(() => {
    showValSuggestions.value = false
  }, 150)
}

const filterValSuggestions = () => {
  showValSuggestions.value = true
}

const selectVal = (val) => {
  newFilter.value.val = val
  showValSuggestions.value = false
  confirmAdd()
}

const selectFirstValSuggestion = () => {
  if (filteredValSuggestions.value.length > 0) {
    selectVal(filteredValSuggestions.value[0])
  } else if (canConfirmAdd.value) {
    confirmAdd()
  }
}

// Edit mode key input handlers
const onEditKeyFocus = () => {
  showEditKeySuggestions.value = true
  emit('requestKeySuggestions')
}

const onEditKeyBlur = () => {
  setTimeout(() => {
    showEditKeySuggestions.value = false
  }, 150)
}

const filterEditKeySuggestions = () => {
  showEditKeySuggestions.value = true
}

const selectEditKey = (key) => {
  editingFilter.value.key = key
  const ops = getOperatorsForFilterKey(props.filterKeyDefs,key)
  if (!ops.includes(editingFilter.value.operator)) editingFilter.value.operator = ops[0]
  showEditKeySuggestions.value = false
  emit('requestValSuggestions', { key })
  nextTick(() => {
    if (!isOperatorLocked(key)) editOperatorSelectRef.value?.[0]?.focus()
    else editValInputRef.value?.[0]?.focus()
  })
}

const onNewOperatorChange = () => {
  nextTick(() => {
    valInputRef.value?.focus()
  })
}

const selectFirstEditKeySuggestion = () => {
  if (filteredEditKeySuggestions.value.length > 0) {
    selectEditKey(filteredEditKeySuggestions.value[0].key)
  } else if (editingFilter.value.key) {
    showEditKeySuggestions.value = false
    emit('requestValSuggestions', { key: editingFilter.value.key })
    nextTick(() => {
      if (!isOperatorLocked(editingFilter.value.key)) editOperatorSelectRef.value?.[0]?.focus()
      else editValInputRef.value?.[0]?.focus()
    })
  }
}

const onEditOperatorChange = () => {
  nextTick(() => {
    editValInputRef.value?.[0]?.focus()
  })
}

// Edit mode value input handlers
const onEditValFocus = () => {
  showEditValSuggestions.value = true
  if (editingFilter.value.key) {
    emit('requestValSuggestions', { key: editingFilter.value.key })
  }
}

const onEditValBlur = () => {
  setTimeout(() => {
    showEditValSuggestions.value = false
  }, 150)
}

const filterEditValSuggestions = () => {
  showEditValSuggestions.value = true
}

const selectEditVal = (val) => {
  editingFilter.value.val = val
  showEditValSuggestions.value = false
  confirmEdit()
}

const selectFirstEditValSuggestion = () => {
  if (filteredEditValSuggestions.value.length > 0) {
    selectEditVal(filteredEditValSuggestions.value[0])
  } else if (canConfirmEdit.value) {
    confirmEdit()
  }
}

// Add filter flow
const startAdd = () => {
  // Cancel any editing operation
  editingIndex.value = null
  editingFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }

  isAdding.value = true
  newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  nextTick(() => {
    keyInputRef.value?.focus()
  })
}

const confirmAdd = () => {
  if (canConfirmAdd.value) {
    localFilters.value.push({ ...newFilter.value, val: newFilter.value.val ?? '' })
    isAdding.value = false
    newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  }
}

const cancelAdd = () => {
  isAdding.value = false
  newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
}

// Remove a filter
const removeFilter = (index) => {
  localFilters.value.splice(index, 1)
}

// Clear all filters
const clearAll = () => {
  localFilters.value = []
  isAdding.value = false
  editingIndex.value = null
}

// Edit filter flow
const startEdit = (index) => {
  // Cancel any adding operation
  isAdding.value = false
  newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }

  // Set up edit state
  editingIndex.value = index
  const f = localFilters.value[index]
  const ops = getOperatorsForFilterKey(props.filterKeyDefs, f.key)
  editingFilter.value = { key: f.key, operator: ops.length === 1 ? ops[0] : (f.operator || FILTER_DEFAULT_OP), val: f.val }

  nextTick(() => {
    editKeyInputRef.value?.[0]?.focus()
  })
}

const confirmEdit = () => {
  if (canConfirmEdit.value) {
    localFilters.value[editingIndex.value] = { ...editingFilter.value, val: editingFilter.value.val ?? '' }
    editingIndex.value = null
    editingFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  }
}

const cancelEdit = () => {
  editingIndex.value = null
  editingFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
}

const onEditRowFocusOut = (e) => {
  const row = e.currentTarget
  const indexAtFocusOut = editingIndex.value
  setTimeout(() => {
    // If we switched to editing another filter, this handler is stale - do nothing
    if (editingIndex.value !== indexAtFocusOut) return
    if (row.contains(document.activeElement)) return
    if (canConfirmEdit.value) confirmEdit()
    else cancelEdit()
  }, 150)
}

const onAddRowFocusOut = (e) => {
  const row = e.currentTarget
  setTimeout(() => {
    // If we switched to editing another filter, this handler is stale - do nothing
    if (!isAdding.value) return
    if (row.contains(document.activeElement)) return
    if (canConfirmAdd.value) confirmAdd()
    else cancelAdd()
  }, 150)
}

// Modal actions
const onCancel = () => {
  // Reset to original filters
  localFilters.value = [...props.filters]
  isAdding.value = false
  emit('close')
}

const onApply = () => {
  // If currently adding, try to confirm it first
  if (isAdding.value && canConfirmAdd.value) {
    confirmAdd()
  }
  emit('close', localFilters.value)
}

// Exposed so Filter's ADD trigger can open this modal and immediately start
// the add-row flow within it, without changing this component's own behavior.
defineExpose({ startAdd })
</script>
