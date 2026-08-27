<template>
  <!-- whitespace-normal: UxTableList sets whitespace-nowrap on the whole
       table for cell behavior; an expand card is prose-shaped content and
       must wrap, or long captions set the column's min-content and overflow
       the card padding. -->
  <div
    class="relative rounded-12 p-6 whitespace-normal"
    :class="theme === 'grape'
      ? 'bg-grape-50 border-2 border-grape-400 shadow-lg dark:bg-grape-850/30 dark:border-grape-800'
      : 'bg-surface shadow-lg'"
  >
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
// One section card inside a UxTableListExpandRow's #details well.
// Stack any number; the consumer owns the stack spacing (space-y-4) so the
// row's tinted well shows through the gaps between cards. Default theme is
// borderless-with-shadow — the cards read soft on the tinted well (unlike a
// standalone card, which would carry border-stroke). `theme="grape"` is the
// CHILD register: grape-50 fill with a light grape border, no shadow — for a
// card that belongs to a row of the section above it (e.g. a finding's
// adjudication card under the findings table). Close affordance: a
// card-anchored X in the top-right, rendered only when the consumer listens
// for @close — typically just the first section of a stack. Sections without
// the listener stay chrome-less.
import { getCurrentInstance } from 'vue'

defineProps({
  theme: { type: String, default: 'default' }, // 'default' | 'grape'
})

const emit = defineEmits(['close'])

// Listener-gated chrome: declared emits are stripped from useAttrs(), so the
// @close listener is read off the vnode props instead. Listener presence is
// static per usage site, so a one-time check at setup is enough.
const hasClose = !!getCurrentInstance()?.vnode.props?.onClose
</script>
