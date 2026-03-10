<template>
  <div class="flex items-start gap-px16
              md:gap-px24"
  >
    <!-- Symbol/Icon -->
    <div class="grid gap-x-4 grid-cols-2 max-w-[400px]" style="grid-template-columns: min-content auto;">
      <IconCheckFat class="w-8 text-grape-600" />
      <h3 class="text-21 font-semi text-grey-900 mb-2">{{ title }}</h3>

      <!-- Content -->
      <div/>
      <p v-if="description" class="text-16 text-grey-600 leading-relaxed">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>
