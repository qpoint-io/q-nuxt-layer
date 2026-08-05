<template>
  <div
    class="inline-flex items-center gap-1 rounded-full border bg-surface px-1.5 py-1 shadow-md"
    :class="active ? 'border-grape-300' : 'border-stroke'"
  >
    <button
      v-for="s in sections"
      :key="s.id"
      class="rounded-full px-3.5 py-1 text-13 font-med"
      :class="active === s.id
        ? 'bg-primary/10 text-primary'
        : 'text-content-subtle hover:bg-surface-sunken hover:text-content'"
      @click="jump(s.id)"
    >{{ s.label }}</button>
  </div>
</template>

<script setup>
// NavJumpPills — the anchor-pill jump nav for long stacked pages: one pill per
// page section, click scrolls to it, and a built-in scroll-spy highlights the
// section currently under the bar. The component is only the pill bar —
// consumers own its position (typically a `sticky top-2 z-30` wrapper) and put
// a matching `scroll-mt-*` on each target section so headings clear the bar.
// Spy rules: the active section is the last whose top has crossed `offset`;
// above the first section nothing is active; at the very bottom of the page
// the final section wins even if its top never reaches the line.
const props = defineProps({
  // Ordered page sections: [{ id: 'lens-agents', label: 'Agents' }, …]. Each
  // id must exist as an element id on the page.
  sections: { type: Array, required: true },
  // Spy line in px from the viewport top. The default suits a `sticky top-2`
  // bar over sections with `scroll-mt-20`.
  offset:   { type: Number, default: 96 },
})

// `jump` fires on pill click (before the scroll) so consumers can sync URL
// state; `change` fires whenever the spy moves the highlight.
const emit = defineEmits(['jump', 'change'])

const active = ref('')
watch(active, (id) => emit('change', id))

const jump = (id) => {
  emit('jump', id)
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let queued = false
const spy = () => {
  queued = false
  let current = ''
  for (const s of props.sections) {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= props.offset) current = s.id
  }
  const last = props.sections[props.sections.length - 1]
  if (last && document.getElementById(last.id) && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
    current = last.id
  active.value = current
}
const onScroll = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(spy)
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  spy()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
