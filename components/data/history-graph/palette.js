// history-graph/palette.js — DataHistoryGraph's color file, now a view onto
// the shared components/data/palette.js (design c92 listing-viz lifted the
// categorical slots there so the donut, the history graph and the segment
// bar read one file). Re-exported under the original names so nothing that
// imports from here changes.
import { CATEGORICAL_PALETTE, resolveCategoricalColor } from '../palette'

export const HISTORY_GRAPH_PALETTE = CATEGORICAL_PALETTE

/** Resolve a series' color: explicit override wins, else the palette cycles by index. */
export const resolveHistoryGraphColor = resolveCategoricalColor
