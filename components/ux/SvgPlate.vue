<template>
  <div
    class="ux-svg-plate"
    :class="[`ux-svg-plate--pad-${pad}`, { 'ux-svg-plate--on': isDark }]"
  >
    <img v-if="src" :src="src" :alt="alt" class="ux-svg-plate-img">
    <slot v-else />
  </div>
</template>

<script setup>
// UxSvgPlate — a white backing plate for art that was only drawn for light
// backgrounds (blog diagrams, third-party logos, archive exports with black
// ink). Transparent in light mode; under `.dark` (or a provideThemeMode('dark')
// context) the plate paints white so the art reads as on paper. Padding and
// radius apply in both modes so the layout doesn't shift when the theme flips.
// Fills its container's width and the art scales to fit; cap it from the
// consumer with a Tailwind class (`max-w-xl`, `max-w-3xl`).
// Art that has been formulated for dark mode doesn't need this — reach for
// UxPixelArt / UxIcon / currentColor instead.
//
// Prefer `src` for Illustrator exports: they style by `.cls-N` classes in a
// <style> block, so two inlined on one page restyle each other. An <img>
// keeps each file's styles to itself.
defineProps({
  // Image URL — renders an <img>. Omit to wrap the default slot (inline svg,
  // UxIcon, <img>, anything).
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  // Inset between plate edge and art: none | sm | md | lg.
  pad: { type: String, default: 'sm' },
})

// Scoped dark context (provideThemeMode) — the document-level `.dark` class is
// handled in CSS so the plate is right from first paint.
const { isDark } = useThemeMode()
</script>

<style scoped>
.ux-svg-plate {
  @apply flex w-full items-center justify-center dark:bg-white;
}
.ux-svg-plate--pad-none { @apply p-0 rounded-4; }
.ux-svg-plate--pad-sm   { @apply p-1 rounded-4; }
.ux-svg-plate--pad-md   { @apply p-2 rounded-6; }
.ux-svg-plate--pad-lg   { @apply p-4 rounded-8; }

/* Not `:global(.dark) .ux-svg-plate` — scoped compilation collapses that to a
   bare `.dark` rule and paints <html> white. */
.ux-svg-plate--on {
  @apply bg-white;
}
.ux-svg-plate-img {
  @apply block w-full h-auto;
}
</style>
