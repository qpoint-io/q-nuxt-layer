<template>

  <!-- Sorting -->
  <UxTableListSorter v-if="isSort && !compact"
    :total      = "metric.total"
    :sortMetric = "metric.name"
    :width      = "metric.width"
    :align      = "metric.align"
    :isSorting  = "sortBy == metric.name"
    :disabled   = "disabled"
    class="_column"
  />
  <!-- Searching -->
  <UxTableListSearch v-else-if="doSearch && !compact"
    :name  = "metric.name"
    :width = "metric.width"
    class  = "_column "
  >
    <input v-model="search" type="text" name="search" :placeholder="metric.name" autocomplete="off" />
  </UxTableListSearch>

  <!-- Default -->
  <th v-else
    class  = "text-13 text-left _column"
    :width = "metric.width"
  >
    {{ metric.name }}
  </th>
</template>

<style scoped>
._column{
  @apply first-of-type:pl-0;
}
</style>

<script setup>
const props = defineProps({
  metric: { type: Object },
  sortBy: { type: String },
  compact: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

// computed methods - we may simplify this later
const search = ref('')
const doSearch = computed(() => {
  return props.metric.search != null
})

const isSort = computed(() => {
  return props.metric.search == null
})

watch(search, (newVal) => {
  props.metric.search( newVal )
})
</script>
