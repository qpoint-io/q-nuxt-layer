<template>
  <div :class="`border-t-6 border-t-${color} py-6 lg:py-8`">
    <div class="">
      <!-- Title -->
      <h4 class="text-18 md:text-20 lg:text-24 font-bold text-grey-900 mb-4 -mt-4 ">
        {{ title }}
      </h4>

      <!-- Subtitle -->
      <p v-if="sub" class="text-14 sm:text-16 lg:text-18 text-grey-600 leading-relaxed">
        {{ sub }}
      </p>

      <!-- Slot for additional content -->
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String },
  sub:   { type: String, default: '' },
  color: { type: String, default: 'grape' }
})
</script>
