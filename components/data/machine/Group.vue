<template>
  <!-- Grid context for a band of DataMachines. Children become 4-row subgrids
       (see DataMachine) so titles, descriptions, value rows and provenance line
       up across siblings — a card without a description still aligns with one
       that has a wrapped description. Columns and column gaps are the
       consumer's (grid-cols-* / gap-x-* classes, as on any grid). Cards in a
       plain grid (no group) size themselves independently.

       Row gap is a prop, not a gap-y-* class: a subgrid inherits the parent's
       row gap between its own rows, so the group's row-gap is always 0 and the
       gap between wrapped rows of cards is each card's top margin — the group
       pulls itself up by the same amount so the first row sits flush.

       `alignFooters` gives each card's footer (provenance + spark) its own
       row, so footnote hairlines line up across the band even when one wraps
       — at the cost the default avoids: a tall device in one card pushes every
       sibling's footer down to its foot (c104). -->
  <div class="grid" :style="{ rowGap: 0, marginTop: `-${rowGap}px` }" data-machine-group>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  rowGap       : { type: Number, default: 32 },     // px between wrapped rows of cards
  alignFooters : { type: Boolean, default: false }, // footers (provenance + spark) get their own row, aligned across the band
})

provide('dataMachineGroup', computed(() => ({ rowGap: props.rowGap, alignFooters: props.alignFooters })))
</script>
