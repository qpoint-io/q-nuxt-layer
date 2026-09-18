<template>
  <div
    class="flex items-center gap-1 text-11 font-med border-2 border-grape-400 rounded-full h-6 px-3 whitespace-nowrap cursor-pointer hover:bg-grape-50 transition-colors"
    @click="$emit('click')">
    <div class="text-grey-500/90">{{ _key }}</div>
    <div class="text-grey-500/90">{{ prettyOperator }}</div>
    <div>{{ displayValue }}</div>

    <!-- close button -->
    <div class="text-grape-300 hover:text-black cursor-pointer p-2 -mr-3" @click.stop="$emit('delete')">
      <UxIcon id="x" class="w-[10px]" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  _key: { type: String },
  val: { type: String },
  operator: { type: String },
  isTagFilter: { type: Boolean, default: false },
})

defineEmits(['click', 'delete'])

const OPERATOR_DISPLAY = {
  eq: '=',
  neq: '!=',
}

const displayValue = computed(() => {
  if (props.isTagFilter && !props.val) return 'tag exists'
  return props.val
})

const prettyOperator = computed(() => {
  if (props.isTagFilter && !props.val) return ''
  const op = props.operator || FILTER_DEFAULT_OP
  return ` ${OPERATOR_DISPLAY[op] ?? FILTER_OP_LABELS[op] ?? op} `
})
</script>
