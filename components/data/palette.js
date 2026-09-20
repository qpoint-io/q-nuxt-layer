// data/palette.js — the one color file the chart components read
// (DataDonutChart, DataHistoryGraph, DataSegmentBar). Design c92 listing-viz.
//
// Two kinds of color live here:
//
// 1. Semantic token roles (`success`, `warning`, `stroke-strong`, …) resolved
//    live through qp() → `rgb(var(--qp-role))`, so they flip with the theme
//    for free. Use these when a segment *means* something (good/bad,
//    monitored/shadow, presence, posture, outcome).
//
// 2. Literal hex palettes for identity series (which model, which kind of
//    flag), validated per-mode with the dataviz skill's validator:
//
//      node <dataviz skill dir>/scripts/validate_palette.js "<hex,hex,hex>" --mode light
//      node <dataviz skill dir>/scripts/validate_palette.js "<hex,hex,hex>" --mode dark
//      node <dataviz skill dir>/scripts/validate_palette.js "<hex,…>" --ordinal --mode light
//
//    The categorical slots are literal because the reference design's
//    black/blue/grey have no token equivalents (no true blue in
//    tokens/semantic.mjs — `info` is grape — and no neutral gray passes the
//    chroma floor). Both modes pass with a WARN on contrast-vs-surface for
//    the darkest slot; that's legal only with the "relief rule" secondary
//    encoding, which every consumer here provides (legend labels + per-mark
//    hover titles). Three slots is the series cap that validates all-pairs —
//    a 4th identity series folds into "Other" (the series-count ladder).
//
//    The ordinal ramp is one hue (grape) stepped light → dark for ordered
//    scales (freshness, intensity). Validated with --ordinal in both modes:
//    monotone lightness, adjacent ΔL ≥ 0.06, light end ≥ 2:1 on the surface.
import { qp } from '../../composables/useTokenColor'

/** Token roles we recognize as palette colors; anything else in `color` is a raw CSS string. */
export const TOKEN_ROLES = ['success', 'stroke-strong', 'primary', 'info', 'warning', 'error', 'content', 'content-muted', 'stroke']

/** DataDonutChart's default palette assigned by index (cycles). Green first, grey second — see reference. */
export const DONUT_PALETTE = ['success', 'stroke-strong', 'primary', 'info', 'warning', 'error']

/** Categorical identity slots — three validated hues per mode (DataHistoryGraph's palette). */
export const CATEGORICAL_PALETTE = {
  light: ['#53458a', '#2a78d6', '#70a971'],
  dark:  ['#60549a', '#3987e5', '#539156'],
}

/** Ordered-scale ramp — grape, light → dark by index. Four steps per mode. */
export const ORDINAL_RAMP = {
  light: ['#BBA5FF', '#895AE8', '#5E29CC', '#32146E'], // grape-300 · 500 · 700 · 850
  dark:  ['#E5DAFF', '#BBA5FF', '#895AE8', '#5E29CC'], // grape-150 · 300 · 500 · 700
}

/** Fill for the "Other" fold and any neutral remainder. */
export const FOLD_COLOR = 'stroke-strong'

/** A token role → live CSS var; anything else passes through as raw CSS. */
export function resolveColor(color) {
  return TOKEN_ROLES.includes(color) ? qp(color) : color
}

/** DataDonutChart's rule: explicit color wins, else the donut palette cycles by index. */
export function resolveDonutColor(color, index) {
  return resolveColor(color ?? DONUT_PALETTE[index % DONUT_PALETTE.length])
}

/** Identity series: explicit color wins, else the categorical slots cycle by index (per mode). */
export function resolveCategoricalColor(color, index, mode) {
  if (color) return color
  const set = CATEGORICAL_PALETTE[mode] ?? CATEGORICAL_PALETTE.light
  return set[index % set.length]
}

/** Ordinal step for item `index` of `count` — spreads the ramp evenly so 2 items read light/dark, 4 use every step. */
export function ordinalColor(index, count, mode) {
  const ramp = ORDINAL_RAMP[mode] ?? ORDINAL_RAMP.light
  if (count <= 1) return ramp[ramp.length - 1]
  const step = Math.round((index * (ramp.length - 1)) / (count - 1))
  return ramp[Math.min(ramp.length - 1, Math.max(0, step))]
}
