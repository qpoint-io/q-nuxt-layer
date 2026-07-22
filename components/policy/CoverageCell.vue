<template>
  <div class="flex min-h-[88px] w-[100px] flex-col items-center" :class="state === 'active' ? 'justify-start gap-2 pt-1' : 'justify-center'">
    <template v-if="state === 'active'">
      <span class="flex h-[28px] items-center rounded-32 bg-grey-200 px-4 text-15 font-bold text-content">Required</span>
      <span class="flex items-center gap-1.5 text-16 font-bold text-grape-600">
        <UxIcon id="check-fat" class="h-4 w-4" />
        Active
      </span>
    </template>
    <span
      v-else-if="state === 'gap'"
      class="flex h-[28px] items-center rounded-32 bg-[#ffdcdc] px-4 text-15 font-bold text-[#c40000]"
    >! Required</span>
    <span v-else class="h-[4px] w-[19px] rounded-1 bg-grey-700"></span>
  </div>
</template>

<script setup>
// Framework coverage cell: 'active' = Required chip + ✔ Active, 'gap' =
// red "! Required" chip (required but not active), 'na' = dash.
defineProps({
  state: { type: String, required: true }, // 'active' | 'gap' | 'na'
})
</script>
