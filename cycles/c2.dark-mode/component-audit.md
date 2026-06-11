# Dark Mode Component Audit — Cycle c2 Follow-up

> Audit of all 137 component files (+ shared.css) against the c2 semantic-token system.
> Date: 2026-06-11 · Branch: `dark-mode` · Conversion rules: `cycles/c2.dark-mode/plan.md` Phase 6.

## ✅ CONVERSION COMPLETE (2026-06-11)

All 86 components below were converted in waves W1–W7 (one commit each on
`dark-mode`; see `git log --oneline --grep "dark mode W"`). Implementation
notes that supersede details below:

- **New helper `composables/useTokenColor.ts`** — `qp(role, alpha?)` static
  var-strings for DOM/SVG/inline styles; `useTokenColor(role, alpha?)`
  reactive resolved colors for canvas/Chart.js (canvas can't resolve `var()`);
  SSR falls back to light values from `tokens/semantic.mjs` (now shipped via
  package.json `files`). SVG **presentation attributes** can't resolve
  `var()` either — bind via `:style`, not `:fill` (see PolicyRibbon).
- **Light-preserving deviations:** `border-black`/`bg-black` ink →
  `border-content`/`bg-content` (not `stroke-strong`) in sentence/*,
  SmallHeader, YAxis, Timeline, ViolationsTable, Avatar, BoxTag — keeps
  near-black in light, flips near-white in dark.
- **Severity ladders:** Severity.vue and SummaryItem.vue map their 4-tier
  scales onto `signal-error / signal-warning / signal-warning/60 /
  signal-success|stroke-strong` as full literal class strings.
- **dev/Control\* family:** tokenized as `rgb(var(--qp-<role>, <original
  channels>))` — qflow/qmap (no tokens.css) keep the exact dark-navy look
  via fallbacks; token consumers follow the theme. Contract documented in
  `vue/dev-controls/index.js`.
- **Sanctioned `dark:` inventory** (the only allowed sites):
  `_shadow-box` (shared.css), `ux/HoverBox` lifted card, `ExpandRow` ×2
  flash tints, and the `.dark ._qp-select-caret` data-URI swap in
  SimpleSelect.
- **Intentional keeps:** Button filled kind (brand grape), Modal backdrop
  scrim (`bg-black/25`), Dial gauge gradients + PolicyRibbon hot/warm/cool
  two-tone pairs + PolicySkin/Ribbon white-list `#84CAFF` (beyond token
  vocabulary), prose/ brand-grape accents, dev/Comment code-blue,
  ControlColor's `#ffffff` data default.
- **Post-audit arrivals — converted (2026-06-11, after the user finished
  them):** `ux/BackLink`, `ux/CardLink`, `ux/Code`, `ux/CodeBlock`,
  `ux/FilterGroup`, `ux/Pill`, `prose/Callout`, `dev/PatternCard`.
  Already token-native as authored (no changes needed): `ux/Select`,
  `ux/Table`, `data/metric/_/Card`. Additional intentional keeps from this
  set: CodeBlock's `theme=dark` chrome (grey-800/900 code panel is
  deliberately dark on both page themes, its raw grey label text included),
  Callout's grape/leaf brand accents.

## Scoreboard

| Status | Count | Meaning |
|---|---|---|
| ✅ Converted | 8 | Uses semantic tokens (`surface`/`content`/`stroke`/`primary`/`signal-*`) |
| ⚪ No color | 43 | No color usage (incl. all 28 icons — `currentColor` throughout) |
| 🔴 Needs conversion | 86 | Raw palette classes, hardcoded hex, or pre-token `dark:` styles |

**Severity legend** — HIGH: visibly broken in dark (light surfaces, black ink on dark, invisible chart strokes). MEDIUM: degraded contrast (borders, muted text, hover/focus states). LOW: reads OK in both modes but should tokenize for consistency.

---

## ✅ Converted (verify-passed)

`ux/Button`, `ux/Message`, `ux/Modal`, `ux/table-list/index`, `ux/ThemeToggle`, `nav/Vertical`, `nav/VerticalItem`, `dev/Canvas` (one LOW note: scoped `box-shadow: rgba(0,0,0,0.02)` — barely visible either mode, fine).

⚠️ **`shared.css` leftovers** (was in the c2 exemplar set but two raw values remain):
- `.btn-danger:hover` → `hover:bg-black` — black hover on a dark page is a real bug → `hover:bg-content` or `hover:bg-signal-error/80`
- `.btn-cancel:hover` → `hover:border-grape-400` → `hover:border-primary`
- `.btn-danger`/`.btn-danger-outline` use flat `warn` — see [Flat utility tokens](#flat-utility-tokens) below

---

## 🔴 ux/ — 20 components (the highest-traffic gap)

| Component | Sev | Changes |
|---|---|---|
| `Input.vue` | HIGH | **Carries pre-token `dark:` classes from the abandoned per-component approach** — `dark:text-grey-300`, `dark:border-grey-600`, `dark:hover:border-grape-400` (lines 3, 9). Remove them; convert `text-grey-400`→`text-content-muted`, `text-grape-500`→`text-primary`, `hover:border-grape-500`→`hover:border-primary`, `border-b-red`/`text-red`→`signal-error` |
| `Toggle.vue` | HIGH | Scoped `@apply bg-gray-200`→`bg-stroke`, `peer-checked:bg-grape`→`peer-checked:bg-primary`, thumb `bg-white border-grey-300`→`bg-surface border-stroke` |
| `SimpleSelect.vue` | HIGH | Dropdown-arrow SVG in a `background-image` data-URI hardcodes `stroke='%23666'` — invisible on dark. Either two data-URIs swapped under `.dark`, or replace with an inline `IconDownArrow` using `currentColor` |
| `CopyBtn.vue` | HIGH | `text-black`→`text-content`, `text-grape`→`text-primary`; scoped `.copied`/`.checked` states `@apply text-grape-400`→`text-primary` |
| `BoxTag.vue` | HIGH | `bg-black text-white` / `border-black` — inverted chip. → `bg-content text-surface` / `border-content` (token inversion keeps the high-contrast look in both modes) |
| `TagInput.vue` | MED | `bg-white`→`bg-surface`, `border-grey-300`→`border-stroke-strong` |
| `ToggleCard.vue` | MED | `border-grey-100`→`border-stroke`, `peer-checked:border-grape-500`→`peer-checked:border-primary`, `group-hover:border-grape-300`→`group-hover:border-primary/50` |
| `Tag.vue` | MED | `text-white`→`text-on-primary`, `group-hover:text-grape-600`→`group-hover:text-primary`; `bg-grape-200` chip fill — decide: brand-keep, or `bg-primary/25`. `bg-warn`/`text-warn` work (flat token, see below) but should become `signal-error` or `signal-warning` per intent |
| `HoverBox.vue` | MED | `text-grape`→`text-primary`, `group-hover:text-black`→`group-hover:text-content`, `text-grey-300`→`text-content-subtle`; popover panel: add `border border-stroke` (shadow-only elevation doesn't read on dark) |
| `ListItem.vue` | MED | `text-black`→`text-content`, `text-grey-500`→`text-content-subtle` (×2), `text-grape`→`text-primary` |
| `Close.vue` | MED | `text-grey-400`→`text-content-muted`, `group-hover:text-black`→`group-hover:text-content` |
| `Link.vue` | MED | `text-grape-500`→`text-primary`, `hover:text-black`→`hover:text-content` |
| `IconBtn.vue` | MED | `text-grape`→`text-primary`, `hover:text-black`→`hover:text-content` |
| `AddBtn.vue` | MED | `text-grape`→`text-primary`, `hover:text-black`→`hover:text-content` |
| `Avatar.vue` | MED | `border-black`→`border-content`, `hover:border-grape`→`hover:border-primary`, `text-grape`→`text-primary` |
| `HelpText.vue` | MED | `text-grey-600`→`text-content-muted`; scoped `text-grape`→`text-primary` |
| `PercentBar.vue` | MED | `bg-grape-100` track fill → `bg-primary/15` (raw light tint goes muddy on dark) |
| `LabelText.vue` | LOW | `text-grey-500`→`text-content-subtle` |
| `Checkbox.vue` | LOW | `text-grey-400`→`text-content-muted` |
| `DangerDelete.vue` | LOW | Clean itself; inherits the `shared.css` `btn-danger`/`btn-cancel` fixes above |

### ux/table-list/ — 5 of 8 subcomponents

| Component | Sev | Changes |
|---|---|---|
| `Totals.vue` | HIGH | `bg-white`→`bg-surface` (index.vue was converted; this sibling was missed) |
| `ExpandRow.vue` | HIGH | `bg-white/50`→`bg-surface/50`, `hover:bg-white`→`hover:bg-surface`, `text-grey-300`→`text-content-subtle`, `hover:text-black`→`hover:text-content`; accent bars `bg-grape`→`bg-primary`, `bg-grape-50`→`bg-primary/10`, `border-grape-300`→`border-primary/40`; **hardcoded hexes `bg-[#f2f3d5]` and scoped `@apply bg-[#fffef1]`** (highlight-flash tint) — needs a design decision: either a `dark:` exception pair or drop the tint |
| `Search.vue` | MED | `bg-grey-100`→`bg-surface-sunken`, `text-grey-400`→`text-content-muted` |
| `Sorter.vue` | MED | `text-grape`→`text-primary` |
| `ToggleRow.vue` | LOW | `hover:bg-grape-300/10`→`hover:bg-primary/10` |

(`Header.vue`, `ColumnHeader.vue` — no color usage.)

---

## 🔴 data/ — 16 components (chart ink is the problem)

| Component | Sev | Changes |
|---|---|---|
| `ChartUI.vue` | HIGH | Chart.js config is all JS hex: tick `color: '#666'` (×2) → read from CSS var; line/bar `rgb(153, 102, 255)` + `rgba(…, 0.2)` fills → `--qp-primary`-derived; `pointBorderColor: '#fff'` → surface. Needs the [JS-hex pattern](#js-side-colors) — and colors must re-resolve on theme toggle (re-render or reactive computed) |
| `Stat.vue` | HIGH | `text-black`→`text-content`, `text-grey-400`→`text-content-muted`, `text-gray-300` spinner→`text-content-subtle`, `text-[#F87F7D]`→`text-signal-error`, `text-blue` (flat token)→`text-signal-info` |
| `Val.vue` | HIGH | Same pattern as Stat: `text-black`→`text-content` (×2), `text-[#F87F7D]`→`text-signal-error` (×2), `text-grey-400`→`text-content-muted` (×2), `text-gray-300`→`text-content-subtle`; selected state `bg-grape-500 text-white`→`bg-primary text-on-primary`, `bg-grape-500` dot→`bg-primary`, `border-r-grape-500`→`border-r-primary`, `text-grape`→`text-primary` |
| `YAxis.vue` | HIGH | `border-b-black/20` gridlines→`border-b-stroke`, `border-l-black border-r-black` axes→`border-stroke-strong`, `text-grey-400`→`text-content-muted` |
| `SparkChart.vue` / `SparkChartOld.vue` | HIGH | Prop defaults `fillColor`/`strokeColor: 'black'` — invisible on dark. → default `'currentColor'` (then parents control via text classes) or `rgb(var(--qp-content))` |
| `metric/_/Base.vue`, `_/Compact.vue`, `_/TinyInline.vue` | MED | `strokeColor="#BBA5FF"` hardcoded sparkline ink → `rgb(var(--qp-primary))` (channel var resolves per-theme); Base also `hover:text-grape`→`hover:text-primary`; TinyInline `text-gray-500`→`text-content-subtle` |
| `Timeline.vue` | MED | `border-l-black/20` dividers→`border-l-stroke` |
| `metric/Value.vue` | MED | `text-gray-300` spinner→`text-content-subtle`; `@apply text-warn`→`text-signal-error` |
| `metric/Trend.vue` | MED | `@apply text-warn`→`text-signal-error`; `text-grey-500`→`text-content-subtle` |
| `metric/_/Simple.vue` | MED | `text-grey-500`→`text-content-subtle`; `@apply text-warn`→`text-signal-error` |
| `metric/Background.vue` | MED | `@apply bg-warn`→`bg-signal-error` (or `signal-warning` per intent) |
| `metric/PercentBar.vue` | LOW | `bg-grape-200` fill→`bg-primary/25` (or keep if intentional brand) |
| `metric/Spark.vue` | LOW | Prop-driven (no own colors) — fixed by correcting callers' `strokeColor` above |

(`KeyVal`, `PercentBar`, `TrendDirection`, `metric/Date`, `metric/Label`, `metric/_/InlineTrend` — no color usage.)

---

## 🔴 security/ — all 7 components

| Component | Sev | Changes |
|---|---|---|
| `PolicyCard.vue` | HIGH | `text-black`→`text-content` (×7), `text-grey-400`→`text-content-muted`, `border-grey-200`→`border-stroke`, `border-grey-300`→`border-stroke-strong`, `bg-grey-50`→`bg-surface`; sparkline `strokeColor="#BBA5FF"`→`rgb(var(--qp-primary))`, `strokeColor="rgba(0,0,0,0.4)"`→`rgb(var(--qp-content) / 0.4)` |
| `PolicyHeader.vue` | HIGH | `text-black`→`text-content` (×2), `text-grey-400`→`text-content-muted`, `border-grey-200`→`border-stroke`, `border-grey-300`→`border-stroke-strong`; stats card `bg-white shadow-md`→`bg-surface shadow-md border border-stroke` |
| `PolicySkin.vue` | HIGH | `bg-white`→`bg-surface`; add `border border-stroke` (shadow-only elevation); JS state palette (hot/warm/cool/default hexes) → CSS-var strings ([pattern](#js-side-colors)) |
| `ViolationsTable.vue` | HIGH | `bg-black` divider→`bg-stroke-strong`, `bg-black` dot→`bg-content`, `bg-green-100 text-green-700`→`bg-signal-success/15 text-signal-success`, `text-red-500`→`text-signal-error`, `text-grey-500`→`text-content-muted` |
| `Severity.vue` | HIGH | Tailwind-default palette badges: `bg-red-500`/`text-red-700`→`signal-error`, `bg-orange-500`/`bg-yellow-500` + text→`signal-warning`, `bg-gray-400`/`text-gray-600`→`bg-stroke-strong`/`text-content-muted` |
| `DataFlow.vue` | MED | JS palette: `dot/line: '#1a1a1a'`→`rgb(var(--qp-content))`; light tag fills `#fef2f2`/`#f5f3ff`/`#f5f5f5`→ signal/primary at low alpha + `surface-sunken`; PII line `#8b5cf6`→`rgb(var(--qp-primary))` |
| `PolicyRibbon.vue` | MED | JS hex badge/tail state colors → CSS-var strings; `check: '#ffffff'`→`rgb(var(--qp-on-primary))` |

## 🔴 health/ — all 4 components

| Component | Sev | Changes |
|---|---|---|
| `Dial.vue` | HIGH | Needle `stroke: #000`→`rgb(var(--qp-content))`; scoped `@apply stroke-grey-200`→`stroke-stroke`, `stroke-[#ff0000]`→`stroke-signal-error`, `stroke-[#ffc2c2]`→`stroke-signal-error/30`, `stroke-[#5bd15e]`→`stroke-signal-success`, `stroke-[#ffc368]`→`stroke-signal-warning`. SVG `<linearGradient>` stops (hot/warm/warn/cool ranges) are hardcoded hex — gradient `stop-color` can be set from CSS so vars work, but the multi-stop ranges (e.g. `#06b83b`→`#004f14`) exceed the 13-token vocabulary → **design decision: keep gauge gradients fixed (they're signal-coded, arguably theme-independent) or add gradient-stop vars** |
| `SummaryItem.vue` | HIGH | `bg-white`→`bg-surface`, `bg-grey-200`→`bg-surface-sunken`, `text-gray-900`→`text-content`, `border-white`→`border-surface`; JS severity map `bg-[#FE0800]`/`bg-[#ffc368]`/`bg-[#f9db68]`/`bg-[#8adf73]` → `bg-signal-error`/`-warning`/`-warning`/`-success` |
| `DialSummary.vue` | HIGH | `bg-white`→`bg-surface`; add `border border-stroke` to the circular card |
| `Scanning.vue` | MED | `bg-grey-100`→`bg-surface-sunken`, `bg-white`→`bg-surface`, `text-grape-500`→`text-primary` |

## 🔴 icon-nav/ — 1 component

| Component | Sev | Changes |
|---|---|---|
| `Item.vue` | MED | `text-black`→`text-content`, `hover:text-grape-700`→`hover:text-primary`; scoped `@apply text-grape-500`→`text-primary`; active underline `border-b-grape-200`→`border-b-primary/40` |

---

## 🔴 form/ + sentence/ + alert/ + typography/ — 9 components

| Component | Sev | Changes |
|---|---|---|
| `sentence/Number.vue`, `sentence/Text.vue`, `sentence/Select.vue` | HIGH | Each: `bg-white`→`bg-surface`, `border-black`→`border-stroke-strong` (or `border-content` if the hard-black outline is the design) |
| `alert/Config.vue` | HIGH | `bg-white`→`bg-surface` + add `border border-stroke`; `text-black`/`hover:text-black`→`content`; `text-grape`→`text-primary`; `border-grape-300/400` accents → `border-primary/…` (or keep as brand state) |
| `form/SaveBar.vue` | HIGH | Floating bar `bg-grey-150/90`→`bg-surface/90` + `border border-stroke`; `border-grape-100`→`border-primary/20` or keep as brand |
| `form/SmallHeader.vue` | MED | `border-b-black`→`border-b-stroke-strong` |
| `form/BigHeader.vue` | MED | `border-b-grey-200`→`border-b-stroke` |
| `sentence/Row.vue` | LOW | `text-grape`→`text-primary` |
| `typography/Label.vue` | LOW | `text-grey-400`→`text-content-muted` |

(`form/Wrapper.vue` — no color.)

## 🔴 prose/ — 11 of 12 (marketing/blog; one shared pattern)

Every prose component repeats the same two classes: `text-grey-900`→`text-content`, `text-grey-600`→`text-content-muted`. Applies to: `Hero`, `Point`, `Check`, `BigPoint`, `PointSimple`, `Quote`, `SectionHeadline`, `Step`, `FAQ`, plus:

- `BlogCard.vue` (HIGH) — also `text-black`→`text-content` (×2), `border-b-grey-200`→`border-stroke`
- `BlogAuthor.vue` (LOW) — `text-grey-400`→`text-content-subtle`
- `SectionHeadline.vue` — also `border-b-grey-300`→`border-stroke-strong`
- **Keep as brand (intentional):** `border-t-grape` accents (`BigPoint`, `FAQ`), `text-grape-300` quote marks (`Quote`), grape eyebrow/links (`SectionHeadline`, `Point`, `Check`) — per the convention, marketing brand chrome stays raw grape. `PointSimple`'s dynamic `border-t-${color}` should constrain its accepted values.

Caveat: prose/ is consumed by www.qpoint.io (SSR, light-only today). If the site never ships dark mode, this whole group can be deprioritized to last.

(`StepWrapper.vue` — no color.)

---

## 🔴 dev/ — 13 of 16 (a different problem: always-dark hex theme)

The `Control*` family (`Controls`, `ControlToggle`, `ControlSelect`, `ControlText`, `ControlColor`, `ControlSlider`, `ControlSection`, `ControlExport`, `ExpressionControls`) is styled with a hardcoded dark-navy hex palette (`#1a1a2e`, `#2a2a4e`, `#16162a`, `#3949ab`, `#60a5fa`, `#aaa`/`#888`/`#555`…) in scoped CSS. These panels render dark **regardless of theme** — they predate the token system and never matched light mode either.

**Decision needed:** (a) keep them as intentionally-dark dev chrome (zero work, consistent with code-editor aesthetics), or (b) tokenize so they follow the theme. If (b), it's a mechanical sweep: `#1a1a2e`→`bg-surface`, `#2a2a4e`→`border-stroke`, `#aaa`→`content-muted`, `#3949ab`/`#60a5fa`→`primary`, `#2e7d32`/`#4caf50` (ControlExport)→`signal-success`. Note these ship to qflow/qmap via the `vue/` barrel with a no-Tailwind constraint — scoped CSS must use raw `rgb(var(--qp-*))`, not `@apply`.

Independent of that decision:

| Component | Sev | Changes |
|---|---|---|
| `meta/PropsMachine.vue` | HIGH | **Hardcodes `class="dark …"` on its root** — under the new system this activates dark token values for every token-using child inside it *even in light mode*, and its own `dark:text-grape-200` becomes always-on. Remove the root `.dark`, convert `bg-black bg-opacity-30`, scoped `bg-black text-grape-200`, `bg-grape-200(/20)`, `text-white`, `bg-white` → tokens (`surface`/`content`/`primary`/`on-primary`) |
| `H.vue` | MED | `text-[#9E9E9E]`→`text-content-muted` |
| `Label.vue` | LOW | `text-grey-400`→`text-content-muted` |
| `Comment.vue` | LOW | `text-[#4D94D0]` code-comment blue — not in token vocabulary; keep, or add a token if dev-docs pages go dark |

(`Frame.vue`, `Configurator.vue` — no own colors; Configurator inherits whatever the `Control*` decision is. `Canvas.vue` — converted.)

---

## Cross-cutting issues

### Pre-token `dark:` leftovers
`ux/Input.vue` and `dev/meta/PropsMachine.vue` carry styles from the abandoned per-component `dark:` approach. These now interact badly with the real `.dark` mechanism (Input's `dark:` overrides fight the tokens; PropsMachine's hardcoded root `.dark` force-activates dark tokens locally). Convert these two first — they're the only places the old and new systems collide.

### Flat utility tokens
`warn` (#F87F7D), `blue` (#2FAEFD), `red` (#FF0033), `tableBorder` (#CCCCCC) in `tailwind.config.js` are static — they render identically in dark. `warn` coincidentally equals the dark `signal-error` value, so it stays legible; `red`/`blue` are acceptable-but-unmanaged. Migrate usages to `signal-*` opportunistically (sites listed per-component above); don't remove the keys (non-breaking constraint).

### JS-side colors
Chart.js configs, severity maps, state palettes, and sparkline `strokeColor` props can't use Tailwind classes. Pattern to standardize (define once, e.g. a `useTokenColor()` composable or plain helper):

```js
// channels var → usable color string; resolves per current theme
const qp = (role, alpha = 1) => `rgb(var(--qp-${role}) / ${alpha})`
// e.g. strokeColor: qp('primary'), tagBg: qp('signal-error', 0.1)
```

Two gotchas: (1) SVG attrs and Chart.js accept these strings only where CSS resolves them — Chart.js snapshots values at render, so charts must re-render on theme toggle (watch `useColorScheme().colorScheme`); (2) the `vue/` barrel consumers (qflow/qmap) don't load Tailwind but do get `tokens.css` if they import it — document that requirement.

### Elevation on dark
Shadow-only panels need `border border-stroke` added (plan's locked rule — no raised surface tier): `security/PolicySkin`, `security/PolicyHeader` stats card, `health/DialSummary`, `form/SaveBar`, `alert/Config`, `ux/HoverBox`.

### Hard black / inverted chips
`bg-black`, `border-black`, `text-black` appear in ~12 places. `text-black` → `text-content` always. For deliberately-inverted elements (`ux/BoxTag`) use the token inversion `bg-content text-surface` so contrast survives both modes.

---

## Suggested conversion order

1. **Collisions first (small):** `ux/Input`, `dev/meta/PropsMachine`, `shared.css` `btn-danger:hover` — old/new system conflicts and the one converted-file leftover.
2. **Wave 1 — ux/ core + table-list stragglers (25 files, mostly mechanical):** highest consumer surface area (app.qpoint.io). Everything in the ux/ tables above.
3. **Wave 2 — data/ (16):** mechanical text/border classes plus the `qp()` JS-hex pattern; fix `SparkChart` `'black'` defaults and the three `#BBA5FF` callers together.
4. **Wave 3 — security/ + health/ + icon-nav/ (12):** needs the JS-palette pattern from Wave 2; one design decision on Dial gradients.
5. **Wave 4 — form/sentence/alert/typography (9):** small, mechanical.
6. **Wave 5 — dev/ Control* family (decision-gated)** and **prose/ (defer until www goes dark).**

Verification per wave: toggle via `UxThemeToggle` in a consumer with `NUXT_LOCAL_LAYER=1`; check light mode is pixel-identical (raw scales → tokens is value-identical in light by construction — any visible light-mode diff is a conversion error).
