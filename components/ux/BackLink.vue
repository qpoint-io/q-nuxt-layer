<template>
  <NuxtLink
    :to="to"
    class="text-14 font-med text-primary no-underline hover:text-content mb-4 inline-block"
  >
    &larr; <slot />
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: { type: String, required: true },
})
</script>
