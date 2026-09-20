---
name: layer-catalog
description: Full inventory of all shared components in @qpoint-io/q-nuxt-layer with descriptions, props, slots, emits, and usage guidance.
---

# Qpoint Nuxt Layer — Component Catalog

Complete reference for all shared components distributed via `@qpoint-io/q-nuxt-layer`.

---

## UX Components (`components/ux/`)

### UxButton
**Source:** `components/ux/Button.vue`
**Description:** Primary action button with grape background, stroke variant, icon slot, and loading spinner state.
**Use when:** Triggering any user action. Use `kind="stroke"` for secondary actions, `spin=true` during async operations.
**Props:** `disabled (Boolean, false)`, `kind (String, '')` — `''` (filled) or `'stroke'` (outlined), `spin (Boolean, false)`
**Emits:** (native click)
**Slots:** `default` (label text), `icon` (left icon area)
**Related:** `UxClose`

---

### UxInput
**Source:** `components/ux/Input.vue`
**Description:** A form field wrapper providing a label, optional hint, error message display with red underline, focus tracking, and a help modal trigger via a `?` icon.
**Use when:** Any form input field that needs a label, validation error display, and optionally contextual help documentation.
**Props:** `label (String, '')`, `hint (String, null)`, `error (String, null)`
**Emits:** (none)
**Slots:** `default` (the actual `<input>` or control element), `help` (content for the optional help modal)
**Related:** `UxModal`

---

### UxModal
**Source:** `components/ux/Modal.vue`
**Description:** A HeadlessUI dialog modal with backdrop, animated enter/leave transitions, configurable alignment, full-screen mode, and optional close button, bound via `v-model:open`.
**Use when:** Any overlay dialog — confirmations, detail views, help documentation, or form flows.
**Props:** `open (Boolean, false)`, `fullScreen (Boolean, false)`, `atTop (Boolean, false)`, `atBottom (Boolean, false)`, `closeBtn (Boolean, true)`, `bg (String, 'bg-white')`
**Emits:** `update:open`
**Slots:** `default`
**Related:** `UxClose`, `UxInput` (uses Modal for help)

---

### UxToggle
**Source:** `components/ux/Toggle.vue`
**Description:** A toggle switch label wrapper with styled pill toggle track and circle around a slotted checkbox input, with configurable size, reverse layout, label, disabled, and perma-checked states.
**Use when:** Enable/disable settings toggles throughout forms and settings panels.
**Props:** `label (String)`, `disabled (Boolean, false)`, `permaChecked (Boolean, false)`, `size (String, 'medium')` — `micro`, `tiny`, `small`, `medium`, `large`, `reverse (Boolean, false)`
**Emits:** (none)
**Slots:** `default` (the `<input type="checkbox">` element), `label` (rich label content)
**Related:** `UxCheckbox`

---

### UxTag
**Source:** `components/ux/Tag.vue`
**Description:** A small grape-colored pill tag with X remove button, supporting a warning color variant.
**Use when:** Displaying removable filter tags, label chips, or selected values in tag-input fields.
**Props:** `noX (Boolean, false)`, `id (String)`, `warn (Boolean, false)`
**Emits:** `remove`
**Slots:** `default`
**Related:** `UxClose`

---

### UxCopyBtn
**Source:** `components/ux/CopyBtn.vue`
**Description:** A copy-to-clipboard button that shows a copy icon, transitions to a checkmark confirmation on click, and resets after 4 seconds.
**Use when:** Any place where text needs to be copied to the clipboard. Use `noText=true` for icon-only mode in compact areas.
**Props:** `textToCopy (String, '')`, `copy (Boolean, true)`, `copiedText (String, 'copied!')`, `copyText (String, 'copy')`, `noText (Boolean, false)`, `inline (Boolean, false)`
**Emits:** (none)
**Slots:** (none)
**Related:** uses `useClipboard` composable

---

### UxClose
**Source:** `components/ux/Close.vue`
**Description:** A small X icon button (grey, turns black on hover) used for dismissal actions.
**Use when:** Dismissing modals, notifications, message banners, or any overlay — typically positioned absolutely in the top-right corner.
**Props:** (none)
**Emits:** (none)
**Slots:** (none)
**Related:** `UxModal`, `UxMessage`

---

### UxCheckbox
**Source:** `components/ux/Checkbox.vue`
**Description:** A label wrapper that associates a label string with a slotted checkbox input by reading the input's `id` from the slot.
**Use when:** Wrapping a native checkbox input with a styled label. Slot must contain `<input type="checkbox" id="...">`.
**Props:** `label (String, null)`
**Emits:** (none)
**Slots:** `default` (must contain an `<input type="checkbox" id="...">`)
**Related:** `UxToggle`

---

### UxMessage
**Source:** `components/ux/Message.vue`
**Description:** A dismissible floating notification card with drop shadow, grape border, and close button.
**Use when:** Transient toast-style notifications or in-page alert messages that the user can dismiss.
**Props:** (none)
**Emits:** `close`
**Slots:** `default`
**Related:** `UxClose`

---

### UxIcon
**Source:** `components/ux/Icon.vue`
**Description:** Dynamically loads and renders an SVG icon from `~/assets/svg-icons/` by ID, with scoped CSS style isolation.
**Use when:** Rendering any SVG icon from the project's icon library by its path-based ID string (e.g. `id="nav/settings"`). Requires the consumer project to provide SVGs in `~/assets/svg-icons/`.
**Props:** `id (String, required)`, `filled (Boolean, false)`
**Emits:** (none)
**Slots:** (none)
**Related:** Icons

---

### UxLabelText
**Source:** `components/ux/LabelText.vue`
**Description:** A simple two-line display: small grey label above and bold large value text below.
**Use when:** Displaying a labelled data value in stat cards, detail panels, or summary rows.
**Props:** `label (String)`
**Emits:** (none)
**Slots:** `default` (the main value text)
**Related:** `UxCopyBtn`

---

### UxSimpleSelect
**Source:** `components/ux/SimpleSelect.vue`
**Description:** A minimal borderless native `<select>` with custom down-arrow and `v-model` support.
**Use when:** Compact inline dropdowns within table headers, filter bars, or settings rows where a full styled select is too heavy.
**Props:** `modelValue (any)`
**Emits:** `update:modelValue`, `change`
**Slots:** `default` (the `<option>` elements)
**Related:** `UxInput`

---

## Icons (`components/icon/`)

SVG icons auto-imported with the `Icon` prefix. `.vue` files use templates; `.ts` files use Vue render functions. Consumer projects can override any icon by defining a local component with the same name.

### Template Icons (`.vue`)

**IconCheck** — `Check.vue` — Checkmark polyline (stroke). Used by UxCopyBtn.
**IconCopy** — `Copy.vue` — Two-rect copy icon (stroke). Used by UxCopyBtn.
**IconSpinner** — `Spinner.vue` — Arc spinner path (stroke). Used by UxButton when `spin=true`. Animate with `animate-spin`.
**IconX** — `X.vue` — 2-line close X (stroke). Used by UxClose.

### Render Function Icons (`.ts`)

**IconArrowHead** — `ArrowHead.ts` — Small chevron arrow (fill).
**IconArrowRight** — `ArrowRight.ts` — Right-pointing arrow (fill).
**IconArrowUp** — `ArrowUp.ts` — Up arrow with stem (stroke).
**IconArrowUpRound** — `ArrowUpRound.ts` — Rounded up arrow / caret (fill).
**IconCheckFat** — `CheckFat.ts` — Bold checkmark (fill).
**IconDash** — `Dash.ts` — Horizontal dash (fill).
**IconDns** — `Dns.ts` — DNS indicator lines (stroke).
**IconDownArrow** — `DownArrow.ts` — Down-pointing dropdown arrow (fill).
**IconEdit** — `Edit.ts` — Pencil / edit (fill).
**IconExclaim** — `Exclaim.ts` — Exclamation mark (stroke).
**IconExternalLink** — `ExternalLink.ts` — External link arrow (stroke).
**IconJoin** — `Join.ts` — Join / connect (fill).
**IconLogo** — `Logo.ts` — Qpoint logo (fill).
**IconNo** — `No.ts` — Prohibition circle (stroke).
**IconPlus** — `Plus.ts` — Plus sign (fill).
**IconPlusFat** — `PlusFat.ts` — Bold plus sign (fill).
**IconSearch** — `Search.ts` — Magnifying glass (stroke).
**IconTrafficSource** — `TrafficSource.ts` — Traffic source globe (fill).
**IconTriangle** — `Triangle.ts` — Warning triangle (fill). Used by DevMetaPropsMachine.
**IconView** — `View.ts` — Eye / visibility (fill).
**IconXBig** — `XBig.ts` — Large close X (stroke).

---

## Dev Components (`components/dev/`)

Documentation and development tools for building interactive component demos. Auto-imported with the `Dev` prefix.

### DevCanvas
**Source:** `components/dev/Canvas.vue`
**Description:** Main documentation wrapper. Renders a titled backdrop area with an optional interactive prop editor (DevMetaPropsMachine). Supports `admin-at-top` to position the editor above the demo.
**Use when:** Creating interactive component documentation pages.
**Props:** `title (String)`, `loc (String)` — source file path (click to copy), `route (String)`, `adminProps (Object)` — reactive ref for prop editor, `adminAtTop (Boolean, false)`, `bg (String)` — backdrop CSS class override
**Emits:** `update:adminProps`
**Slots:** `default` (the component demo)
**Related:** `DevMetaPropsMachine`, `DevH`, `DevFrame`

---

### DevFrame
**Source:** `components/dev/Frame.vue`
**Description:** Simple labeled container for individual component examples.
**Use when:** Census/gallery views showing each component at a glance with a label.
**Props:** `label (String)`
**Emits:** (none)
**Slots:** `default`
**Related:** `DevLabel`, `DevCanvas`

---

### DevH
**Source:** `components/dev/H.vue`
**Description:** Section heading with hairline border styling, using font-dev (rigid-square) in italic.
**Use when:** Section headings within DevCanvas documentation pages.
**Props:** (none)
**Emits:** (none)
**Slots:** `default`

---

### DevLabel
**Source:** `components/dev/Label.vue`
**Description:** Simple styled text label (grey-400, text-14) for annotations.
**Use when:** Annotating demos or labeling elements within documentation pages.
**Props:** (none)
**Emits:** (none)
**Slots:** `default`

---

### DevComment
**Source:** `components/dev/Comment.vue`
**Description:** Code comment text in blue using font-dev.
**Use when:** Adding developer notes or comments within documentation layouts.
**Props:** (none)
**Emits:** (none)
**Slots:** `default`

---

### DevMetaPropsMachine
**Source:** `components/dev/meta/PropsMachine.vue`
**Description:** Auto-generates UI controls for each property in the provided object. Detects JavaScript types and renders the appropriate control.
**Use when:** Inside DevCanvas via `adminProps` — rarely used directly.
**Props:** `properties (Object, required)` — the reactive props object
**Emits:** `update:properties`
**Slots:** (none)
**Related:** `DevCanvas`, `UxToggle`, `UxInput`, `UxLabelText`, `UxSimpleSelect`, `IconTriangle`

**Type → Control mapping:**

| Value Type | Control | Template Binding |
|-----------|---------|-----------------|
| `boolean` | Toggle (UxToggle) | `adminProps.propName` |
| `string` | Text input (UxInput) | `adminProps.propName` |
| `number` | Number input + arrows (shift = 10x) | `adminProps.propName` |
| `function` | Disabled text input | (not editable) |
| `array` | Disabled text input | (not editable) |
| `{ kind: 'options', val, props: { options } }` | Dropdown (UxSimpleSelect) | `adminProps.propName.val` |
| `{ kind: 'range', val, props: { min, max } }` | Range slider + text | `adminProps.propName.val` |
| `object` (other) | Disabled text input | (not editable) |

---

## Composables (`composables/`)

### useClipboard
**Source:** `composables/useClipboard.ts`
**Description:** Copies text to clipboard using the Clipboard API with fallback.
**Used by:** `UxCopyBtn`

---

## Decision Tree

| Need | Use |
|------|-----|
| Standard action button | `UxButton` |
| Secondary/outlined button | `UxButton kind="stroke"` |
| Dismiss/close trigger | `UxClose` |
| Labeled form field wrapper | `UxInput` |
| Inline borderless dropdown | `UxSimpleSelect` |
| Toggle on/off | `UxToggle` |
| Checkbox with label | `UxCheckbox` |
| Removable tag/chip | `UxTag` |
| Copy to clipboard | `UxCopyBtn` |
| Dialog overlay | `UxModal` |
| Toast notification | `UxMessage` |
| Labelled data value | `UxLabelText` |
| Dynamic SVG icon | `UxIcon` (requires consumer SVGs) |
| Interactive component docs | `DevCanvas` with `adminProps` |
| Component gallery/census | `DevFrame` with `label` |

---

## Typography Components (`components/typography/`)

### TypographyLabel
**Source:** `components/typography/Label.vue`
**Description:** A simple label div with hairline border-bottom, grey-400 text, text-13, font-med styling.
**Use when:** Labelling stat values or data displays that need a consistent small label style.
**Props:** (none)
**Emits:** (none)
**Slots:** `default`
**Related:** `DataVal`

---

## Data Components (`components/data/`)

Data visualization primitives for stats, charts, sparklines, trends, and percent bars. Auto-imported with the `Data` prefix. Chart components (`DataChartUI`, `DataSparkChart`) require `chart.js` and `vue-chartjs` as peer dependencies.

### DataKeyVal
**Source:** `components/data/KeyVal.vue`
**Description:** Simple key-value display: small grey label above and semi-bold value below.
**Use when:** Displaying labelled data values in detail panels or summary sections.
**Props:** `label (String, required)`, `val (String)`
**Emits:** (none)
**Slots:** `default` (overrides val text)

---

### DataPercentBar
**Source:** `components/data/PercentBar.vue`
**Description:** Wrapper around `UxPercentBar` that formats a raw total number using compact notation.
**Use when:** Showing a percent bar with an auto-formatted total label.
**Props:** `total (Number, required)`, `percent (Number, required)`
**Emits:** (none)
**Slots:** (none)
**Related:** `UxPercentBar`

---

### DataSegmentBar
**Source:** `components/data/SegmentBar.vue`
**Description:** Horizontal 100 % bar of named segments (a whole with 3–6 parts). Values in, not percents — the component normalizes, so the consumer passes the same numbers the card shows. 2 px surface gap between fills, per-segment hover title, legend (title + value in text tokens) below or beside. No colors → the three validated categorical slots, a 4th+ identity segment folds into "Other"; `ordinal` → one grape hue stepped light → dark; `color: 'outline'` → bordered empty segment. Empty items → a hairline track.
**Use when:** A card's count is made of named parts that sum to it — coverage state, presence, posture, outcome, kind mix, token composition. Not for a single ratio (use the number + `DataMetricPercentBar`) and not for ranked magnitude (use `DataPercentBar` rows).
**Props:** `items (Array, required)`, `width (Number, 200)`, `height (Number, 16)`, `gap (Number, 2)`, `legend (String, 'below')`, `ordinal (Boolean, false)`
**Emits:** (none)
**Slots:** (none)
**Related:** `DataDonutChart`, `DataHistoryGraph`, `DataMachine`, `components/data/palette.js`

---

### DataStat
**Source:** `components/data/Stat.vue`
**Description:** Stat block with label, formatted value, percentage/number display modes, health coloring, and loading spinner.
**Use when:** Displaying a single labelled statistic with optional health indication.
**Props:** `label (String, required)`, `val (required)`, `size (String, StatSizes.SMALL)`, `kind (String, StatTypes.PERCENTAGE)`, `showHealth (Boolean, false)`, `isHealthy (Boolean, true)`
**Emits:** (none)
**Slots:** (none)
**Related:** `IconSpinner`, `StatSizes`, `StatTypes`

---

### DataTrendDirection
**Source:** `components/data/TrendDirection.vue`
**Description:** Displays a change value with +/- indicator and a triangle arrow that flips for negative changes.
**Use when:** Showing trend direction alongside a value.
**Props:** `value ()`, `change (Number, 0)`
**Emits:** (none)
**Slots:** (none)
**Related:** `IconTriangle`

---

### DataVal
**Source:** `components/data/Val.vue`
**Description:** Configurable value display with optional label (via TypographyLabel), metric suffix, size-keyed typography, health coloring, radio-button checked state, and loading spinner.
**Use when:** Displaying a primary statistic value with optional metric, inline content, and selectable state.
**Props:** `label (String)`, `val (required)`, `metric (String)`, `size (String, StatSizes.SMALL)`, `kind (String, StatTypes.PERCENTAGE)`, `showHealth (Boolean, false)`, `isHealthy (Boolean, true)`, `isChecked (Boolean, false)`, `fitHeight (Boolean, false)`, `fitWidth (Boolean, false)`
**Emits:** `check`
**Slots:** `default`, `inline`
**Related:** `TypographyLabel`, `IconSpinner`, `StatSizes`, `StatTypes`

---

### DataSparkChart
**Source:** `components/data/SparkChart.vue`
**Description:** Chart.js-based sparkline. Renders a minimal line chart with no axes, labels, or tooltips.
**Use when:** Compact inline trend visualization. Requires `chart.js` and `vue-chartjs`.
**Props:** `data (Array, [])`, `ceiling (Number)`, `fillColor (default: 'black')`, `strokeColor (default: 'black')`, `strokeWidth (default: 1)`, `padding (default: 0)`
**Emits:** (none)
**Slots:** (none)

---

### DataSparkChartOld
**Source:** `components/data/SparkChartOld.vue`
**Description:** SVG-based sparkline using `svgMachine` utility. Renders a polygon/polyline chart with no external dependencies.
**Use when:** Sparklines without chart.js dependency.
**Props:** `data (Array, required)`, `ceiling (Number)`, `fillColor (default: 'black')`, `strokeColor (default: 'black')`, `strokeWidth (default: 0)`, `padding (default: 0)`
**Emits:** (none)
**Slots:** (none)
**Related:** `svgMachine` util

---

### DataChartUI
**Source:** `components/data/ChartUI.vue`
**Description:** Full Chart.js chart supporting line and bar types with auto-formatted axes (bytes, duration, abbreviated numbers), timestamp labels, and compact mode.
**Use when:** Rendering time-series data as line or bar charts. Requires `chart.js` and `vue-chartjs`.
**Props:** `data (Array, [])`, `type (String, 'line')`, `compact (Boolean, false)`, `unit (String, '')`, `showYAxis (Boolean, true)`, `showXAxis (Boolean, true)`
**Emits:** (none)
**Slots:** (none)
**Related:** `formatBytes`, `formatDuration`, `abbreviateNumber`, `timestampsDuration`

---

### DataYAxis
**Source:** `components/data/YAxis.vue`
**Description:** Y-axis overlay with horizontal gridlines and value labels. Left/right thick borders frame the chart area.
**Use when:** Adding a Y-axis to custom chart layouts.
**Props:** `top (Number, required)`, `bottom (Number, required)`, `stops (Number, required)`
**Emits:** (none)
**Slots:** (none)

---

### DataTimeline
**Source:** `components/data/Timeline.vue`
**Description:** Vertical gridline overlay with time labels for 15min/hour/day/week/month timeframes.
**Use when:** Adding a time-based X-axis to custom chart layouts.
**Props:** `timeframe (String, Time.week)`, `showLabels (Boolean, true)`, `placeLabelsBottom (Boolean, false)`
**Emits:** (none)
**Slots:** (none)
**Related:** `Time`, `timeFrameToStart`

---

## Data Machine Components (`components/data/metric/`)

Composable primitives for building stat displays. Auto-imported with `DataMetric` prefix.

### DataMetricValue
**Source:** `components/data/metric/Value.vue`
**Description:** Formatted number display with dynamic font size/weight, unit suffix, bytes/duration auto-formatting, health temperature coloring, and loading spinner.
**Use when:** The core value renderer for the machine stat system.
**Props:** `val (required)`, `size (Number, 40)`, `weight (String)`, `unit (String)`, `unitSize (String)`, `showFullNumber (Boolean)`, `healthMode (Function, healthModes.NEVER_HOT)`
**Emits:** (none)
**Slots:** (none)
**Related:** `healthModes`, `formatBytes`, `formatDuration`, `abbreviateNumber`, `IconSpinner`

---

### DataMetricLabel
**Source:** `components/data/metric/Label.vue`
**Description:** Stat label with hairline border and size-responsive text.
**Props:** `label (String, required)`, `size (String, StatSizes.SMALL)`
**Emits:** (none)
**Slots:** (none)

---

### DataMetricTrend
**Source:** `components/data/metric/Trend.vue`
**Description:** Trend change indicator with +/- prefix, formatted value (bytes/duration/abbreviated), triangle arrow, and health temperature coloring.
**Props:** `change (Number, 0)`, `healthMode (Function, healthModes.NEVER_HOT)`, `unit (String, '')`
**Emits:** (none)
**Slots:** (none)
**Related:** `IconTriangle`, `healthModes`, `formatBytes`, `formatDuration`, `abbreviateNumber`

---

### DataMetricPercentBar
**Source:** `components/data/metric/PercentBar.vue`
**Description:** Simple grape-colored horizontal bar sized by percent.
**Props:** `percent (Number)`
**Emits:** (none)
**Slots:** (none)

---

### DataMetricSpark
**Source:** `components/data/metric/Spark.vue`
**Description:** SVG-based sparkline (same as DataSparkChartOld). Uses `svgMachine` utility.
**Props:** `data (Array, required)`, `ceiling (Number)`, `fillColor (default: 'black')`, `strokeColor (default: 'black')`, `strokeWidth (default: 0)`, `padding (default: 0)`
**Emits:** (none)
**Slots:** (none)

---

### DataMetricBackground
**Source:** `components/data/metric/Background.vue`
**Description:** Slot wrapper that applies a red/warn background when the health evaluator returns hot.
**Props:** `val (Number)`, `healthMode (Function, healthModes.NEVER_HOT)`
**Emits:** (none)
**Slots:** `default`

---

### DataMetricDate
**Source:** `components/data/metric/Date.vue`
**Description:** Simple date string display.
**Props:** `date (String, required)`
**Emits:** (none)
**Slots:** (none)

---

## Data Machine Layouts (`components/data/metric/_/`)

Pre-composed stat layouts combining machine primitives. Auto-imported with `DataMetric_` prefix.

### DataMetric_Base
**Source:** `components/data/metric/_/Base.vue`
**Description:** Full stat block: optional label, value+trend row, optional sparkline, optional router link.
**Use when:** Standard stat display with all features.
**Props:** `label (String)`, `val (Number)`, `unit (String)`, `spark (Array)`, `trend (Number)`, `healthMode (Function)`, `size (Number)`, `weight (String)`, `showFullNumber (Boolean)`, `spaceAfterLabel (String)`, `sparkMaxWidth (Number)`, `to (String, '_none_')`
**Note:** Uses `useContext()` and `toUrl()` — consumer project must provide these.

---

### DataMetric_Compact
**Source:** `components/data/metric/_/Compact.vue`
**Description:** Simpler stat block: label + value + trend + optional spark. No link support.
**Props:** `label (String)`, `val (String)`, `unit (String)`, `spark (Array)`, `trend (Number)`, `healthMode (Function)`, `size (Number)`

---

### DataMetric_InlineTrend
**Source:** `components/data/metric/_/InlineTrend.vue`
**Description:** Value + trend side by side, no label, no spark. Hard-coded size 25.
**Props:** `val (Number)`, `unit (String)`, `trend (Number)`, `healthMode (Function)`

---

### DataMetric_Simple
**Source:** `components/data/metric/_/Simple.vue`
**Description:** Label (v-html) + value only. No trend, no spark.
**Props:** `label (String)`, `val (String)`, `unit (String)`, `size (Number)`

---

### DataMetric_TinyInline
**Source:** `components/data/metric/_/TinyInline.vue`
**Description:** Dense single-line layout: percent bar background + value + label + trend + optional spark, all in `max-h-4`.
**Props:** `percent (Number)`, `val (Number)`, `unit (String)`, `spark (Array)`, `trend (Number)`, `healthMode (Function)`, `label (String, '')`

---

## Utilities (`utils/`)

### stats.ts
**Exports:** `StatTypes` (`PERCENTAGE`, `NUM_FULL`, `NUM_SHORT`), `StatSizes` (`SMALL`, `MED`), `Time` (`fifteen`, `hour`, `day`, `week`, `month`)

### dataHealthMachine.js
**Exports:** `healthModes` (`ZERO_TOLERANCE`, `NEVER_HOT`, `FIVE_NINES`, `SLOW_REQUEST`), `isHot(value, evaluator)`

### svg.js
**Exports:** `Point` class, `svgMachine` (`compile`, `sparkChart`)

### time.ts
**Exports:** `timeFrameToStart`, `timeFrameToGranularity`, `timestampAsDisplay`, `timestampAsDay`, `timestampsDuration`

### number-formatter.js
**Exports:** `abbreviateNumber`, `formatBytes`, `formatDuration`

### array.js
**Exports:** `arrayMove`

### sleep.ts
**Exports:** `sleep`

---

## Health Components (`components/health/`)

Presentational components for health/status visualization. Auto-imported with the `Health` prefix.

### HealthDial
**Source:** `components/health/Dial.vue`
**Description:** SVG gauge dial with gradient color stops (cool→warn→warm→hot) and animated pointer needle. Status drives both color and needle position.
**Use when:** Displaying an overall health score or category health as a visual gauge.
**Props:** `status (String, required)` — `cool`, `warn`, `warm`, `hot`, `lineLength (Number, 600)`
**Emits:** (none)
**Slots:** (none)
**Related:** `HealthDialSummary`

---

### HealthDialSummary
**Source:** `components/health/DialSummary.vue`
**Description:** Wraps HealthDial in a circular white card with a status message below the gauge. Auto-derives message from status if not provided.
**Use when:** Displaying a health gauge with a contextual label (e.g., "Good", "Critical").
**Props:** `status (String, required)` — `cool`, `warn`, `warm`, `hot`, `statusMessage (String, null)` — override; auto-derived as Good/Warning/Concerning/Critical
**Emits:** (none)
**Slots:** (none)
**Related:** `HealthDial`

---

### HealthSummaryItem
**Source:** `components/health/SummaryItem.vue`
**Description:** Category row showing a status indicator circle, message, label, and colored severity dot.
**Use when:** Listing health categories in a summary (e.g., "TLS: A+", "Headers: F").
**Props:** `status (String, required)` — `cool`, `warn`, `warm`, `hot`, `label (String, '')`, `message (String, '')`
**Emits:** (none)
**Slots:** (none)

---

### HealthScanning
**Source:** `components/health/Scanning.vue`
**Description:** Rounded pill container with default slot for metrics, icon slot, and a manage button.
**Use when:** Displaying scanner/traffic summary with an action to manage scanners.
**Props:** `manageTxt (String, 'Manage')`
**Emits:** `manage`
**Slots:** `default` (metrics content), `icon` (image/icon area, defaults to grey placeholder)
**Related:** `UxButton`

---

## Security Components (`components/security/`)

### SecuritySeverity
**Source:** `components/security/Severity.vue`
**Description:** Displays a severity level as a colored circle + text label (crit!, high, medium, low).
**Use when:** Showing issue/vulnerability severity in tables or lists.
**Props:** `severity (String, required)` — `critical`, `high`, `medium`, `low`
**Emits:** (none)
**Slots:** (none)

---

## CSS Utilities (from `assets/css/shared.css`)

| Class | Description |
|-------|-------------|
| `.btn-cancel` | Grey border, transparent bg → grape-400 border on hover |
| `.btn-danger-outline` | Warn border, warn text → black border on hover |
| `.btn-danger` | Warn bg → black on hover |
| `.btn-outline` | Grape border, transparent → black border on hover |
| `.btn-outline-black` | Black border, grape text |
| `.abs-center` | Absolute center (translate -50%/-50%) |
| `.abs-x` | Absolute horizontal center |
| `.abs-y` | Absolute vertical center |
| `.hairline` | 1px bottom border, grey-300 |
| `._underline` | 3px bottom border, grey-300, with padding/margin |
| `._shadow-box` | White bg, shadow-lg, rounded-12 |
| `.fade-*` | Vue transition classes (0.5s ease opacity) |
