<template>
  <div :class="`border-t-6 border-t-grape py-6 lg:py-8`">
    <div class="text-32">
      <!-- Title -->
      <h4 class="text-24 md:text-28 lg:text-32 font-bold text-grey-900 mb-4 -mt-4 ">
        {{ title }}
      </h4>

      <!-- Subtitle -->
      <p v-if="sub" class="text-14 sm:text-16 lg:text-20 text-grey-600 leading-relaxed">
        {{ sub }}
      </p>

      <!-- Slot for additional content -->
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  sub:   { type: String, default: '' },
  color: { type: String, default: 'grape' }
})
</script>
