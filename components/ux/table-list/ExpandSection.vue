<template>
  <div class="rounded-12 bg-surface p-6 shadow-lg">
    <slot />
  </div>
</template>

<script setup>
// One white section card inside a UxTableListExpandRow's #details well.
// Stack any number; the consumer owns the stack spacing (space-y-4) so the
// row's tinted well shows through the gaps between cards. Deliberately
// borderless — the cards read soft on the tinted well (unlike a standalone
// card, which would carry border-stroke). Close affordance stays the
// ExpandRow's sticky X, which lands over the first section's top-right.
</script>
