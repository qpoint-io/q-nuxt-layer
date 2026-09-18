<!-- Placeholder for hand-placed SVG graphic endcaps (see cycles/c88.global-filter/designs/).
     Swap the checkerboard for real art via the default slot once available. -->
<template>
  <div class="-mt-[2px] -mb-[2px] -mr-[4px]">
    <img class="w-8" :src="filterEndcap" />
  </div>
</template>

<script setup>
// Relative asset import, not the ~/ Nuxt alias — ~/assets/... doesn't
// reliably resolve when this layer is consumed by another project (or
// under Vitest), same reasoning as integration/Logo.vue and agent/Pawn.vue.
import filterEndcap from '~/assets/svgs/filter/filter.svg'
</script>
