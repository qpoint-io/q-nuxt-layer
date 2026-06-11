<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :external="external"
    class="block p-6 bg-surface rounded-12 border border-stroke hover:border-primary/50 no-underline transition-colors"
  >
    <slot />
  </NuxtLink>
  <div
    v-else
    class="block p-6 bg-surface rounded-12 border border-stroke"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  // omit to render a static (non-link, no hover) card
  to:       { type: String, default: '' },
  external: { type: Boolean, default: false },
})
</script>
