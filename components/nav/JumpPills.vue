<template>
  <div
    ref="root"
    :class="sticky ? 'sticky z-30 pointer-events-none' : 'inline-flex'"
    :style="sticky ? { top: `${stickyTop}px` } : undefined"
  >
    <!-- Sticky mode: a full-row sticky box (the old per-page wrapper) that joins
         the page's sticky band; pointer-events pass through everywhere but the
         pill bar itself. Plain mode: the bar alone, positioned by the consumer. -->
    <div
      class="pointer-events-auto inline-flex items-center gap-1 rounded-full border bg-surface px-1.5 py-1 shadow-md"
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
  </div>
</template>

<script setup>
// NavJumpPills — the anchor-pill jump nav for long stacked pages: one pill per
// page section, click scrolls to it, and a built-in scroll-spy highlights the
// section currently under the bar.
// `sticky` (design c104): the component pins itself at `stickyTop` and joins
// the page's sticky band (useStickyBand), beside the global Filter. The band
// publishes `--q-sticky-top`; jumps land that far down (the component sets
// `scroll-margin-top` on the target) and the spy line sits just below it, so
// pages need no wrapper and no `scroll-mt-*` on their sections.
// Without `sticky` the component is only the pill bar: consumers own its
// position and put a matching `scroll-mt-*` on each target section.
// Spy rules: the active section is the last whose top has crossed the spy
// line; above the first section nothing is active; at the very bottom of the
// page the final section wins even if its top never reaches the line.
const props = defineProps({
  // Ordered page sections: [{ id: 'lens-agents', label: 'Agents' }, …]. Each
  // id must exist as an element id on the page.
  sections: { type: Array, required: true },
  // Pin the bar and join the page's sticky band (see above).
  sticky:    { type: Boolean, default: false },
  // Pin offset in px from the viewport top while `sticky` (top-2).
  stickyTop: { type: Number, default: 8 },
  // Spy line in px from the viewport top. Unset: just below the band while
  // `sticky`; otherwise 96, which suits a `sticky top-2` wrapper over
  // sections with `scroll-mt-20`.
  offset:    { type: Number, default: null },
})

// `jump` fires on pill click (before the scroll) so consumers can sync URL
// state; `change` fires whenever the spy moves the highlight.
const emit = defineEmits(['jump', 'change'])

const active = ref('')
watch(active, (id) => emit('change', id))

// Jumps land LAND px below the band; the spy line sits a little lower so the
// landed section is the active one.
const LAND = 16
const bandHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--q-sticky-top')) || 0
const spyLine = () => props.offset ?? (props.sticky ? bandHeight() + LAND + 8 : 96)

const jump = (id) => {
  emit('jump', id)
  const el = document.getElementById(id)
  if (!el) return
  if (props.sticky) el.style.scrollMarginTop = `calc(var(--q-sticky-top, 0px) + ${LAND}px)`
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Band membership: pinned once the sticky box sits at its pin offset.
const root = ref(null)
const stuck = ref(false)
useStickyBandMember({ el: root, top: () => props.stickyTop, stuck, enabled: () => props.sticky })

let queued = false
const spy = () => {
  queued = false
  if (props.sticky && root.value)
    stuck.value = window.scrollY > 0 && root.value.getBoundingClientRect().top <= props.stickyTop + 0.5
  const line = spyLine()
  let current = ''
  for (const s of props.sections) {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= line) current = s.id
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
