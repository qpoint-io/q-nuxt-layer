<template>
  <UxTableList>
    <template #header>
      <tr>
        <UxTableListSorter sortMetric="Source" width="120px" :isSorting="sortBy === 'source'" @sortUp="sortBy = 'source'" @sortDown="sortBy = 'source'" />
        <UxTableListSorter sortMetric="Dataflow" width="160px" :isSorting="sortBy === 'dataflow'" @sortUp="sortBy = 'dataflow'" @sortDown="sortBy = 'dataflow'" />
        <UxTableListSorter sortMetric="Destination" width="160px" :isSorting="sortBy === 'destination'" @sortUp="sortBy = 'destination'" @sortDown="sortBy = 'destination'" />
        <UxTableListSorter sortMetric="Violation" width="180px" :isSorting="sortBy === 'violation'" @sortUp="sortBy = 'violation'" @sortDown="sortBy = 'violation'" />
        <UxTableListSorter sortMetric="Time" width="180px" :isSorting="sortBy === 'time'" @sortUp="sortBy = 'time'" @sortDown="sortBy = 'time'" />
      </tr>
      <tr><th class="h-[5px] p-0 bg-content" colspan="100%"></th></tr>
    </template>

    <tr v-for="v in violations" :key="v.id">
      <td class="px-3 py-2 text-13">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-content" />
          {{ v.source }}
        </div>
      </td>
      <td class="px-3 py-2 text-13">
        <SecurityDataFlow :types="v.dataTypes" :color="color" />
      </td>
      <td class="px-3 py-2 text-13">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded bg-signal-success/15 flex items-center justify-center text-10 text-signal-success font-bold">S</div>
          {{ v.destination }}
        </div>
      </td>
      <td class="px-3 py-2 text-13">
        <div class="flex items-center gap-1.5">
          <UxIcon id="no" class="w-4 h-4 text-signal-error" />
          {{ v.violation }}
        </div>
      </td>
      <td class="px-3 py-2 text-13 text-content-muted">{{ v.time }}</td>
    </tr>
  </UxTableList>
</template>

<script setup>
defineProps({
  violations: { type: Array, required: true },
  color:      { type: String, default: 'red' },
})

const sortBy = ref('time')
</script>
