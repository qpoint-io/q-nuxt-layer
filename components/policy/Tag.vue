<template>
  <span class="inline-flex min-w-0 items-stretch rounded-full border border-primary/30 bg-grape-50" :class="s.pill">
    <span class="flex min-w-0 items-center" :class="[s.gap, flush ? s.leftFlush : s.left]">
      <!-- the ribbon is a touch bigger than the pill and its tail hangs over the lower edge; z-0 keeps it over the
           rows below but under a sticky table header (UxTableListHeader is z-1 / z-2) -->
      <PolicyRibbonMark faded class="relative z-0 w-auto shrink-0" :style="ribbon" />
      <span class="truncate font-semi text-content" :class="s.name" :title="title"><slot /></span>
    </span>
    <span v-if="scope" class="flex shrink-0 items-center rounded-r-full border-l border-primary/30 bg-grape-100 font-bold text-primary" :class="s.scope">{{ scope }}</span>
  </span>
</template>

<script setup>
// A policy as a pill: the faded policy ribbon, the policy's name, and an
// optional scope segment ("Org Wide", "Team : Engineering") on a darker grape.
// Built for design's c121 change-impact card (Mark, 2026-10-23); the policy
// counterpart of ComplianceTag. `size` follows the UxToggle convention.
//   <PolicyTag scope="Team : Engineering">Tools must be on the allow list</PolicyTag>
//   <PolicyTag size="small">Agents run in a sandbox</PolicyTag>
//   <PolicyTag size="small" :icon-scale="0.6">…</PolicyTag>   (a smaller ribbon in dense lists)
const props = defineProps({
  scope: { type: String, default: '' },
  size: { type: String, default: 'medium' }, // 'small' | 'medium'
  /** full name for the hover, when the slot text truncates */
  title: { type: String, default: undefined },
  /** ribbon size as a multiple of the size's default (1); its overhang scales with it */
  iconScale: { type: Number, default: 1 },
  /** no padding before the ribbon: it sits on the pill's left edge (dense tables) */
  flush: { type: Boolean, default: false },
})

const SIZES = {
  medium: { pill: 'h-7', left: 'pl-1 pr-3', leftFlush: 'pl-0 pr-3', gap: 'gap-2', ribbon: { h: 40, below: 16, above: 4 }, name: 'text-13', scope: 'px-3 text-12' },
  small: { pill: 'h-5', left: 'pl-1 pr-2', leftFlush: 'pl-0 pr-2', gap: 'gap-1.5', ribbon: { h: 32, below: 12, above: 4 }, name: 'text-12', scope: 'px-2 text-11' },
}
const s = computed(() => SIZES[props.size] || SIZES.medium)
// the ribbon in px: a touch bigger than the pill, its tail hanging over the lower edge, all scaled by iconScale
const ribbon = computed(() => {
  const r = s.value.ribbon, k = props.iconScale
  // an explicit width too: an SVG <img> with only a viewBox counts as 0 wide at min-content sizing, clipping the name (aspect 21.82 / 31.52)
  return { height: `${r.h * k}px`, width: `${r.h * k * 0.692}px`, marginBottom: `${-r.below * k}px`, marginTop: `${-r.above * k}px` }
})
</script>
