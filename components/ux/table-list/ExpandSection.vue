<template>
  <div class="relative rounded-12 bg-surface p-6 shadow-lg">
    <UxIcon
      v-if="hasClose"
      id="x"
      class="absolute right-4 top-4 h-8 w-8 cursor-pointer text-content-subtle duration-300 hover:text-content hover:duration-0"
      @click="emit('close')"
    />
    <slot />
  </div>
</template>

<script setup>
// One white section card inside a UxTableListExpandRow's #details well.
// Stack any number; the consumer owns the stack spacing (space-y-4) so the
// row's tinted well shows through the gaps between cards. Deliberately
// borderless — the cards read soft on the tinted well (unlike a standalone
// card, which would carry border-stroke). Close affordance: a card-anchored
// X in the top-right, rendered only when the consumer listens for @close —
// typically just the first section of a stack. Sections without the listener
// stay chrome-less.
import { getCurrentInstance } from 'vue'

const emit = defineEmits(['close'])

// Listener-gated chrome: declared emits are stripped from useAttrs(), so the
// @close listener is read off the vnode props instead. Listener presence is
// static per usage site, so a one-time check at setup is enough.
const hasClose = !!getCurrentInstance()?.vnode.props?.onClose
</script>
