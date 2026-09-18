<template>
  <div class="flex justify-between hairline py-2">
    <!-- Filter display -->
    <div class="flex gap-3 text-14 font-med items-center cursor-pointer hover:text-grape" @click="$emit('click')">
      <div class="bg-grape-400 text-white rounded-full px-4 flex ">
        {{ filter.key }}
      </div>
      <div class="border-1 border-black rounded-full px-4">{{ operatorLabel }}</div>
      <div v-if="!isTagExists" class="bg-grape-400 text-white rounded-full px-4">{{ filter.val }}</div>
    </div>

    <!-- Delete button -->
    <div @click="$emit('delete')" class="flex text-12 gap-1 items-center p-2 cursor-pointer text-grey-400 hover:text-black group">
      <div class="opacity-0 group-hover:opacity-100 hover:duration-200 duration-500">Delete</div>
      <UxIcon id="x" class="w-3" />
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  filter: { type: Object, required: true },
  filterKeyDefs: { type: Array, default: () => [] },
})

defineEmits(['delete', 'click'])

const isTagFilter = computed(() => {
  if (!props.filterKeyDefs?.length) return false
  const def = props.filterKeyDefs.find((d) => d.key === props.filter.key)
  return !def || def.type === FilterType.TAG
})

const isTagExists = computed(() =>
  props.filter.key && isTagFilter.value && (props.filter.val === '' || props.filter.val == null),
)

const operatorLabel = computed(() => {
  if (isTagExists.value) return 'tag exists'
  const op = props.filter.operator ?? FILTER_DEFAULT_OP
  return FILTER_OP_LABELS[op] ?? op
})
</script>
