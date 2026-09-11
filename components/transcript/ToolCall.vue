<template>
  <div class="rounded-8 border border-stroke bg-surface-sunken overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-surface"
      @click="open = !open"
    >
      <span class="w-6 h-6 shrink-0 grid place-items-center rounded-4 border border-stroke bg-surface">
        <UxIcon id="gear" class="w-3.5 h-3.5 text-content-subtle" />
      </span>
      <span class="text-13 font-mono font-bold text-content">{{ title }}</span>
      <UxIcon
        id="arrow-right"
        class="ml-auto w-2.5 shrink-0 text-content-subtle transition-transform duration-150"
        :class="open ? 'rotate-90' : 'rotate-0'"
      />
    </button>

    <div v-if="open" class="border-t border-stroke px-3 py-2.5 flex flex-col gap-2">
      <dl class="font-mono text-11 leading-relaxed">
        <template v-if="details.input">
          <dt class="italic text-content-subtle">input:</dt>
          <dd class="pl-3 whitespace-pre-wrap text-content">{{ details.input }}</dd>
        </template>
        <template v-if="details.content">
          <dt class="mt-1.5 italic text-content-subtle">content:</dt>
          <dd class="pl-3 whitespace-pre-wrap text-content max-h-48 overflow-y-auto">{{ details.content }}</dd>
        </template>
        <template v-if="details.output">
          <dt class="mt-1.5 italic text-content-subtle">output:</dt>
          <dd class="pl-3 whitespace-pre-wrap text-content max-h-48 overflow-y-auto">{{ details.output }}</dd>
        </template>
      </dl>
      <p v-if="summary" class="text-12 font-mono text-content-subtle">{{ summary }}</p>
    </div>
  </div>
</template>

<script setup>
// One tool-call burst inside a TranscriptMessage — collapsed to a single
// row (showing `title` verbatim, e.g. "Ran: whoami") until clicked open,
// matching c85's reference sketch.
defineProps({
  title:   { type: String, required: true },
  summary: { type: String, default: '' },
  details: {
    type: Object,
    required: true,
    // { tool, input, content?, output }
  },
})

const open = ref(false)
</script>
