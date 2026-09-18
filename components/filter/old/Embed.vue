<template>
  <div class="w-full">
    <!-- filters list -->
    <div class="mb-2">
      <template v-for="(filter, index) in filters" :key="filter.key + '-' + index">
        <!-- Display mode -->
        <FilterOldManageItem
          v-if="editingIndex !== index"
          :filter="filter"
          :filterKeyDefs="filterKeyDefs"
          @click="startEdit(index)"
          @delete="removeFilter(index)"
        />

        <!-- Edit mode for existing filter -->
        <div v-else class="flex items-center gap-3 py-2 hairline">
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
              class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg max-h-[200px] overflow-y-auto min-w-[140px]">
              <div v-for="def in filteredEditKeySuggestions" :key="def.key"
                @mousedown.prevent="selectEditKey(def.key)"
                class="px-3 py-2 hover:bg-grape-100 cursor-pointer text-14">
                {{ def.label ?? def.key }}
              </div>
            </div>
          </div>

          <select
            v-model="editingFilter.operator"
            :disabled="isOperatorLocked(editingFilter.key)"

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
              @keydown.enter.prevent="selectFirstEditValSuggestion"
              @keydown.escape="cancelEdit"
              placeholder="Enter value..."
              class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[160px] focus:outline-none focus:border-grape-400"
            />
            <!-- Value suggestions dropdown -->
            <div v-if="showEditValSuggestions && filteredEditValSuggestions.length > 0"
              class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg max-h-[200px] overflow-y-auto min-w-[160px]">
              <div v-for="suggestion in filteredEditValSuggestions" :key="suggestion"
                @mousedown.prevent="selectEditVal(suggestion)"
                class="px-3 py-2 hover:bg-grape-100 cursor-pointer text-14">
                {{ suggestion }}
              </div>
            </div>
          </div>

          <!-- Cancel button for edit -->
          <div class="flex gap-2 ml-auto">
            <div @click="cancelEdit" class="flex text-12 gap-1 text-grey-400 hover:text-black cursor-pointer">
              <UxIcon id="x" class="w-2" /> cancel edit
            </div>
          </div>
        </div>
      </template>

      <!-- New filter row (when adding) -->
      <div v-if="isAdding" class="flex items-center gap-3 py-2 hairline">
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
            class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[140px] focus:outline-none focus:border-grape-400"
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
          v-model="newFilter.operator"
          :disabled="isOperatorLocked(newFilter.key)"

          class="text-14 font-med border border-grey-200 rounded pl-2 pr-7 py-1 focus:outline-none focus:border-grape-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option v-for="op in newFilterValidOps" :key="op" :value="op">{{ FILTER_OP_LABELS[op] }}</option>
        </select>

        <!-- Value selection -->
        <div class="relative">
          <input
            ref="valInputRef"
            v-model="newFilter.val"
            @focus="onValFocus"
            @blur="onValBlur"
            @input="filterValSuggestions"
            @keydown.tab.prevent="selectFirstValSuggestion"
            @keydown.enter.prevent="selectFirstValSuggestion"
            @keydown.escape="cancelAdd"
            placeholder="Enter value..."
            class="text-14 font-med border border-grey-200 rounded px-2 py-1 w-[160px] focus:outline-none focus:border-grape-400"
          />
          <!-- Value suggestions dropdown -->
          <div v-if="showValSuggestions && filteredValSuggestions.length > 0"
            class="absolute z-50 top-full left-0 mt-1 bg-white border border-grey-200 rounded shadow-lg max-h-[200px] overflow-y-auto min-w-[160px]">
            <div v-for="suggestion in filteredValSuggestions" :key="suggestion"
              @mousedown.prevent="selectVal(suggestion)"
              class="px-3 hover:bg-grape-100 cursor-pointer text-14 border-b-1 border-b-grey-200">
              {{ suggestion }}
            </div>
          </div>
        </div>

        <!-- Cancel button for new filter -->
        <div class="flex gap-2 ml-auto">
          <div @click="cancelAdd" class="flex text-12 gap-1 text-grey-400 hover:text-black cursor-pointer">
            <UxIcon id="x" class="w-2" /> cancel
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filters: { type: Array, default: () => [] },
  availableKeyDefs: { type: Array, default: () => [] },
  valSuggestions: { type: Object, default: () => ({}) },
  filterKeyDefs: { type: Array, default: () => [] },
})

const isOperatorLocked = (key) => getOperatorsForFilterKey(props.filterKeyDefs, key).length === 1

const emit = defineEmits([
  'update:filters',
  'requestKeySuggestions',
  'requestValSuggestions'
])

// Adding state
const isAdding = ref(false)
const newFilter = ref({ key: '', operator: FILTER_DEFAULT_OP, val: '' })

// Editing state
const editingIndex = ref(null)
const editingFilter = ref({ key: '', operator: FILTER_DEFAULT_OP, val: '' })

const newFilterValidOps = computed(() => getOperatorsForFilterKey(props.filterKeyDefs,newFilter.value.key))
const editingFilterValidOps = computed(() => getOperatorsForFilterKey(props.filterKeyDefs,editingFilter.value.key))

// Suggestion dropdown state
const showKeySuggestions = ref(false)
const showValSuggestions = ref(false)
const showEditKeySuggestions = ref(false)
const showEditValSuggestions = ref(false)

// Input refs
const keyInputRef = ref(null)
const valInputRef = ref(null)
const editKeyInputRef = ref(null)
const editValInputRef = ref(null)

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

const selectKey = (key) => {
  newFilter.value.key = key
  const ops = getOperatorsForFilterKey(props.filterKeyDefs, key)
  if (!ops.includes(newFilter.value.operator)) newFilter.value.operator = ops[0]
  showKeySuggestions.value = false
  // Request value suggestions immediately when key is selected
  emit('requestValSuggestions', { key })
  nextTick(() => {
    valInputRef.value?.focus()
  })
}

const selectFirstKeySuggestion = () => {
  if (filteredKeySuggestions.value.length > 0) {
    selectKey(filteredKeySuggestions.value[0].key)
  } else if (newFilter.value.key) {
    showKeySuggestions.value = false
    // Request value suggestions when tabbing with a custom key
    emit('requestValSuggestions', { key: newFilter.value.key })
    nextTick(() => {
      valInputRef.value?.focus()
    })
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
  } else if (newFilter.value.val) {
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
  const ops = getOperatorsForFilterKey(props.filterKeyDefs, key)
  if (!ops.includes(editingFilter.value.operator)) editingFilter.value.operator = ops[0]
  showEditKeySuggestions.value = false
  // Request value suggestions immediately when key is selected
  emit('requestValSuggestions', { key })
  nextTick(() => {
    editValInputRef.value?.[0]?.focus()
  })
}

const selectFirstEditKeySuggestion = () => {
  if (filteredEditKeySuggestions.value.length > 0) {
    selectEditKey(filteredEditKeySuggestions.value[0].key)
  } else if (editingFilter.value.key) {
    showEditKeySuggestions.value = false
    // Request value suggestions when tabbing with a custom key
    emit('requestValSuggestions', { key: editingFilter.value.key })
    nextTick(() => {
      editValInputRef.value?.[0]?.focus()
    })
  }
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
  } else if (editingFilter.value.val) {
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
  if (newFilter.value.key && newFilter.value.val) {
    const updatedFilters = [...props.filters, { key: newFilter.value.key, operator: newFilter.value.operator || FILTER_DEFAULT_OP, val: newFilter.value.val }]
    emit('update:filters', updatedFilters)
    isAdding.value = false
    newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  }
}

const cancelAdd = () => {
  isAdding.value = false
  newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
}

// Remove a filter - emit immediately
const removeFilter = (index) => {
  const updatedFilters = [...props.filters]
  updatedFilters.splice(index, 1)
  emit('update:filters', updatedFilters)
}

// Edit filter flow
const startEdit = (index) => {
  isAdding.value = false
  newFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  editingIndex.value = index
  const f = props.filters[index]
  const ops = getOperatorsForFilterKey(props.filterKeyDefs,f.key)
  editingFilter.value = { key: f.key, operator: ops.length === 1 ? ops[0] : (f.operator || FILTER_DEFAULT_OP), val: f.val }
  nextTick(() => {
    editKeyInputRef.value?.[0]?.focus()
  })
}

const confirmEdit = () => {
  if (editingFilter.value.key && editingFilter.value.val && editingIndex.value !== null) {
    const updatedFilters = [...props.filters]
    updatedFilters[editingIndex.value] = { key: editingFilter.value.key, operator: editingFilter.value.operator || FILTER_DEFAULT_OP, val: editingFilter.value.val }
    emit('update:filters', updatedFilters)
    editingIndex.value = null
    editingFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
  }
}

const cancelEdit = () => {
  editingIndex.value = null
  editingFilter.value = { key: '', operator: FILTER_DEFAULT_OP, val: '' }
}

// Expose startAdd method for external trigger
defineExpose({ startAdd })
</script>
