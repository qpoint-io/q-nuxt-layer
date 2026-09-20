<template>
  <div class="flex flex-wrap items-start gap-y-6 divide-x divide-stroke mb-6">
    <!-- Identity cell: mark · name · subline -->
    <div class="flex items-center gap-6 py-1 pr-12">
      <slot name="mark" />
      <div>
        <div class="text-38 font-bold leading-tight text-content">
          <slot name="name" />
        </div>
        <div v-if="slots.subline" class="flex items-center gap-1.5 text-14 text-content-subtle">
          <slot name="subline" />
        </div>
      </div>
    </div>

    <!-- Headline cells (ActorHeaderCell). Rendered as a fragment so each cell is a
         direct child of the row — that is what makes divide-x draw the hairline. -->
    <slot name="cells" />

    <!-- Metadata cell: key/value grid + Show-All toggle for the long tail -->
    <div v-if="slots.metadata" :class="showAll ? 'pr-20' : 'pl-12'">
      <div class="text-13 font-bold text-content mb-2">{{ metadataLabel }}</div>
      <div class="grid content-start grid-cols-[auto_1fr] items-baseline gap-x-10 leading-[1.4] text-12">
        <slot name="metadata" />
        <template v-if="showAll">
          <slot name="metadataMore" />
        </template>
      </div>
      <button
        v-if="slots.metadataMore"
        type="button"
        class="mt-1.5 text-12 font-med text-primary duration-300 hover:text-content hover:duration-0"
        @click="showAll = !showAll"
      >
        {{ showAll ? lessLabel : moreLabel }}
      </button>
    </div>
  </div>
</template>

<!-- ActorHeader — the combined identity header every actor detail page opens
     with (qdash agents/detail.vue, design c59/c60 agent-detail-v2): one
     hairline-divided row of cells. First cell is the identity (a mark, the
     name at text-38, a subline of "vendor / kind / ● state" facts); then the
     consumer's headline cells (ActorHeaderCell — Spend, a score with a
     DataSmile); last, a Metadata cell — a key/value grid whose long tail hides
     behind "Show All Metadata". The component owns only the chrome and the
     Show-All state; every fact, link and glyph is the consumer's composition.

     Metadata pairs are two spans per row inside the grid:
       <span class="text-content-subtle">User</span>
       <span class="font-semi text-content">priya@acme.com</span>
     Subline parts are separated by <span class="opacity-50">/</span>. -->
<script setup>
const props = defineProps({
  // Label over the metadata key/value grid.
  metadataLabel : { type: String, default: 'Metadata' },
  // Toggle copy — collapsed / expanded.
  moreLabel     : { type: String, default: 'Show All Metadata' },
  lessLabel     : { type: String, default: 'Show less' },
  // Start with the long tail (#metadataMore) revealed.
  open          : { type: Boolean, default: false },
})
const slots = useSlots()
const showAll = ref(props.open)
</script>
