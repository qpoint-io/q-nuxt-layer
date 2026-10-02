<template>
  <div class="sticky top-0 z-20 h-0" aria-hidden="true">
    <!-- A zero-height sticky anchor at the top of the content column: it pins at
         once and takes no flow space. The strip inside is the band's backing —
         exactly the band's current height (--q-sticky-top), shown while the band
         is pinned, with a two-layer shadow hung off its bottom edge. It fades in
         at its height; only once it is fully in does its height animate (the
         sub nav docking, the band compacting). The members (title, sub nav,
         filter) pin themselves on top of it. -->
    <div
      class="_strip absolute inset-x-0 top-0 border-b border-stroke bg-surface-sunken"
      :class="[showBacking ? 'opacity-100' : 'pointer-events-none opacity-0', steady ? '_steady' : '']"
    />
  </div>
</template>

<script setup>
// UxStickyBand — the page's sticky band (useStickyBand): its backing, and its
// switch. Mount it once, at the top of the layout's content column, inside the
// relative wrapper that holds the global filter, with negative margins over
// the column's padding (`class="-mx-8"`). While it is mounted the band
// publishes its heights, and NavJumpPills joins it on its own.
//
// `title` (design c106) turns on the two-column band: UxPageTitle pins on row 1
// beside the filter, the sub nav docks under it on row 2, and the band
// compacts while scrolling (useStickyBand). Off, the band is c104's: the
// filter and the sub nav pin side by side. A UxPageTitle can only pin when it
// is a direct child of a tall element (the page) — a sticky box can't leave
// its parent.
const props = defineProps({
  title: { type: Boolean, default: false },
})

const band = useStickyBand()
const { showBacking } = band

// Steady = shown and done fading in. Until then the strip's height snaps to the
// band's (no transition), so it appears at its size instead of sliding to it.
const steady = ref(false)
let steadyTimer = null
watch(showBacking, (on) => {
  clearTimeout(steadyTimer)
  steady.value = false
  if (on) steadyTimer = setTimeout(() => { steady.value = true }, STICKY_BAND.motion.fade)
})
onBeforeUnmount(() => clearTimeout(steadyTimer))

let detach = null
onMounted(() => { detach = band.attach({ title: props.title }) })
onBeforeUnmount(() => detach?.())
</script>

<style scoped>
._strip {
  height: var(--q-sticky-top, 0px);
  /* the fade (which carries the shadow) is quicker than the band's motion */
  transition: opacity var(--q-band-fade, 150ms) var(--q-band-ease, ease);
  /* shadow strength per layer (design c106) */
  --q-band-shadow-near: 0.18;
  --q-band-shadow-far: 0.08;
}

/* The shadow: two absolute layers starting at the strip's bottom edge, each a
   black 100% → 0% alpha gradient scaled by its opacity — a 5px contact shadow
   and a 20px falloff. They live inside the strip, so they fade with it. */
._strip::before,
._strip::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 100%;
  pointer-events: none;
  background: linear-gradient(to bottom, rgb(0 0 0 / 1), rgb(0 0 0 / 0));
}
/* once fully in, the height follows the band's motion */
._strip._steady {
  transition: height var(--q-band-dur, 0ms) var(--q-band-ease, ease), opacity var(--q-band-fade, 150ms) var(--q-band-ease, ease);
}

._strip::before { height: 5px; opacity: var(--q-band-shadow-near); }
._strip::after { height: 20px; opacity: var(--q-band-shadow-far); }

@media (prefers-reduced-motion: reduce) {
  ._strip { transition: none; }
}
</style>
