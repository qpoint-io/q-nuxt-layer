<template>
  <div class="quote-container relative max-w-full md:max-w-[400px] mx-auto my-20">

      <IconQuote class="w-8 text-grape-300 absolute opacity-30 top-0 -left-20" />
      <IconQuote class="w-8 text-grape-300 absolute opacity-30 rotate-180 bottom-20 -right-10" />

    <!-- Quote Content -->
    <div class="quote-content mb-6 italic font-semi">
      <slot />
    </div>

    <!-- Attribution -->
    <div class="flex items-center gap-4">
      <!-- Photo -->
      <div v-if="photo" class="flex-shrink-0">
        <img
          :src="photo"
          :alt="name"
          class="w-16 h-16 rounded-full object-cover"
        />
      </div>

      <!-- Text Info -->
      <div class="flex flex-col">
        <div class="text-16 font-semi text-grey-900">{{ name }}</div>
        <div class="text-14 text-grey-600">{{ title }} / {{ company }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  photo: { type: String, default: null },
  title: { type: String, required: true },
  company: { type: String, required: true }
})
</script>
