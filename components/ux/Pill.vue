<template>
  <!-- Outlined pill (design c92, 2026-09-24): full radius, a 1.5 px border in the tone's
       400 step, its 300 step at 20 % inside, dark mono bold text — the color lives in the
       border and fill, the text always reads as content. -->
  <span
    class="inline-block rounded-full border-solid font-mono font-bold text-content"
    :class="[toneClass, size_.cls]"
    :style="size_.style"
  >
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  // read-only category/status badge — for dismissible tags use UxTag
  tone: { type: String, default: 'grey' }, // 'grape' | 'leaf' | 'grey' | 'warn'
  size: { type: String, default: 'md' },   // 'sm' (dense table cells) | 'md' | 'lg'
})

// Pixel-exact border widths / line heights go in inline style, not arbitrary Tailwind
// values — a consumer's Tailwind scan doesn't reliably cover layer files.
const SIZES = {
  sm: { cls: 'px-2 py-px text-12',     style: { borderWidth: '1px',   lineHeight: '15px' } },
  md: { cls: 'px-2.5 py-0.5 text-13',  style: { borderWidth: '1.5px', lineHeight: '16px' } },
  lg: { cls: 'px-3 py-1 text-15',      style: { borderWidth: '1.5px', lineHeight: '20px' } },
}

const size_ = computed(() => SIZES[props.size] || SIZES.md)

// warn uses rose-*: the flat brand `red` token clobbers Tailwind's red-* scale
const TONES = {
  grape: 'border-grape-400 bg-grape-300/20',
  leaf:  'border-leaf-400 bg-leaf-300/20',
  grey:  'border-grey-350 bg-grey-300/20',
  warn:  'border-rose-400 bg-rose-300/20',
}

const toneClass = computed(() => TONES[props.tone] || TONES.grey)
</script>
