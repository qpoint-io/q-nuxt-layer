<template>
  <div class="flex items-center gap-[5px]">
    <button
    class="flex h-[29px] items-center justify-center gap-1.5 rounded-6 border border-dashed border-grape-500 px-3 text-12 font-bold leading-none text-grape-500"
    >
    <UxIcon id="plus" class="h-3 w-3" />
    Override
  </button>
  <span class="text-12 font-semi italic leading-none text-grape-500">({{ label }})</span>
  </div>
</template>

<script setup>
// An inherited value in the enforcement cascade: small purple label showing
// the effective value from the level above + dashed "+ Override" button.
defineProps({
  label: { type: String, required: true },
})
</script>
