<template>
  <div class="overflow-hidden" :class="theme == 'light' ? 'rounded-8' : 'rounded-12'">
    <!-- Collapsible header: whole bar toggles, copy stays independent -->
    <button
      v-if="collapsible"
      class="flex items-center justify-between w-full px-4 py-2 bg-grey-800 cursor-pointer hover:bg-grey-700 transition-colors"
      @click="open = !open"
    >
      <span class="text-12 font-med text-grey-400 uppercase tracking-wide">{{ label }}</span>
      <div class="flex items-center gap-2">
        <span @click.stop><UxCopyBtn :text-to-copy="code" no-text /></span>
        <span class="text-12 text-grey-500">{{ open ? 'Hide' : 'Show' }}</span>
      </div>
    </button>

    <!-- Static header -->
    <div
      v-else-if="label"
      class="flex items-center justify-between px-4 py-2 bg-grey-800"
    >
      <span class="text-12 font-med text-grey-400 uppercase tracking-wide">{{ label }}</span>
      <UxCopyBtn :text-to-copy="code" no-text />
    </div>

    <!-- theme=dark chrome stays raw grey-800/900 by design: a code panel is
         deliberately dark on both page themes (like an editor). Only the
         light variant follows the page theme. -->
    <!-- lineNumbers: a gutter column (not selectable, not copied) that stays
         put while a long line scrolls sideways -->
    <pre
      v-show="open"
      class="m-0 p-4 overflow-x-auto"
      :class="[theme == 'light' ? 'bg-surface-sunken' : 'bg-grey-900', lineNumbers ? 'flex pl-0' : '']"
    ><span
      v-if="lineNumbers"
      aria-hidden="true"
      class="sticky left-0 shrink-0 select-none pl-4 pr-4 text-right font-mono leading-relaxed"
      :class="theme == 'light' ? 'bg-surface-sunken text-14 text-content-subtler' : 'bg-grey-900 text-13 text-grey-600'"
    >{{ gutter }}</span><code
      class="font-mono leading-relaxed"
      :class="theme == 'light' ? 'text-14 text-content' : 'text-13 text-grey-300'"
    >{{ code }}</code></pre>
  </div>
</template>

<script setup>
const props = defineProps({
  code:        { type: String, required: true },
  label:       { type: String, default: '' },
  collapsible: { type: Boolean, default: false },
  defaultOpen: { type: Boolean, default: false },
  // dark = doc/pattern code, light = inline page snippets
  theme:       { type: String, default: 'dark' },
  // a line-number gutter (editor source views)
  lineNumbers: { type: Boolean, default: false },
})

// one number per line; a single trailing newline doesn't render a line, so it gets no number
const gutter = computed(() => {
  const n = props.code.replace(/\n$/, '').split('\n').length
  return Array.from({ length: n }, (_, i) => i + 1).join('\n')
})

const open = ref(props.collapsible ? props.defaultOpen : true)
</script>
