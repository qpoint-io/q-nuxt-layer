<template>
  <!-- Jumps (/#inventory) land under the sticky band when there is one — the
       same scroll margin NavJumpPills sets on its targets; with no band the
       var falls back to 0 and the gap alone applies. -->
  <section :id="sectionId" :style="{ scrollMarginTop }" data-index-section>

    <!-- Heading row — the title is a heading, not a link (Mark, c109 Q3: the
         section's own page is gone; its doors are the listing links below).
         #title-right takes a count or a caption on the title's baseline; when
         a long title wraps it, ml-auto keeps it at the right edge. -->
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 class="text-28 font-bold text-content">{{ title }}</h2>
      <div v-if="slots['title-right']" class="ml-auto text-13 text-content-subtle">
        <slot name="title-right" />
      </div>
    </div>

    <p v-if="lede || slots.lede" class="text-13 text-content-subtle">
      <slot name="lede">{{ lede }}</slot>
    </p>

    <!-- Listing links — the section's doors, one per listing in nav order,
         dot-separated, wrapping when the column is narrow. Each dot travels
         with the link before it (one no-wrap unit), so a wrapped row ends a
         line on "·" instead of starting one with it. #links replaces the row
         (a door with a count, an external link). -->
    <nav v-if="slots.links || links.length" class="mt-1 flex flex-wrap items-baseline gap-y-1 text-13 font-med" :aria-label="`${title} listings`" data-index-links>
      <slot name="links">
        <span v-for="(l, i) in links" :key="l.to" class="whitespace-nowrap">
          <NuxtLink :to="l.to" class="text-primary hover:text-content">{{ l.label }}</NuxtLink>
          <span v-if="i < links.length - 1" class="mx-2 text-content-subtle" aria-hidden="true">·</span>
        </span>
      </slot>
    </nav>

    <div class="hairline mt-3" />

    <!-- Summary — by default the section owns the grid: a DataMachineGroup of
         auto-fill columns at least `minColumn` wide, so bare DataMachineMicros
         dropped in the slot align their value rows, and every section on an
         index page shares one column rhythm (same container, same tracks →
         micros line up section to section; auto-fill keeps empty tracks, so a
         short section doesn't stretch its micros). `:grid="false"` hands the
         slot over as-is, for a summary the consumer lays out itself (micros
         clustered per listing, a single wide device).

         pt-5, not mt-5: the group pulls itself up by its row gap with a
         negative margin, which would collapse into a margin here. -->
    <div class="pt-5">
      <DataMachineGroup v-if="grid" :rowGap="ROW_GAP" :style="gridStyle">
        <slot />
      </DataMachineGroup>
      <slot v-else />
    </div>
  </section>
</template>

<!-- DataIndexSection — one nav section on an index page (design c109): the
     section's name, its listing links, a hairline and a summary of
     DataMachineMicros. The sibling of DataSurfaceSection and, like it, only
     the shell: which micros appear, what they count and where they link is
     the consumer's composition (qdash: the `/` index over each listing's own
     bands). The section has no states of its own — each micro carries its
     own (null → "—"), so a failed feed blanks its micros, not the section. -->
<script setup>
const props = defineProps({
  title     : { type: String, required: true },          // the nav section's name — a heading, not a link
  id        : { type: String },                          // anchor; default derived from the title ("Inventory" → "inventory")
  lede      : { type: String },                          // one line under the title — or use #lede
  links     : { type: Array, default: () => [] },        // [{ to, label }] — the listing doors, nav order
  grid      : { type: Boolean, default: true },          // the built-in micro grid; false = the slot renders as-is
  minColumn : { type: Number, default: 190 },            // px — the narrowest a grid column (one micro) may be
  cards     : { type: Boolean, default: true },          // the micros inside render as cards (white, rounded, soft shadow) unless one sets its own `card`
})

// Cards (Mark, 2026-10-02 — preset B of the c109 micro-cards thread, picked
// over flat micros, micro cards with smaller data and a white section card):
// every DataMachineMicro inside takes the card look by injection, so a page
// composes plain micros and the section decides their chrome.
provide('dataIndexSection', computed(() => ({ cards: props.cards })))
const slots = useSlots()

// gaps are the section's rhythm, not props: between wrapped rows (each
// micro's top margin, see DataMachineGroup) and between columns. Cards sit
// 16 px apart — their own white edge does the separating; flat micros need
// air instead, 48 px (both from Mark's c109 follow-ups: flat 20 / 32 → 48 / 48,
// then the cards at 16 / 16)
const ROW_GAP = computed(() => (props.cards ? 16 : 48))
const COL_GAP = computed(() => (props.cards ? 16 : 48))

const scrollMarginTop = `calc(var(--q-sticky-top-down, var(--q-sticky-top, 0px)) + ${STICKY_BAND.jumpGap}px)`

const sectionId = computed(() => props.id || props.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))

// inline, not grid-cols-* classes: the track width is a prop, and an
// arbitrary-value class wouldn't reach the consumer's Tailwind scan
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(${props.minColumn}px, 1fr))`,
  columnGap: `${COL_GAP.value}px`,
}))
</script>
