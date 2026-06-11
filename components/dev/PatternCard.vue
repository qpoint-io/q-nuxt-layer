<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-28 font-semi text-content mb-2">
        <slot name="name" />
      </h3>
      <p class="text-16 text-content-muted mb-3">
        <slot name="description" />
      </p>
      <p class="text-14 text-content-subtle">
        <span class="font-semi text-content-muted">When to use:</span>
        <slot name="when" />
      </p>
    </div>

    <!-- Live example -->
    <div class="p-8 bg-surface rounded-12 border border-stroke">
      <slot />
    </div>

    <!-- Code block -->
    <UxCodeBlock :code="code" label="MDC" collapsible class="mt-3" />
  </div>
</template>

<script setup>
defineProps({
  code: { type: String, required: true },
})
</script>
