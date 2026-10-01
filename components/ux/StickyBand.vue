<template>
  <div class="sticky top-0 z-20 h-0" aria-hidden="true">
    <!-- Zero-height sticky anchor: mounted once at the top of the layout's
         content column, it pins immediately and takes no flow space. The strip
         inside spans the column and is exactly as tall as the band
         (`--q-sticky-top`); it shows only while a registered control is pinned. -->
    <div
      class="_band absolute inset-x-0 top-0 border-b border-stroke bg-surface-sunken transition-opacity duration-150"
      :class="stuck ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    />
  </div>
</template>

<script setup>
// UxStickyBand — the backing behind the page's pinned controls (design c104).
// The controls themselves (Filter with `band`, NavJumpPills with `sticky`)
// stay sticky where they sit and register with useStickyBand; this strip
// fills the space between and behind them once any of them pins, so scrolled
// content never shows through the gaps. Transparent at rest. Sits above table
// headers (z-2) and below the controls (pills z-30, filter z-40). Extend it
// over the column's padding with negative margins on the component.
const { stuck } = useStickyBand()
</script>

<style scoped>
._band {
  height: var(--q-sticky-top, 0px);
}
</style>
