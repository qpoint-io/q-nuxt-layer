<!-- FilterNoMatches — the "filtered to nothing" empty state. Distinct from
     "no data yet": the data exists, the active filter hides all of it, and
     the way out is to clear the filter — so the state carries the action.
     Presentational, like the rest of the Filter namespace: the consumer owns
     the filter state and wires `@clear` to whatever clears it (a global
     filter's keys, a local search, both). Typically slotted into a
     DataTable's #empty when the page's row set is non-empty but the
     filtered set is. -->
<template>
  <div class="flex flex-col items-center justify-center gap-3 text-center">
    <p class="text-14 text-content-subtle">
      <slot>No {{ subject }} match the current filter.</slot>
    </p>
    <UxButton kind="stroke" size="32" class="text-13 font-med" @click="$emit('clear')">{{ label }}</UxButton>
  </div>
</template>

<script setup lang="ts">
defineProps({
  /** Plural noun for the default message — "No {subject} match the current filter." */
  subject: { type: String, default: 'records' },
  /** Button text. */
  label: { type: String, default: 'Clear filter' },
})

defineEmits<{ (e: 'clear'): void }>()
</script>
