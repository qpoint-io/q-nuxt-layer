<template>
  <component :is="tag" class="border-l-2 pl-6" :class="toneClass">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  // grape = emphasis, grey = neutral, leaf = positive/highlight
  tone: { type: String, default: 'grape' },
  // semantic element, e.g. 'blockquote' for quotes
  tag:  { type: String, default: 'div' },
})

// grape/leaf are brand accents (stay raw); grey is neutral chrome and flips
const toneClass = computed(() => ({
  grape: 'border-grape-300',
  grey:  'border-stroke',
  leaf:  'border-leaf-400',
}[props.tone] || 'border-grape-300'))
</script>
