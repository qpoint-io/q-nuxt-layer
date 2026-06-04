# Cycle 1: Figma Library Integration

**Created:** 2026-06-04
**Focus:** Unify two Figma files into one bidirectionally-synced design system bridged to the q-nuxt-layer code library (no Code Connect; pro plan)

## Why

The layer ships ~103 Vue components and a rich token set, but the Figma side is split: a fresh **"Qpoint Design System"** file (token-wired, but shallow — page-per-component, no variants) and a mature, published **"app.qpoint.io - 3.0"** team library (rich variant sets, but reflects the old app and isn't aligned to current tokens). Neither alone serves as a faithful, maintainable mirror of the code. Without a defined bridge and sync ritual, design and code will keep drifting independently.

## Objective

A single canonical Figma file (**"Qpoint Design System"**) restructured into Foundations + category pages with variant component sets, bridged to the code library via a repo-owned manifest and a token-JSON interchange. "Done" for this cycle = the architecture is proven on a vertical slice (Button, Toggle, Tag, SecuritySeverity, DataStat, DataSparkChart, HealthDial): tokens round-trip, those components exist in Figma as token-bound variant sets, and the bridge manifest + sync ritual are documented.

## Scope

- `cycles/c1.figma-library-integration/` — plan, research artifacts, reconciliation matrix
- `tokens/` — DTCG token JSON + generator from `tailwind.config.js` (new)
- `figma/` — `component-map.json` bridge manifest + README (new)
- `.claude/skills/figma-sync/` — drift-detect → reconcile ritual (new)
- `CLAUDE.md` — add Figma Integration section
- Figma (canonical): `wzzmExswgFGXNKQyDSqGMF` · (legacy source): `8pllCWHTjstwHaj5ZAZUOo`

## Key Changes

- **Phase 0–1 (done):** Cycle kicked off; `plan.md`, `research/01-library-audit.md`, and `research/02-reconciliation.md` (three-way code ↔ new-file ↔ legacy matrix). Confirmed Code Connect is unavailable on pro → agent/MCP + token-JSON bridge.
- **Phase 2 (done):** Token bridge — `tokens/build.mjs` generates `tokens/tokens.json` (DTCG) from `tailwind.config.js`; `npm run tokens` script; `tokens/README.md` documents the Tokens Studio Figma side. Values verified against config and live Figma variables (no drift in sample).
- **Phase 4 (done, scaffold):** `figma/component-map.json` bridge manifest for the 7-component vertical slice (prop↔variant maps from `defineProps`, legacy node IDs to port from; Figma node IDs pending build). `figma/README.md` documents schema + workflow.
- **Phase 5 (done):** `.claude/skills/figma-sync/SKILL.md` — drift-tolerant sync ritual for both tracks.
- **Phase 3 (done — full vertical slice):** Discovered `use_figma` runs headless via fileKey (no desktop selection needed) — agent builds directly. **All 7 slice components built** as token-bound variant sets, each screenshot-verified, manifest updated with real node IDs:
  - `ux/button` (38:116) — Kind(Filled/Stroke) × State(Default/Hover/Disabled) + 2 Loading
  - `ux/toggle` (39:14) — On × Size(Small/Medium/Large)
  - `ux/tag` (39:25) — Flavor(Grape/Warn) × Close
  - `security/severity` (39:38) — Severity(critical/high/medium/low)
  - `data/stat` (41:26) — Size(Small/Med) × Health(None/Healthy/Unhealthy)
  - `data/sparkline` (41:32) — Fill(Area/Line)
  - `health/dial` (41:53) — Status(cool/warn/warm/hot), **approximate** (180° gauge vs the source's 270° gradient SVG)
  - Method validated end-to-end: read `defineProps` → build variant set bound to Primitives variables → screenshot → record node ID in manifest.
- **Scale-out (done — 32 more components, 39 total):** Created four category pages (`UX`, `Data`, `Health`, `Security`) and built the presentational library onto them, all token-bound and screenshot-verified per page:
  - **UX (15):** BoxTag, Avatar, Link, IconBtn, AddBtn, Close, LabelText, Checkbox, SimpleSelect, Input, CopyBtn, Message, ListItem, ToggleCard, HelpText
  - **Data (10):** PercentBar, KeyVal, TrendDirection, Val, Timeline, MetricValue, MetricTrend, MetricSimple, MetricBase, MetricTinyInline
  - **Health (3):** DialSummary, Scanning, SummaryItem
  - **Security (4):** PolicySkin, PolicyRibbon, DataFlow, PolicyCard
  - Manifest records all 39 with node IDs. Approximations flagged (`synced-approx`): DialSummary/PolicyRibbon/PolicyCard. Deliberately skipped as behavioral/composite: HoverBox, StretchBox, TagInput, DangerDelete, table-list/* internals, ChartUI, YAxis, several atomic metric/* parts. Icons + dev tooling excluded per scope.

## Outcome

_(filled in at completion)_
