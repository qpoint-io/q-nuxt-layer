<template>
  <div
    ref="root"
    :class="joined ? ['_row2 sticky z-30 pointer-events-none', compact ? '_compact' : ''] : 'inline-flex'"
    :style="joined ? { top: pinLine, height: `${B.navRow.rest}px` } : undefined"
  >
    <!-- In a band: a full-row sticky box (z-30) that keeps its rest height in
         every look, so compacting never moves the page; pointer events pass
         through everywhere but the pill bar. Plain: the bar alone, positioned
         by the consumer. -->
    <div
      class="_bar pointer-events-auto inline-flex items-center gap-1 rounded-full border bg-surface px-1.5 py-1 shadow-md"
      :class="active ? 'border-grape-300' : 'border-stroke'"
    >
      <button
        v-for="s in sections"
        :key="s.id"
        class="_pill rounded-full px-3.5 py-1 text-13 font-med"
        :class="active === s.id
          ? '_on bg-primary/10 text-primary'
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
//
// Sticky band (useStickyBand): the pills join the page's band whenever a
// UxStickyBand is mounted (`sticky` forces it, `:sticky="false"` opts out).
// They pin themselves, so pages need no wrapper and no `scroll-mt-*`: jumps
// land under the band (the component sets `scroll-margin-top` on the target)
// and the spy line sits just below it.
//   - c104 band: pinned at `stickyTop`, beside the global filter.
//   - c106 band (UxStickyBand `title`): docked under the page title (row 2).
//     Once pinned they turn compact — no fill, a grey-350 outline; inactive
//     pills black semibold; the active one purple bold with a 2px ring — and
//     stay so in either scroll direction. Their pin line eases with the band;
//     the pills themselves change in 200ms, so the ring keeps up with the spy.
// Without a band the component is only the pill bar: consumers own its
// position and put a matching `scroll-mt-*` on each target section.
// Spy rules: the active section is the last whose top has crossed the spy
// line; above the first section nothing is active; at the very bottom of the
// page the final section wins even if its top never reaches the line.
const props = defineProps({
  // Ordered page sections: [{ id: 'lens-agents', label: 'Agents' }, …]. Each
  // id must exist as an element id on the page.
  sections: { type: Array, required: true },
  // Join the page's sticky band. Unset: join when a band is mounted.
  sticky:    { type: Boolean, default: undefined },
  // Pin offset in px from the viewport top in a c104 band (top-2).
  stickyTop: { type: Number, default: 8 },
  // Spy line in px from the viewport top. Unset: just below the band when
  // joined; otherwise 96, which suits a `sticky top-2` wrapper over sections
  // with `scroll-mt-20`.
  offset:    { type: Number, default: null },
})

// `jump` fires on pill click (before the scroll) so consumers can sync URL
// state; `change` fires whenever the spy moves the highlight.
const emit = defineEmits(['jump', 'change'])

const B = STICKY_BAND
const band = useStickyBand()

const active = ref('')
watch(active, (id) => emit('change', id))

// ── Band membership ─────────────────────────────────────────────────────────
const joined = computed(() => props.sticky === true || (props.sticky !== false && band.state.attached))
const member = ref(null)
const pinned = ref(false)
watch(joined, (on) => {
  if (on && !member.value) member.value = band.registerNav({ top: () => props.stickyTop })
  else if (!on && member.value) { member.value.release(); member.value = null; pinned.value = false }
})
onMounted(() => { if (joined.value && !member.value) member.value = band.registerNav({ top: () => props.stickyTop }) })
onBeforeUnmount(() => { member.value?.release(); member.value = null })
watch(pinned, (on) => member.value?.setPinned(on))

/** c106: docked under the title (row 2); c104: at stickyTop. */
const pinLine = computed(() => (band.titleBand.value ? `var(--q-sticky-row1, ${props.stickyTop}px)` : `${props.stickyTop}px`))
/** Compact once pinned in a c106 band, either scroll direction. */
const compact = computed(() => band.titleBand.value && band.look.value !== 'rest' && pinned.value)

// ── Jumps and the spy ───────────────────────────────────────────────────────
const spyLine = () => props.offset ?? (joined.value ? band.top.value + B.jumpGap + 8 : 96)

const jump = (id) => {
  emit('jump', id)
  const el = document.getElementById(id)
  if (!el) return
  if (joined.value) {
    member.value?.holdForJump()
    // land under the band as it will be on arrival (compact, pills docked)
    el.style.scrollMarginTop = `calc(var(--q-sticky-top-down, var(--q-sticky-top, 0px)) + ${B.jumpGap}px)`
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const root = ref(null)
let queued = false
const spy = () => {
  queued = false
  if (joined.value && root.value) {
    // Compare with the pin line as it is right now (`top` mid-transition), not
    // its target — or the glide would read as "not pinned" and flicker.
    const line = parseFloat(getComputedStyle(root.value).top) || props.stickyTop
    pinned.value = window.scrollY > 0 && root.value.getBoundingClientRect().top <= line + 0.5
  }
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

<style scoped>
/* The pin line eases with the band (row 1 compacting or growing). */
._row2 { transition: top var(--q-band-dur, 0ms) var(--q-band-ease, ease); }

/* Pills change quickly: the selection follows the spy, so the ring keeps up.
   The bar's padding is quick too; its colours follow the band. */
._row2 ._bar {
  transition: padding 200ms ease, background-color var(--q-band-dur, 0ms) var(--q-band-ease, ease),
    border-color var(--q-band-dur, 0ms) var(--q-band-ease, ease), box-shadow var(--q-band-dur, 0ms) var(--q-band-ease, ease);
}
._row2 ._pill {
  transition: padding 200ms ease, font-size 200ms ease, background-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
}

/* Compact (design c106): no fill and a 1px grey-350 outline on the bar; black
   semibold pills; the active pill purple bold with a 2px inset ring and no
   vertical padding (the bar centres its pills, so it stays aligned). */
._compact ._bar {
  padding: 2px;
  background-color: transparent;
  border-color: #AAAAAA; /* grey-350 */
  box-shadow: none;
}
._compact ._pill {
  padding: 1px 9px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--qp-content));
  background-color: transparent;
}
._compact ._pill._on {
  padding-top: 0;
  padding-bottom: 0;
  font-weight: 700;
  color: rgb(var(--qp-primary));
  box-shadow: inset 0 0 0 2px rgb(var(--qp-primary));
}

@media (prefers-reduced-motion: reduce) {
  ._row2, ._row2 ._bar, ._row2 ._pill { transition: none; }
}
</style>
