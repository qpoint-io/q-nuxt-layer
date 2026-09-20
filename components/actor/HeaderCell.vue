<template>
  <div class="flex flex-col px-12" :class="center ? 'items-center' : ''">
    <div class="text-13 font-bold text-content">{{ label }}</div>
    <div v-if="value != null && !slots.default" class="mt-2 text-32 font-bold leading-none text-content">
      {{ value }}
    </div>
    <slot v-else />
  </div>
</template>

<!-- ActorHeaderCell — one headline cell in an ActorHeader's #cells: a
     text-13 bold label over a value. Pass `value` for the plain text-32 number
     (Spend), or fill the default slot for anything else (a DataSmile score, a
     pill). `center` stacks label and content on the cell's center axis — the
     score idiom. Must be a direct child of the ActorHeader row (it is, via the
     #cells fragment) so the row's divide-x draws the hairline between cells. -->
<script setup>
defineProps({
  label  : { type: String, required: true },
  // Plain headline value; ignored when the default slot is filled.
  value  : { type: [String, Number] },
  // Center the label and content (score-style cell).
  center : { type: Boolean, default: false },
})
const slots = useSlots()
</script>
