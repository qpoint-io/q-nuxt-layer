// history-graph/palette.js — the editable color file for DataHistoryGraph.
//
// Literal hex values, not semantic-token roles: the reference design's
// black/blue/grey have no direct token equivalents (no true blue in
// tokens/semantic.mjs — `info` is grape/purple — and no neutral gray passes
// the categorical chroma floor below). Values are validated per-mode with
// the dataviz skill's validator (checks: OKLCH lightness band, chroma floor,
// CVD-safe adjacent separation, contrast vs surface):
//
//   node <dataviz skill dir>/scripts/validate_palette.js "<hex,hex,hex>" --mode light
//   node <dataviz skill dir>/scripts/validate_palette.js "<hex,hex,hex>" --mode dark
//
// A pure neutral gray always fails the chroma floor by construction (that
// check exists to keep a "reads as gray" color out of categorical slots, so
// it isn't mistaken for a disabled/muted state) — slot 3 is the closest
// validated hue to a quiet, muted third color rather than literal gray.
// Both modes pass with a WARN on contrast-vs-surface for the darkest slot;
// that's legal only with the "relief rule" secondary encoding, which this
// component always provides (legend labels + per-block hover tooltips).
export const HISTORY_GRAPH_PALETTE = {
  light: ['#53458a', '#2a78d6', '#70a971'],
  dark:  ['#60549a', '#3987e5', '#539156'],
}

/** Resolve a series' color: explicit override wins, else the palette cycles by index. */
export function resolveHistoryGraphColor(color, index, mode) {
  if (color) return color
  const set = HISTORY_GRAPH_PALETTE[mode] ?? HISTORY_GRAPH_PALETTE.light
  return set[index % set.length]
}
