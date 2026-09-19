<template>
  <section :id="id" class="scroll-mt-20">
    <!-- Heading row: title + mono scope caption, the house Surface idiom
         (qdash /inventory, agent detail, design user-v3). -->
    <div class="mb-1 flex items-baseline gap-3">
      <h2 class="text-24 font-bold text-content">{{ title }}</h2>
      <span v-if="caption || slots.caption" class="font-mono text-12 text-content-subtle">
        <slot name="caption">{{ caption }}</slot>
      </span>
    </div>
    <p v-if="lede || slots.lede" class="mb-4 text-13 text-content-subtle">
      <slot name="lede">{{ lede }}</slot>
    </p>

    <!-- Anything that sits between the lede and the panel grid (a footprint strip, a filter). -->
    <slot name="before" />

    <div class="grid grid-cols-1 gap-6" :class="columns === 3 ? 'lg:grid-cols-2 xl:grid-cols-3' : columns === 1 ? '' : 'lg:grid-cols-2'">
      <slot />
    </div>
  </section>
</template>

<!-- DataSurfaceSection — the chrome around a set of DataSurfacePanels: the
     "Surface" heading, a mono caption naming the scope ("what this agent
     touches"), a lede, an anchor id for NavJumpPills, and the responsive
     panel grid. Which panels appear, what their bars measure, and where rows
     link is the consumer's composition (qdash: components/surface/Section.vue)
     — this component is deliberately only the shell. -->
<script setup>
const props = defineProps({
  title   : { type: String, default: 'Surface' },
  // Mono caption beside the title, naming the scope — or use #caption.
  caption : { type: String },
  // One-line explanation under the heading — or use #lede.
  lede    : { type: String },
  // Anchor id for jump navs.
  id      : { type: String, default: 'sec-surface' },
  // Panel grid columns at lg+: 2 (default) or 3 (the six-panel case); 1 stacks.
  columns : { type: Number, default: 2 },
})
const slots = useSlots()
</script>
