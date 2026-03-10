<template>
  <div
    class="border-t-6 py-6 lg:py-8"
    :class="theme === 'grape' ? 'border-t-grape' : ''">
    <div>
      <!-- Question -->
      <h4 class="text-18 md:text-20 lg:text-24 font-bold text-grey-900 mb-4 -mt-4">
        {{ question }}
      </h4>

      <!-- Answer -->
      <div class="text-14 sm:text-16 lg:text-18 text-grey-600 leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: { type: String, required: true },
  theme: { type: String, default: 'grape' }
})
</script>
