/**
 * useStickyBand — the page's pinned controls (the global Filter, NavJumpPills)
 * coordinated as one band (design c104). Each control stays sticky where it
 * sits; the band only measures them and publishes the space they take:
 * `--q-sticky-top` on <html> = the lowest registered bottom edge + a gap.
 * With nothing registered the property is removed, so readers fall back to 0.
 *
 * Readers: UxTableListHeader (pins under the band), NavJumpPills (spy line and
 * jump landing), UxStickyBand (the backing behind the pinned controls).
 *
 * The value counts every registered control, pinned or not, so it never
 * changes mid-scroll: a table header can only pin once the band above it has
 * pinned, and a jump lands with the band already pinned.
 *
 * One band per page: the state is module-level and writes to <html>.
 * Registration happens on mount only, so server renders never touch it.
 */
import type { Ref } from 'vue'

const GAP = 8

type Member = { bottom: number, stuck: boolean }
const members = reactive(new Map<number, Member>())
let nextId = 0

const publish = () => {
  let max = 0
  for (const m of members.values()) max = Math.max(max, m.bottom)
  const root = document.documentElement.style
  if (members.size) root.setProperty('--q-sticky-top', `${Math.ceil(max + GAP)}px`)
  else root.removeProperty('--q-sticky-top')
}

/** Band state for the backing: true while any registered control is pinned. */
export function useStickyBand() {
  const stuck = computed(() => [...members.values()].some((m) => m.stuck))
  return { stuck }
}

/**
 * Register a pinned control with the band.
 * - `el`: the control's sticky box.
 * - `top`: its pin offset in px (the sticky `top` value).
 * - `stuck`: whether it is pinned right now.
 * - `enabled`: membership switch (a prop like `band`/`sticky`, or "not hidden").
 * Height is `el.scrollHeight`, so a zero-height box whose content overflows it
 * (the Filter's `h-0` bar) still counts its full content. Re-measured on
 * resize and on any DOM change inside the box.
 */
export function useStickyBandMember(opts: {
  el: Ref<HTMLElement | null>
  top: () => number
  stuck: Ref<boolean>
  enabled: () => boolean
}) {
  const id = nextId++
  let ro: ResizeObserver | null = null
  let mo: MutationObserver | null = null

  const measure = () => {
    const el = opts.el.value
    if (!el || !opts.enabled()) {
      if (members.delete(id)) publish()
      return
    }
    const bottom = opts.top() + el.scrollHeight
    const m = members.get(id)
    if (m?.bottom === bottom && m.stuck === opts.stuck.value) return
    members.set(id, { bottom, stuck: opts.stuck.value })
    if (m?.bottom !== bottom) publish()
  }

  onMounted(() => {
    const el = opts.el.value
    if (el) {
      ro = new ResizeObserver(measure)
      ro.observe(el)
      mo = new MutationObserver(measure)
      mo.observe(el, { childList: true, subtree: true, characterData: true })
    }
    measure()
  })
  watch([opts.enabled, opts.top, opts.stuck], measure)
  onBeforeUnmount(() => {
    ro?.disconnect()
    mo?.disconnect()
    if (members.delete(id)) publish()
  })
}
