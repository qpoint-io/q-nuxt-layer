<template>
  <div v-if="total > rowCap" class="flex items-center justify-end gap-3 pt-2 text-12">
    <button
      type="button"
      class="font-med text-primary duration-300 hover:text-content hover:duration-0"
      @click="$emit('toggle')"
    >
      {{ expanded
        ? `Only show top ${rowCap}`
        : total > expandCap
          ? `Show more (${expandCap} of ${fmt(total)})`
          : `Show all ${fmt(total)}` }}
    </button>
    <template v-if="expanded && total > expandCap">
      <span class="h-3 w-px bg-stroke" />
      <NuxtLink
        v-if="to"
        :to="to"
        class="font-med text-primary duration-300 hover:text-content hover:duration-0"
      >View all {{ fmt(total) }} →</NuxtLink>
      <span v-else class="font-mono text-content-subtle">+{{ fmt(total - expandCap) }} more</span>
    </template>
  </div>
</template>

<script setup lang="ts">
// Canonical overflow control for capped lists (ranked panels, limited
// DataTables). Three states: collapsed → "Show all N" / "Show more (cap of
// N)", expanded → "Only show top N", and — past expandCap — a hand-off link
// to a full (possibly filtered) listing page, split off by a vertical
// hairline. `to` absent means no listing backs the list, so the tail past
// expandCap reads as a muted "+N more" count. The parent owns the `expanded`
// state and does its own row slicing; this control only renders the footer.
defineProps<{
  /** Full (unsliced) row count of the capped list. */
  total: number
  /** Rows shown collapsed; the control hides entirely at or under this. */
  rowCap: number
  /** Rows shown expanded; past this the hand-off link/count appears. */
  expandCap: number
  expanded: boolean
  /** Listing-page URL for the overflow hand-off (already filtered if needed). */
  to?: string
}>()
defineEmits<{ toggle: [] }>()

const fmt = (n: number) => n.toLocaleString()
</script>
