<template>
  <div class="flex items-center gap-1 text-11 font-med border-2 border-grape-400 rounded-full h-6 px-3 whitespace-nowrap bg-grape-50">
    <!-- Key input -->
    <div class="relative">
      <input
        ref="keyInputRef"
        v-model="localKey"
        @focus="onKeyFocus"
        @blur="onKeyBlur"
        @input="onKeyInput"
        @keydown.tab.prevent="onKeyTab"
        @keydown.enter.prevent="onKeyTab"
        @keydown.escape="onCancel"
        placeholder="key"
        class="min-w-8 bg-transparent border-none outline-none focus:ring-0 text-11 text-grey-600 placeholder:text-grey-400 p-0"
        style="field-sizing: content;"
      />
      <!-- Key suggestions dropdown -->
      <div v-if="showKeySuggestions && filteredKeySuggestions.length > 0"
        class="absolute z-50 top-full left-0 mt-2 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[160px] max-h-[500px]">
        <div v-for="def in filteredKeySuggestions" :key="def.key"
          @mousedown.prevent="selectKey(def.key)"
          class="px-3 hover:bg-grape-100 cursor-pointer text-12 border-b-1 border-b-grey-200">
          {{ def.label ?? def.key }}
        </div>
      </div>
    </div>

    <div class="relative">
      <input
        ref="operatorInputRef"
        :value="FILTER_OP_LABELS[localOperator] ?? localOperator"
        @focus="onOperatorFocus"
        @blur="onOperatorBlur"
        @keydown.tab.prevent="onOperatorTab"
        @keydown.enter.prevent="onOperatorTab"
        @keydown.escape="onCancel"
        :disabled="isOperatorLocked"
        :tabindex="isOperatorLocked ? -1 : 0"
        class="min-w-0 bg-transparent border-none outline-none focus:ring-0 text-11 font-bold text-black py-0 px-0.5"
        :class="isOperatorLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
        style="field-sizing: content;"
      />
      <div v-if="showOperatorSuggestions && !isOperatorLocked"
        class="absolute z-50 top-full left-0 mt-2 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[100px] max-h-[500px]">
        <div v-for="op in validOps" :key="op"
          @mousedown.prevent="selectOperator(op)"
          class="px-3 hover:bg-grape-100 cursor-pointer text-12 border-b-1 border-b-grey-200"
          :class="{ 'bg-grape-50': op === localOperator }">
          {{ FILTER_OP_LABELS[op] }}
        </div>
      </div>
    </div>

    <!-- Value input -->
    <div class="relative">
      <input
        ref="valInputRef"
        v-model="localVal"
        @focus="onValFocus"
        @blur="onValBlur"
        @input="onValInput"
        @keydown.tab.prevent="onValTab"
        @keydown.enter.prevent="completeEdit"
        @keydown.escape="onCancel"
        placeholder="value"
        class="min-w-8 bg-transparent border-none outline-none focus:ring-0 text-11 text-grey-600 placeholder:text-grey-400 p-0"
        style="field-sizing: content;"
      />
      <!-- Value suggestions dropdown -->
      <div v-if="showValSuggestions && filteredValSuggestions.length > 0"
        class="absolute z-50 top-full left-0 mt-2 bg-white border border-grey-200 rounded shadow-lg overflow-y-auto min-w-[160px] max-h-[500px]">
        <div v-for="suggestion in filteredValSuggestions" :key="suggestion"
          @mousedown.prevent="selectVal(suggestion)"
          class="px-3 hover:bg-grape-100 cursor-pointer text-12 border-b-1 border-b-grey-200">
          {{ suggestion }}
        </div>
      </div>
    </div>

    <!-- Cancel button -->
    <div class="text-grape-300 hover:text-black cursor-pointer p-1 -mr-1" @click="onCancel">
      <UxIcon id="x" class="w-[10px]" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  initialKey: { type: String, default: '' },
  initialVal: { type: String, default: '' },
  initialOperator: { type: String, default: FILTER_DEFAULT_OP },
  filterKeyDefs: { type: Array, default: () => [] },
  availableKeyDefs: { type: Array, default: () => [] },
  valSuggestions: { type: Array, default: () => [] },
  focusKey: { type: Boolean, default: true },
})

const emit = defineEmits([
  'complete',
  'cancel',
  'requestKeySuggestions',
  'requestValSuggestions'
])

const validOps = computed(() => getOperatorsForFilterKey(props.filterKeyDefs, localKey.value))
const isOperatorLocked = computed(() => validOps.value.length === 1)

const isTagFilter = computed(() => {
  if (!props.filterKeyDefs?.length) return false
  const def = props.filterKeyDefs.find((d) => d.key === localKey.value)
  return !def || def.type === FilterType.TAG
})

const canComplete = computed(() => localKey.value && (localVal.value || isTagFilter.value))

// Local state
const localKey = ref(props.initialKey)
const localVal = ref(props.initialVal)
const localOperator = ref(FILTER_OPS.includes(props.initialOperator) ? props.initialOperator : FILTER_DEFAULT_OP)
watch(() => props.initialOperator, (op) => {
  if (FILTER_OPS.includes(op)) localOperator.value = op
})
const showKeySuggestions = ref(false)
const showValSuggestions = ref(false)
const showOperatorSuggestions = ref(false)

// Input refs
const keyInputRef = ref(null)
const valInputRef = ref(null)
const operatorInputRef = ref(null)

const focusMovedToOperator = (relatedTarget) =>
  operatorInputRef.value && (relatedTarget === operatorInputRef.value || operatorInputRef.value.contains(relatedTarget))

const focusMovedToKey = (relatedTarget) =>
  keyInputRef.value && (relatedTarget === keyInputRef.value || keyInputRef.value.contains(relatedTarget))

// Focus on mount
onMounted(() => {
  nextTick(() => {
    if (props.focusKey) {
      keyInputRef.value?.focus()
    } else {
      valInputRef.value?.focus()
    }
  })
})

// Filtered suggestions
const filteredKeySuggestions = computed(() => {
  if (!props.availableKeyDefs?.length) return []
  const search = localKey.value.toLowerCase()
  return props.availableKeyDefs.filter((d) =>
    (d.label ?? d.key).toLowerCase().includes(search),
  )
})

const filteredValSuggestions = computed(() => {
  if (!props.valSuggestions) return []
  const search = localVal.value.toLowerCase()
  return props.valSuggestions.filter(s =>
    String(s).toLowerCase().includes(search)
  )
})

// Key input handlers
const onKeyFocus = () => {
  showKeySuggestions.value = true
  emit('requestKeySuggestions')
}

const onKeyBlur = (e) => {
  const relatedTarget = e?.relatedTarget
  setTimeout(() => {
    showKeySuggestions.value = false
    if (focusMovedToOperator(relatedTarget)) return
    if (!localKey.value) onCancel()
  }, 150)
}

const onKeyInput = () => {
  showKeySuggestions.value = true
}

const selectKey = (key) => {
  localKey.value = key
  const ops = getOperatorsForFilterKey(props.filterKeyDefs, key)
  if (!ops.includes(localOperator.value)) localOperator.value = ops[0]
  showKeySuggestions.value = false
  // Request value suggestions immediately when key is selected
  emit('requestValSuggestions', { key })
  nextTick(() => {
    valInputRef.value?.focus()
  })
}

const onKeyTab = () => {
  if (filteredKeySuggestions.value.length > 0) {
    selectKey(filteredKeySuggestions.value[0].key)
  } else if (localKey.value) {
    showKeySuggestions.value = false
    // Request value suggestions when tabbing with a custom key
    emit('requestValSuggestions', { key: localKey.value })
    nextTick(() => {
      valInputRef.value?.focus()
    })
  }
}

// Operator input handlers
const onOperatorFocus = () => {
  if (isOperatorLocked.value) return
  showOperatorSuggestions.value = true
}

const onOperatorBlur = () => {
  setTimeout(() => {
    showOperatorSuggestions.value = false
  }, 150)
}

const selectOperator = (op) => {
  localOperator.value = op
  showOperatorSuggestions.value = false
  nextTick(() => {
    valInputRef.value?.focus()
  })
}

const onOperatorTab = () => {
  showOperatorSuggestions.value = false
  nextTick(() => {
    valInputRef.value?.focus()
  })
}

// Value input handlers
const onValFocus = () => {
  showValSuggestions.value = true
  if (localKey.value) {
    emit('requestValSuggestions', { key: localKey.value })
  }
}

const onValBlur = (e) => {
  const relatedTarget = e?.relatedTarget
  setTimeout(() => {
    showValSuggestions.value = false
    if (focusMovedToOperator(relatedTarget)) return
    if (focusMovedToKey(relatedTarget)) return
    if (canComplete.value) completeEdit()
    else onCancel()
  }, 150)
}

const onValInput = () => {
  showValSuggestions.value = true
}

const selectVal = (val) => {
  localVal.value = val
  showValSuggestions.value = false
  completeEdit()
}

const onValTab = () => {
  if (filteredValSuggestions.value.length > 0) {
    selectVal(filteredValSuggestions.value[0])
  } else if (canComplete.value) {
    completeEdit()
  }
}

// Complete and cancel
const completeEdit = () => {
  if (canComplete.value) {
    emit('complete', { key: localKey.value, val: localVal.value ?? '', operator: localOperator.value })
  }
}

const onCancel = () => {
  emit('cancel')
}

// Expose focus method
const focus = () => {
  keyInputRef.value?.focus()
}

defineExpose({ focus })
</script>
