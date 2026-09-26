<template>
  <!-- Inside a NavVerticalSubmenu (provide/inject, or `sub` set explicitly)
       the row takes the sub treatment: italic, tighter rows, and the
       submenu's subWeight / subSize / subGap (med 13, 1px gap by default). -->
  <div :class="`group ${isSub ? `${subWeight} italic` : 'font-semi'} ${fontSize} whitespace-nowrap select-none flex relative`">
    <!-- If it's a nuxt link -->
    <nuxt-link v-if="to" :to="to"
      class="vertical-link w-full"
      :class="{ active, sub: isSub }"
      :style="subPad"
    >
      <slot/>
    </nuxt-link>
    <!-- else if it's a link -->
    <a :href="href" :target="target" v-else-if="href"
      class="vertical-link"
      :class="{ active, sub: isSub }"
      :style="subPad"
    >
      <slot/>
    </a>

    <!-- else it's a nothing.. -->
    <slot v-else />
  </div>

</template>

<style scoped>
  .vertical-link{
    @apply block py-1 pl-2 -ml-2 -mb-[2px] text-content group-hover:text-primary;
  }
  .vertical-link.active{
    @apply text-primary group-hover:text-primary
  }

</style>

<script setup>
const props = defineProps({
  size  : { type:String, default: 'medium'},
  to    : { type:String },
  href  : { type:String },
  target: { type:String, default:"_self" },
  active: { type: Boolean, default: false },
  // Sub-item treatment. Unset = inherit from an enclosing NavVerticalSubmenu;
  // true/false forces it either way (the submenu's own parent row passes false).
  sub   : { type: Boolean, default: undefined }
})

// NavVerticalSubmenu provides { weight, size } for its children (null outside one).
const submenu = inject('navSubmenu', null)
const isSub = computed(() => props.sub ?? !!submenu)

// Literal class maps so Tailwind's scan sees every class (no built strings).
const WEIGHTS = { reg: 'font-reg', med: 'font-med', semi: 'font-semi', bold: 'font-bold', exbold: 'font-exbold', black: 'font-black' }
const SIZES = { 11: 'text-11', 12: 'text-12', 13: 'text-13', 14: 'text-14', 15: 'text-15', 16: 'text-16' }

// Sub defaults (Mark, design c98) — also what `sub` forced outside a submenu gets.
const SUB = { weight: 'med', size: 13, gap: 1 }

const subWeight = computed(() => WEIGHTS[submenu?.value.weight] ?? WEIGHTS[SUB.weight])

// Provisional tuning knob (design c98): the submenu's subGap (px between rows),
// split into top/bottom padding so the click area stays contiguous. Inline style
// because it's a free px value.
const subPad = computed(() => {
  if (!isSub.value) return undefined
  const gap = submenu?.value.gap ?? SUB.gap
  return { paddingTop: `${gap / 2}px`, paddingBottom: `${gap / 2}px` }
})

const fontSize = computed(()=>{
  if(isSub.value)
    return SIZES[submenu?.value.size] ?? SIZES[SUB.size]

  if(props.size == 'small')
    return 'text-13'

  return 'text-15'
})
</script>
