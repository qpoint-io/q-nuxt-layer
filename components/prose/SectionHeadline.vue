<template>

  <div class="mt-20">
    <!-- Eyebrow -->
    <div v-if="eyebrow" class="text-24 font-bold" :class="eyebrowClasses">
      {{ eyebrow }}
    </div>

    <!-- Title -->
    <h2
      class="text-30 lg:text-40 font-bold text-content leading-tight"
      :class="border ? 'border-b-stroke-strong border-b-2 pb-4' : ''"
    >
      {{ title }}
    </h2>

    <!-- Description -->
    <p v-if="description" class="text-24 font-semi text-content-muted leading-relaxed">
      {{ description }}
    </p>

    <!-- Slot for additional content -->
    <div class="mt-4 !text-18">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  border: { type: Boolean, default: false },
  eyebrow: { type: String, default: '' },
  eyebrowClasses: { type: String, default: 'text-grape-600' }
})
</script>
