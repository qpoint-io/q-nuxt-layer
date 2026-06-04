# 02 — Reconciliation Matrix

_Maps the code library against both Figma files, so we know exactly what to build, port, and re-bind. Three-way: **Code** ↔ **New file** (`wzzmExswgFGXNKQyDSqGMF`) ↔ **Legacy file** (`8pllCWHTjstwHaj5ZAZUOo`)._

Legend — **New page:** exists as a page in File A · **Legacy set:** variant set exists in File B · ✅ present · ⚠️ partial/needs work · ❌ absent

## Core presentational components

| Code component | Path | New page | Legacy variant set | Action |
|---|---|---|---|---|
| UxButton | `components/ux/Button.vue` | ✅ Button | ✅ `ux/button` (Flavor×State×Icon) | **Port** legacy set → re-map `Flavor→kind`, add `state`, `spin`; re-bind tokens |
| UxToggle | `components/ux/Toggle.vue` | ✅ Toggle | ✅ `toggle` (On×Size 42/30/24) | **Port**; map `Size→size`(medium/…), add `disabled`,`reverse`,`label` |
| UxTag | `components/ux/Tag.vue` | ✅ Tag | ✅ `tag` (size×outline; close×key/val) | **Port**; map to props `noX`,`warn` |
| UxBoxTag | `components/ux/BoxTag.vue` | ✅ BoxTag | ⚠️ `data/rect-box`? (verify) | **Build/verify** |
| UxInput | `components/ux/Input.vue` | ✅ Input | ✅ `input`+`text-field`+`helpers` | **Port** rich input family; map `Label`,`Helpers`,hint/error/help |
| UxLink | `components/ux/Link.vue` | ✅ Link | ⚠️ `item`/`header` nav links | **Build** as set |
| UxAvatar | `components/ux/Avatar.vue` | ✅ Avatar | ✅ `avatar` | **Port** |
| UxSimpleSelect | `components/ux/SimpleSelect.vue` | ❌ | ✅ `select` (select×underline) | **Build** from legacy |
| UxCheckbox | `components/ux/Checkbox.vue` | ❌ | ✅ `checkbox`,`radio`,`toggle-item` | **Build** from legacy |
| UxLabelText | `components/ux/LabelText.vue` | ⚠️ (KeyVal?) | ✅ `data-text`/`Label` | **Build**; relationship to DataKeyVal TBD |
| UxModal | `components/ux/Modal.vue` | ❌ | ❌ | **Build** (later phase) |
| UxMessage | `components/ux/Message.vue` | ❌ | ❌ | **Build** (later phase) |
| UxCopyBtn / UxClose / UxAddBtn / UxIconBtn | `components/ux/*` | ❌ | ⚠️ `add`,`tag-add` | **Build** (small, batch later) |
| UxListItem | `components/ux/ListItem.vue` | ❌ | ✅ `list-item` (Drag×Manage) | **Port** |
| UxTableList* | `components/ux/table-list/*` | ✅ Table | ✅ `super-table`,`table/column`,`request-list-item` | **Port** table family |

## Data family

| Code component | Path | New page | Legacy variant set | Action |
|---|---|---|---|---|
| DataStat | `components/data/Stat.vue` | ✅ DataStat | ✅ `data` (line×type×delta) | **Port**; map `kind`,`size`,`showHealth` |
| DataSparkChart | `components/data/SparkChart.vue` | ✅ SparkChart | ✅ `data/sparkline` (a–d) | **Port** |
| DataPercentBar | `components/data/PercentBar.vue` | ✅ PercentBar | ✅ `data/percent-bar` + `rect-box` (width) | **Port** width variants |
| DataTrendDirection | `components/data/TrendDirection.vue` | ✅ TrendDirection | ✅ `triangle` (flip) / up×hot | **Port** |
| DataKeyVal | `components/data/KeyVal.vue` | ✅ KeyVal | ✅ `data-text` | **Port** |
| DataMetric* | `components/data/metric/*` | ❌ | ⚠️ composed in `data` examples | **Build** as compositions (later) |

## Health & Security

| Code component | Path | New page | Legacy variant set | Action |
|---|---|---|---|---|
| HealthDial | `components/health/Dial.vue` | ✅ HealthDial | ❌ | **Build** (no legacy source; new file has a start) |
| HealthDialSummary / Scanning / SummaryItem | `components/health/*` | ❌ | ❌ | **Build** (later) |
| SecuritySeverity | `components/security/Severity.vue` | ✅ Severity | ⚠️ tag-based | **Build** as set with `severity` (critical/high/medium/low) |
| SecurityPolicy* / DataFlow / ViolationsTable | `components/security/*` | ❌ | ⚠️ `super-table` for violations | **Build** (later phase; complex) |

## Icons

| Code | Path | New page | Legacy | Action |
|---|---|---|---|---|
| Icon* (26) | `components/icon/*` | ❌ (no Icons page) | ✅ many (favicons, cloud, ui glyphs) | **Build** `Icons` page; port legacy glyphs where they match the 26 code icons |

## Gaps summary

- **In legacy, worth porting (mature):** button, toggle, tag family, input family, select, checkbox/radio, list-item, super-table/table, data/sparkline, data/percent-bar, data/rect-box, triangle, avatar, meta doc component, icon sets.
- **In code, missing from BOTH Figma files:** Modal, Message, CopyBtn, Close, AddBtn/IconBtn, HoverBox, StretchBox, ToggleCard, DangerDelete, TagInput, HelpText; all `health/*` except Dial; most `security/*`; all `data/metric/*`; the full icon set as a dedicated page.
- **In new file but thin (needs variants):** every existing page — none encode variant props yet.

## Token drift check (code vs Figma variables)

Sampled live Figma variables match code exactly (`grape-500 #895ae8`, `grape-100 #efebfc`, `grey-600 #565454`, `grey-900 #111111`). **No drift detected in the sample.** Full collection comparison happens in Phase 2 once `tokens.json` exists and we read the complete Figma variable set (needs a desktop selection or REST pull).

## Vertical-slice pick (Phase 3 — prove the pattern)

**Button, Toggle, Tag, SecuritySeverity, DataStat, DataSparkChart, HealthDial** — spans: pure UX with rich legacy variants (Button/Toggle/Tag), a domain badge built fresh (Severity), data viz with legacy sources (DataStat/SparkChart), and a token-heavy SVG with no legacy source (HealthDial). If the structure + manifest pattern works across these five shapes, it generalizes.

## Prop → variant mapping seeds (from `defineProps`)

- **UxButton**: `kind:''|'stroke'…` → `Flavor`; `disabled:bool` → `State=Disabled`; `spin:bool` → `Loading`.
- **UxToggle**: `size:'medium'…` → `Size`; `disabled`,`permaChecked`,`reverse` → boolean variant props; `label:string` → text prop.
- **UxTag**: `noX:bool`,`warn:bool` → variant props (legacy `close`, grape/warn).
- **SecuritySeverity**: `severity:'critical'|'high'|'medium'|'low'` (required) → single `Severity` variant prop.
- **HealthDial**: `status:string` (required), `lineLength:number` → `Status` variant + numeric (numbers don't map to Figma variants cleanly; encode representative states).
- **DataStat**: `kind` (PERCENTAGE…) → `Type`; `size` → `Size`; `showHealth`/`isHealthy` → booleans; `label`/`val` → text props.
