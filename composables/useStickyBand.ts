/**
 * useStickyBand — the page's pinned header band (design c104, grown by c106).
 *
 * One band per page. UxStickyBand (mounted once by the layout) draws its
 * backing and switches it on; the members pin themselves and report to it:
 *
 *   the page title   UxPageTitle   — joins when the band is mounted with `title`
 *   the sub nav      NavJumpPills  — joins whenever a band is mounted (opt out: `:sticky="false"`)
 *   the global filter  Filter      — joins with `band`
 *
 * Two layouts, chosen by the band:
 *
 *   c104 (default)   the filter and the sub nav pin side by side at the pin
 *                    line; the band is as tall as the taller of them.
 *   c106 (`title`)   two columns. Left: the page title (row 1) and, under it,
 *                    the sub nav (row 2, pinned at a fixed line under the
 *                    title's row). Right: the filter. The band is as tall as
 *                    the taller column, so a tall filter never opens space
 *                    between title and pills.
 *
 * c106 adds a scroll-direction mode, driven by the title pinning:
 *   rest   the title hasn't pinned: nothing restyles (c104 behaviour)
 *   down   pinned, scrolling down: title 15px with its hairline, filter values
 *          only, pills compact (outline, no fill)
 *   up     pinned, scrolling up. Tracked, but drawn exactly as `down` while
 *          STICKY_BAND.upRestyles is false (Mark, 2026-10-02: "leave the
 *          plumbing in, but make no changes on scrolling up"). On, it is an
 *          in-between set: title 20px, filter with its labels.
 * Members style by `look` (the mode as drawn), never by `mode`.
 *
 * The rule that keeps scrolling smooth: nothing in the band changes the page's
 * flow. The backing is out of flow; the filter is a zero-height sticky box;
 * the title and the sub nav are sticky boxes that hold their rest height and
 * restyle inside it. A mode flip never changes the document's height, so it
 * can't feed back into the scroll direction that caused it.
 *
 * The sub nav's row joins the band only once it docks: until then the band
 * ends under the title, so the pills rise into open space; on docking the band
 * extends under them quickly (motion.dock on an ease-out) and its edge and
 * shadow sit below them.
 *
 * Published on <html> while a band is mounted:
 *   --q-sticky-top        the whole band — table headers pin here
 *   --q-sticky-top-down   the band compact with the sub nav docked — where jumps land
 *   --q-sticky-row1       where the sub nav pins (c106 only; c104 pins at stickyTop)
 *   --q-sticky-filter-w   the filter bar's width — the pinned title stops short of it
 *   --q-band-dur / --q-band-ease / --q-band-fade   the motion of the current change
 *
 * Module-level state: one band per page. Members register on mount only, so
 * server renders never touch it.
 */
import type { Ref } from 'vue'

export type StickyBandMode = 'rest' | 'down' | 'up'

/** Geometry (px) and motion. Every row has a fixed height per look, so the band is known before it is drawn. */
export const STICKY_BAND = {
  /** The pin line: members pin this far from the viewport top (top-2); rows are padded by the same. */
  pinTop: 8,
  /** Gap between the band and a jump's landing heading (and the scroll-spy line). */
  jumpGap: 16,
  /** Whether scrolling up restyles the band (the in-between set). Off: `up` draws as `down`. */
  upRestyles: false,
  /** The pinned title's text size per look. */
  titleSize: { down: 15, up: 20 },
  /** The pinned title's row (a 20px title fits). */
  titleRow: 32,
  /** The sub nav's row per look; its sticky box always keeps the rest height. */
  navRow: { rest: 42, down: 30, up: 30 },
  /** Space between the docked sub nav and the band's bottom edge. */
  navBottomPad: 12,
  /** The filter's label row, which the compact look hides (estimate until measured). */
  filterLabelRow: 24,
  /** Travel in one direction (px) before the mode flips — a jittery wheel can't flicker it. */
  hysteresis: 24,
  /** How long a jump's smooth scroll may run before direction tracking resumes (ms). */
  jumpHold: 1200,
  /** Motion (Mark, 2026-10-02): quint-in-out; 1s to compact, 2s to grow; a quicker fade; a fast dock. */
  motion: {
    ease: 'cubic-bezier(0.83, 0, 0.17, 1)', // easeInOutQuint
    compact: 1000,
    grow: 2000,
    fade: 400,
    dock: 200,
    dockEase: 'cubic-bezier(0.22, 1, 0.36, 1)', // easeOutQuint: the band catches the pills at once
    quick: 200, // pills' selection ring, paddings
  },
} as const

const B = STICKY_BAND
const ROW2_TOP = B.pinTop + B.titleRow + B.pinTop

const state = reactive({
  /** A UxStickyBand is mounted (publishing). */
  attached: false,
  /** The band runs the c106 layout (UxStickyBand `title`). */
  titleBand: false,
  /** A title has registered (the first one drives the mode). */
  hasTitle: false,
  mode: 'rest' as StickyBandMode,
  /** The page has scrolled at all — at scroll 0 the backing never shows. */
  scrolled: false,
  titlePinned: false,
  hasFilter: false,
  filterPinned: false,
  /** Filter heights while pinned: with labels / values only (0 until measured). */
  filterFullH: 0,
  filterCompactH: 0,
  hasNav: false,
  navPinned: false,
  /** c104 layout: where the sub nav pins (its stickyTop). */
  navTop: B.pinTop,
})

const lookOf = (mode: StickyBandMode): StickyBandMode => (mode === 'up' && !B.upRestyles ? 'down' : mode)

// ── Heights ──────────────────────────────────────────────────────────────────

const filterHeight = (mode: StickyBandMode) => {
  if (!state.hasFilter) return 0
  if (lookOf(mode) !== 'down') return state.filterFullH
  return state.filterCompactH || Math.max(0, state.filterFullH - B.filterLabelRow)
}

/**
 * The whole band in a mode: the taller of its columns, padded below.
 * c106: right = the filter; left = the pinned title's row, plus the docked
 * sub nav's row. At rest (title not pinned) only the filter counts.
 * c104: the filter and the docked sub nav side by side.
 */
const bandHeight = (mode: StickyBandMode, titlePinned = state.titlePinned, navDocked = state.navPinned) => {
  const right = state.hasFilter ? B.pinTop + filterHeight(mode) + B.pinTop : 0
  if (!state.titleBand || !state.hasTitle) {
    const nav = state.hasNav && navDocked ? state.navTop + B.navRow.rest + B.pinTop : 0
    return Math.max(right, nav)
  }
  const pinned = titlePinned && mode !== 'rest'
  if (!pinned) return right
  const docked = state.hasNav && navDocked
  const left = docked
    ? ROW2_TOP + B.navRow[lookOf(mode) === 'up' ? 'up' : 'down'] + B.navBottomPad
    : B.pinTop + B.titleRow + B.pinTop
  return Math.max(right, left)
}

const top = computed(() => bandHeight(state.mode))
/** Jumps land under the band as it will be when they arrive: compact, sub nav docked. */
const topDown = computed(() => bandHeight(state.titleBand && state.hasTitle ? 'down' : state.mode, true, true))

// ── Publishing ───────────────────────────────────────────────────────────────

const VARS = ['--q-sticky-top', '--q-sticky-top-down', '--q-sticky-row1', '--q-band-dur', '--q-band-ease', '--q-band-fade'] as const
let lastNavPinned = false

const publish = () => {
  const s = document.documentElement.style
  s.setProperty('--q-sticky-top', `${top.value}px`)
  s.setProperty('--q-sticky-top-down', `${topDown.value}px`)
  if (state.titleBand && state.hasTitle) s.setProperty('--q-sticky-row1', `${ROW2_TOP}px`)
  else s.removeProperty('--q-sticky-row1')
  // The duration follows the change in progress: the sub nav docking or
  // leaving is quick (the band has to catch it); growing into `up` is slow.
  const docking = state.navPinned !== lastNavPinned
  lastNavPinned = state.navPinned
  const dur = docking ? B.motion.dock : lookOf(state.mode) === 'up' ? B.motion.grow : B.motion.compact
  s.setProperty('--q-band-dur', `${dur}ms`)
  s.setProperty('--q-band-ease', docking ? B.motion.dockEase : B.motion.ease)
  s.setProperty('--q-band-fade', `${B.motion.fade}ms`)
}

// ── Mode ─────────────────────────────────────────────────────────────────────
// `anchorY` is the furthest point reached in the current direction: in `down`
// the lowest scroll position so far, in `up` the highest. Travelling back past
// it by `hysteresis` flips the mode and re-anchors there.

let anchorY = 0
let holdUntil = 0
let onFlip: ((e: { from: StickyBandMode; to: StickyBandMode; y: number }) => void) | null = null

const setMode = (to: StickyBandMode) => {
  if (state.mode === to) return
  const from = state.mode
  state.mode = to
  onFlip?.({ from, to, y: window.scrollY })
}

const reportTitle = (pinned: boolean) => {
  const y = window.scrollY
  state.scrolled = y > 0
  if (pinned !== state.titlePinned) {
    state.titlePinned = pinned
    anchorY = y
    return setMode(pinned ? 'down' : 'rest') // pinning only happens on the way down
  }
  if (!pinned) return setMode('rest')
  if (performance.now() < holdUntil) { anchorY = y; return } // a jump's smooth scroll: follow it
  if (state.mode === 'down') {
    if (y > anchorY) anchorY = y
    else if (anchorY - y > B.hysteresis) { anchorY = y; setMode('up') }
  } else {
    if (y < anchorY) anchorY = y
    else if (y - anchorY > B.hysteresis) { anchorY = y; setMode('down') }
  }
}

/**
 * Whether the backing shows. In a titled band (c106) it waits for the title to
 * pin, so it appears once, at the compact height — before that the pinned
 * filter carries its own fill (Mark, 2026-10-02: the backing slid down from
 * the full filter's height; it should just fade in). In a c104 band any pinned
 * member shows it.
 */
const showBacking = computed(() => {
  if (!state.scrolled) return false
  if (state.titleBand && state.hasTitle) return state.titlePinned || state.navPinned
  return state.titlePinned || state.filterPinned || state.navPinned
})

// ── Public API ───────────────────────────────────────────────────────────────

export function useStickyBand() {
  return {
    state: readonly(state),
    /** The scroll-direction mode (what the band tracks). */
    mode: computed(() => state.mode),
    /** The mode as drawn — style by this. */
    look: computed(() => lookOf(state.mode)),
    /** Current band height and the compact height jumps land under (px). */
    top,
    topDown,
    /** The c106 layout is on and a title is in it. */
    titleBand: computed(() => state.titleBand && state.hasTitle),
    /** The backing shows: something is pinned and the page has moved. */
    showBacking,
    /** c104 name for showBacking. */
    stuck: showBacking,

    /** UxStickyBand: publish until the returned teardown runs. */
    attach: (opts: { title: boolean }) => {
      state.attached = true
      state.titleBand = opts.title
      const onScroll = () => { state.scrolled = window.scrollY > 0 }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      const stop = watchEffect(publish)
      return () => {
        stop()
        window.removeEventListener('scroll', onScroll)
        for (const v of VARS) document.documentElement.style.removeProperty(v)
        document.documentElement.style.removeProperty('--q-sticky-filter-w')
        Object.assign(state, { attached: false, titleBand: false, mode: 'rest', scrolled: false, titlePinned: false, filterPinned: false, navPinned: false })
        lastNavPinned = false
        onFlip = null
      }
    },

    /**
     * UxPageTitle: claim the band's title slot. Returns null when another
     * title already holds it (only one title drives a page's band).
     */
    claimTitle: () => {
      if (state.hasTitle) return null
      state.hasTitle = true
      return {
        report: reportTitle,
        release: () => { state.hasTitle = false; state.titlePinned = false; setMode('rest') },
      }
    },

    /** Filter (`band`). */
    registerFilter: () => {
      state.hasFilter = true
      return {
        setPinned: (on: boolean) => { state.filterPinned = on },
        setHeights: (h: { full?: number; compact?: number }) => {
          if (h.full != null) state.filterFullH = h.full
          if (h.compact != null) state.filterCompactH = h.compact
        },
        setWidth: (px: number) => document.documentElement.style.setProperty('--q-sticky-filter-w', `${px}px`),
        release: () => {
          Object.assign(state, { hasFilter: false, filterPinned: false })
          document.documentElement.style.removeProperty('--q-sticky-filter-w')
        },
      }
    },

    /** NavJumpPills (`sticky`). */
    registerNav: (opts: { top: () => number }) => {
      state.hasNav = true
      const syncTop = watchEffect(() => { state.navTop = opts.top() })
      return {
        setPinned: (on: boolean) => { state.navPinned = on },
        /** A jump is about to scroll the page: land compact, ignore the travel until it ends. */
        holdForJump: () => {
          holdUntil = performance.now() + B.jumpHold
          if (state.titlePinned) setMode('down')
        },
        release: () => { syncTop(); Object.assign(state, { hasNav: false, navPinned: false }) },
      }
    },

    /** Instrumentation: called on every mode flip (a mock's flip log). */
    onFlip: (fn: typeof onFlip) => { onFlip = fn },
  }
}

/**
 * A band member's scroll hook: runs `onFrame` with the member's element once
 * per animation frame while the page scrolls (and once on mount), where the
 * member reads its position and reports pinned-or-not.
 */
export function useStickyBandScroll(el: Ref<HTMLElement | null>, onFrame: (el: HTMLElement) => void) {
  let raf = 0
  const frame = () => { raf = 0; if (el.value) onFrame(el.value) }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame) }
  onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); frame() })
  onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) })
  return { frame }
}
