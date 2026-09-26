<!-- Anchored panel primitive: a trigger and a panel that opens beneath it.
     Headless UI's Popover owns the behaviour (toggle, Escape, click-outside,
     focus return); this component owns the chrome and the anchoring, so no
     consumer has to hand-roll `absolute top-full` + a document click listener
     again (FilterItem, qdash /controls and qdash FilterPopover each did).
     Prototyped on the design site (c93), extracted here in c95. -->
<template>
  <!-- inline-flex (not inline-block) so that as a flex item — e.g. a segment of
       FilterTriggerBar — the root and its button stretch to the row's height. -->
  <HPopover v-slot="{ open, close }" class="relative inline-flex">
    <PopoverButton class="_trigger" :class="open ? '_open' : ''">
      <slot name="trigger" :open="open" />
    </PopoverButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      :enter-from-class="side === 'above' ? 'opacity-0 translate-y-1' : 'opacity-0 -translate-y-1'"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      :leave-to-class="side === 'above' ? 'opacity-0 translate-y-1' : 'opacity-0 -translate-y-1'"
    >
      <!-- side=above hangs the panel over whatever is above the trigger, so a
           picker that sits on a table leaves the table it edits fully visible -->
      <PopoverPanel
        class="absolute z-40 rounded-8 border border-stroke bg-surface shadow-lg"
        :class="[
          side === 'above' ? 'bottom-full mb-1' : 'top-full mt-1',
          align === 'left' ? 'left-0' : 'right-0',
          wide ? 'w-80' : 'w-64',
        ]"
      >
        <slot :close="close" />
      </PopoverPanel>
    </transition>
  </HPopover>
</template>

<style scoped>
/* The button is a bare host: the trigger slot brings its own chrome, so the
   only thing owned here is the focus ring — inset, so it survives a clipped
   host (FilterTriggerBar's segments use inset rings for the same reason). */
._trigger {
  @apply inline-flex items-center rounded-8 focus:outline-none ring-inset focus-visible:ring-2 focus-visible:ring-primary/40;
}
</style>

<script setup>
import { Popover as HPopover, PopoverButton, PopoverPanel } from '@headlessui/vue'

defineProps({
  // which edge of the trigger the panel hangs from
  align: { type: String, default: 'right' },
  // 'below' (default) or 'above' — above keeps the content beneath the trigger uncovered
  side:  { type: String, default: 'below' },
  // w-80 instead of w-64 — for panels with a secondary column of text
  wide:  { type: Boolean, default: false },
})
</script>
