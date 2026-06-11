<template>

  <div :class="isDoc ? '' : 'mt-20'">
    <!-- Eyebrow -->
    <div v-if="eyebrow" :class="[isDoc ? 'text-16 font-bold' : 'text-24 font-bold', eyebrowClasses]">
      {{ eyebrow }}
    </div>

    <!-- Title -->
    <h2
      :class="[
        isDoc ? 'text-28 font-semi text-content mb-4' : 'text-30 lg:text-40 font-bold text-content leading-tight',
        border ? 'border-b-stroke-strong border-b-2 pb-4' : '',
      ]"
    >
      {{ title }}
    </h2>

    <!-- Description -->
    <p v-if="description" :class="isDoc ? 'text-16 text-content-muted leading-relaxed' : 'text-24 font-semi text-content-muted leading-relaxed'">
      {{ description }}
    </p>

    <!-- Slot for additional content -->
    <div :class="isDoc ? 'mt-4' : 'mt-4 !text-18'">
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
  eyebrowClasses: { type: String, default: 'text-grape-600' },
  // display = marketing scale (default), doc = documentation section scale
  size: { type: String, default: 'display' },
})

const isDoc = computed(() => props.size === 'doc')
</script>
