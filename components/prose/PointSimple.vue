<template>
  <div :class="`border-t-6 border-t-${color} py-6 lg:py-8`">
    <div class="">
      <!-- Title -->
      <h4 class="text-18 md:text-20 lg:text-24 font-bold text-content mb-4 -mt-4 ">
        {{ title }}
      </h4>

      <!-- Subtitle -->
      <p v-if="sub" class="text-14 sm:text-16 lg:text-18 text-content-muted leading-relaxed">
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
  // brand accent only — must be a palette name whose border-t-* class is
  // actually generated (dynamic classes aren't seen by Tailwind's scanner)
  color: {
    type: String,
    default: 'grape',
    validator: (v) => ['grape', 'leaf', 'grey'].some(p => v === p || v.startsWith(`${p}-`)),
  }
})
</script>
