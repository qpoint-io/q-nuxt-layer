<template>
  <!-- Armed only while the content is wider than the box: any overflow value
       (overflow-x-auto forces overflow-y to auto too) makes this box the sticky
       container for a table header inside it, and since it never scrolls
       vertically the header would never pin to the page. While armed, the
       band offset is reset so a header can't be pushed down inside the box. -->
  <div ref="box" :class="{ 'overflow-x-auto _armed': overflows }">
    <slot />
  </div>
</template>

<script setup>
// UxOverflowX — horizontal scroll only when needed (design c104). Wrap a
// table (or anything that may outgrow its column) instead of a hand-rolled
// `overflow-x-auto` div: content that fits keeps sticky table headers pinned
// to the page; content that overflows scrolls sideways and its header gives up
// pinning for that case (CSS can't do both on one box). Tables are meant to
// fit — column picker, truncation, min widths — so this is the fallback.
const box = ref(null)
const overflows = ref(false)

// scrollWidth sees overflow at any depth (UxTableList puts a full-width
// wrapper between this box and its <table>), armed or not.
// Absolutely positioned overflow counts too — keep popovers out of the box.
const measure = () => {
  const el = box.value
  if (el) overflows.value = el.scrollWidth > el.clientWidth + 1
}

// Observe the box and every child and table inside it (a table's width moves
// with its columns, not the box's); re-attach when the subtree changes, at
// most once a frame.
let ro = null
let mo = null
let queued = 0
const observe = () => {
  queued = 0
  const el = box.value
  if (!el) return
  ro?.disconnect()
  ro = new ResizeObserver(measure)
  ro.observe(el)
  for (const child of el.children) ro.observe(child)
  for (const table of el.querySelectorAll('table')) ro.observe(table)
  measure()
}
onMounted(() => {
  observe()
  mo = new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(observe) })
  mo.observe(box.value, { childList: true, subtree: true })
})
onBeforeUnmount(() => {
  ro?.disconnect()
  mo?.disconnect()
  cancelAnimationFrame(queued)
})
</script>

<style scoped>
._armed {
  --q-sticky-top: 0px;
}
</style>
