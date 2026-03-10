<template>
  <div class="flex flex-col gap-px16">
    <h2 class="text-24 font-bold hairline mb-2 pb-4">{{ title }}</h2>
    <div
      class="grid grid-cols-1"
      :class="columns ? `sm:grid-cols-${columns} w-full gap-x-2 gap-y-10 py-4` : 'sm:grid-cols-2 md:flex w-full justify-between'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {type: String, default:""},
  columns: {type: Number, default: null}
})
</script>
