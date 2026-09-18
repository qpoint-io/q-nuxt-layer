# @qpoint-io/q-nuxt-layer — Nuxt Layer

Shared components, design tokens, and CSS for Qpoint projects. Distributed as a Nuxt Layer via npm.

## Package

- Published to **GitHub Packages** as `@qpoint-io/q-nuxt-layer`
- `"main": "./nuxt.config.ts"` — required for Nuxt to resolve the layer from node_modules
- `"exports"` — sub-path exports for non-Nuxt consumers (see [Vue Export](#vue-export-for-non-nuxt-projects) below)
- `"files"` whitelist: `components/`, `composables/`, `assets/css/shared.css`, `tailwind.config.js`, `nuxt.config.ts`, `vue/`

## Shared Components

### UX Components (`components/ux/`)

Auto-imported with the `Ux` prefix:

| Component | Description |
|-----------|-------------|
| `UxButton` | Filled/stroke variants, loading spinner |
| `UxInput` | Form wrapper with label, hint, error, help modal |
| `UxModal` | Headless UI dialog with transitions (peer dep: `@headlessui/vue`) |
| `UxToggle` | CSS toggle switch, 5 size variants |
| `UxTag` | Removable chip, grape/warn variants |
| `UxCopyBtn` | Copy-to-clipboard with visual feedback |
| `UxClose` | Small X button (used by Modal, Message) |
| `UxCheckbox` | Label wrapper for native checkbox |
| `UxMessage` | Toast notification with close button |
| `UxIcon` | Dynamic SVG loader (project provides icons) |
| `UxLabelText` | Two-line display: small grey label + bold value |
| `UxSimpleSelect` | Minimal borderless native `<select>` with v-model |
| `UxSelect` | Bordered native `<select>` form control with theme-aware caret |
| `UxCardLink` | Card-as-link with grape hover border; static card when no `to` |
| `UxBackLink` | Standard "← Back to X" link for detail pages |
| `UxCode` | Inline code span (mono, grey chip, 0.9em); `warn` tone |
| `UxCodeBlock` | Code block with copy button, optional collapse, dark/light themes |
| `UxPill` | Read-only toned badge (grape/leaf/grey/warn) |
| `UxFilterGroup` | Toggle-button filter/switcher group (single, multiple, required modes) |
| `UxTabGroup` | Joined-segment tab switcher with heavy underline and right-action slot |
| `UxTable` | Static doc table styling slotted thead/tbody (line/band variants) |
| `UxPageTitle` | Page header: optional breadcrumb trail + large title, hairline underline; `right`/`far-right`/`chin`/`chin-right` slots, `backText` + `@back`. Nuxt-only (`<NuxtLink>`) |

### Icons (`components/icon/`)

Auto-imported with the `Icon` prefix. `.ts` files use Vue render functions; `.vue` files use templates. Consumer projects can override any icon by defining a local component with the same name.

| Component | Style | Description |
|-----------|-------|-------------|
| `IconArrowHead` | fill | Small chevron arrow |
| `IconArrowRight` | fill | Right-pointing arrow |
| `IconArrowUp` | stroke | Up arrow with stem |
| `IconArrowUpRound` | fill | Rounded up arrow / caret |
| `IconCheck` | stroke | Checkmark |
| `IconCheckFat` | fill | Bold checkmark |
| `IconCopy` | stroke | Copy / clipboard |
| `IconDash` | fill | Horizontal dash |
| `IconDns` | stroke | DNS indicator lines |
| `IconDownArrow` | fill | Down-pointing dropdown arrow |
| `IconEdit` | fill | Pencil / edit |
| `IconExclaim` | stroke | Exclamation mark |
| `IconExternalLink` | stroke | External link arrow |
| `IconJoin` | fill | Join / connect |
| `IconLogo` | fill | Qpoint logo |
| `IconNo` | stroke | Prohibition circle |
| `IconPlus` | fill | Plus sign |
| `IconPlusFat` | fill | Bold plus sign |
| `IconSearch` | stroke | Magnifying glass |
| `IconSpinner` | stroke | Loading spinner (animate with `animate-spin`) |
| `IconTrafficSource` | fill | Traffic source globe |
| `IconTriangle` | fill | Warning triangle |
| `IconView` | fill | Eye / visibility |
| `IconX` | stroke | Close X |
| `IconXBig` | stroke | Large close X |

### Health Components (`components/health/`)

Auto-imported with the `Health` prefix:

| Component | Description |
|-----------|-------------|
| `HealthDial` | SVG gauge dial with gradient stops and animated pointer |
| `HealthDialSummary` | Wraps HealthDial in circular card with status message |
| `HealthSummaryItem` | Category row with severity dot and message |
| `HealthScanning` | Rounded pill with slots for metrics and icon |

### Security Components (`components/security/`)

Auto-imported with the `Security` prefix:

| Component | Description |
|-----------|-------------|
| `SecurityDataFlow` | Data flow visualization |
| `SecurityPolicyCard` | Policy card display |
| `SecurityPolicyRibbon` | Policy ribbon header |
| `SecurityPolicySkin` | Policy skin wrapper |
| `SecurityViolationsTable` | Violations table |
| `SecuritySeverity` | Severity badge (circle + label) |

### Policy Components (`components/policy/`)

Table-cell building blocks for policy-enforcement UIs (extracted from design's c54 Policy & Enforcement v2 mock), auto-imported with the `Policy` prefix:

| Component | Description |
|-----------|-------------|
| `PolicySummaryCell` | Toggle + name + description + Details link + Beta pill (left table column) |
| `PolicyValueSelect` | Value set at this cascade level: minimal select (UxSimpleSelect) + Config.. + optional ✕ (`deletable` → `delete`); compose ⊕ outside |
| `PolicyOverrideStack` | Inherited cascade value: purple label + dashed "+ Override" button |
| `PolicyCoverageCell` | Framework coverage cell: Required + ✔ Active / red ! Required / dash |
| `PolicyCompletenessCell` | Mini progress bar over "84% · 14 / 18 · Controls" |

### Agent Components (`components/agent/`)

Auto-imported with the `Agent` prefix:

| Component | Description |
|-----------|-------------|
| `AgentAvatar` | Inline identity chip: agent logo + name. `name` resolves against the known-agent registry (`components/agent/registry.js`) for logo + canonical label; unknown agents get the generic mark + raw name. `label` prop overrides shown text |
| `AgentLogo*` | One SFC per known agent under `components/agent/logo/` (Claude, Codex, Copilot, Cursor, Gemini, Goose, Grok, Ollama, Openclaw, Opencode, Openhands, Windsurf, Zed, Aider, Devin, Pi) + `AgentLogoGeneric` fallback spark. Alias matching handles raw telemetry names ("Claude Code CLI", "cursor-agent", "chatgpt") |

To add an agent: drop a logo SFC in `components/agent/logo/`, import it in `registry.js`, add an entry (order matters — specific entries before general ones).

### Compliance Components (`components/compliance/`)

Auto-imported with the `Compliance` prefix:

| Component | Description |
|-----------|-------------|
| `ComplianceFrameworkIcon` | Framework-kind icon: pass `kind` ("Risk Taxonomy", "Regulation", "Attestation", "Governance", …) and the registry (`components/compliance/registry.js`) picks the icon. Deliberately many-to-one — icons are a small shared vocabulary; unknown kinds fall back to the scale |
| `ComplianceIcon*` | The icon vocabulary under `components/compliance/icon/`: `Warn` (risk taxonomies), `Scale` (regulations/standards), `Ribbon` (attestation/governance). currentColor structure + grey accents |

### Dev Components (`components/dev/`)

Documentation and dev tools, auto-imported with the `Dev` prefix:

| Component | Description |
|-----------|-------------|
| `DevCanvas` | Interactive documentation wrapper with adminProps support |
| `DevFrame` | Labeled container for component examples |
| `DevH` | Section heading with hairline border (font-dev) |
| `DevLabel` | Annotation text (grey-400, text-14) |
| `DevComment` | Code comment text (blue, font-dev) |
| `DevMetaPropsMachine` | Auto-generates UI controls from adminProps object |
| `DevControlSlider` | Range input with label and optional suffix display |
| `DevControlColor` | Hex color text input (6-char format) |
| `DevControlSelect` | Dropdown select with normalized options |
| `DevControlSection` | Collapsible section container with title |
| `DevControls` | Top-level control panel with show/hide toggle |
| `DevPatternCard` | Pattern-doc scaffold: name/description/when slots, live example, copyable code |

### Nav Components

Auto-imported (path-based prefix):

| Component | Dir | Description |
|-----------|-----|-------------|
| `IconNavItem` | `components/icon-nav/` | Icon-led left-nav link: icon slot + collapsible label, route-aware active state (`basePath` match) and grape underline. Nuxt-only (uses `<nuxt-link>`/`useRoute`) |
| `NavVertical` | `components/nav/` | Vertical nav section: optional hairline title above a slot of `NavVerticalItem` links |
| `NavVerticalItem` | `components/nav/` | Vertical-nav link — `<nuxt-link>` (`to`), external `<a>` (`href`), or plain slot; prop-driven `active` and small/medium `size`. Nuxt-only |

## Design Tokens

Canonical source: `tailwind.config.js`. fontSize replaces Tailwind defaults (at theme root, not extend).

- **Grape** (#895AE8) — 12-step scale, primary/interactive
- **Leaf** (#58E392) — 4-step scale, success/positive
- **Grey** (#949494) — 13-step scale, neutral
- **Semantic** — error, warning, success, info, warn
- **Typography** — Inter (sans), Geist Mono (mono), rigid-square (dev)
- **Spacing** — px8 through px64
- **Border radius** — 1px through 32px

## Layer Architecture

- `nuxt.config.ts` uses `join(currentDir, 'path')` with absolute paths — works from both sibling directories and node_modules
- `tailwindcss.cssPath: false` — @tailwind directives are in `shared.css`
- `components/` and `composables/` are explicitly registered via `components.dirs` and `imports.dirs`
- Tailwind plugins (`@tailwindcss/forms`, `tailwindcss-animation-delay`) are dependencies (not devDeps) so they resolve from the package directory

## Vue Export for Non-Nuxt Projects

Components in `vue/` are barrel exports that re-export from `components/` — allowing plain Vue 3 + Vite projects (like qflow and qmap) to import without Nuxt:

```js
import { ControlSlider, DevControls } from '@qpoint-io/q-nuxt-layer/vue'
import { ControlSection } from '@qpoint-io/q-nuxt-layer/vue/dev-controls'
```

- Components are raw `.vue` SFCs — consumers compile them via `@vitejs/plugin-vue`
- No build step in this package; zero-build philosophy preserved
- Components in `vue/` must use explicit `import { ref } from 'vue'` (no Nuxt auto-imports)
- Scoped CSS only (no Tailwind dependency required for consumers, though Tailwind is OK to use)
- Sub-path exports defined in `package.json` `"exports"` field

**Adding new exportable components:**
1. Create the component in `components/` (follows Nuxt auto-import naming)
2. Re-export from the appropriate `vue/` barrel file
3. Update `vue/index.js` if adding a new group

## Consumer Integration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@qpoint-io/q-nuxt-layer'],
})
```

- Consumer's tailwind.config can extend/override tokens (deep merge)
- Local components with same name override layer components (Nuxt auto-import priority)
- Consumer's own CSS needs its own `@tailwind` directives if using `@layer` blocks
- To detach: copy needed files locally and remove the `extends` line

## Releasing

All consumers declare `"@qpoint-io/q-nuxt-layer": "latest"` and install from **GitHub Packages** (the `file:` tarball flow is retired). A release is: bump → tag-push (CI publishes) → refresh consumer lockfiles.

### Full release steps

```bash
# 1. Bump version
npm version patch --no-git-tag-version   # or minor/major — updates package.json + package-lock.json

# 2. Commit, tag, push
git add package.json package-lock.json
git commit -m "v<version>: <summary>"
git tag v<version>
git push && git push --tags # Tag push triggers .github/workflows/publish.yml

# 3. Refresh consumer lockfiles (after CI publishes — check Actions)
./scripts/update-consumers.sh   # runs `npm update @qpoint-io/q-nuxt-layer` in each consumer
```

### Why the lockfile refresh?

npm resolves `"latest"` at install time and pins the result (version + integrity) in each
consumer's lockfile — it does **not** float. `scripts/update-consumers.sh` re-resolves the
pin in design, bob-wire, app.qpoint.io, www.qpoint.io, and qcontrol's qdash UI. Requires
`GITHUB_TOKEN` (read:packages) in the environment. Commit the lockfile changes in each
consumer repo.

### Important

- The registry install is **not used for local dev** when `NUXT_LOCAL_LAYER=1` is set — layer changes are live via HMR; the published version matters for CI/production builds and TypeScript resolution
- A stale `components/.nuxt/` or `components/node_modules/` dir will get packed into the publish (the `files` whitelist ships `components/` wholesale) — delete them if they appear

### Migration notes — v0.9.13

- **Chrome tweaks visible to every consumer:** `UxAvatar` ring is now `border-2` (was `border-1`); `UxPageTitle`'s underline row has `pb-3` (was `pb-1`). No API change — expect avatars to read slightly heavier and page titles to sit a little higher off their rule.
- **New `filter/*` namespace** — `Filter`, `FilterItem`, `FilterTriggerBar`, `FilterDatasetViewSelector`, `FilterEndcapPlaceholder` are the v2 segmented-bar design; the components extracted verbatim from app.qpoint.io live under `filter/old/` as `FilterOld*`. app.qpoint.io still runs its own local copies — migrating it to v2 is c88's pending next step.
- **New `DataMachine`** (`data/machine/`) — composition harness over the DataMetric primitives. `svgMachine.sparkChart` gained a `closePath` param; `DataMetricSpark` passes `fillColor !== 'none'`, so line-only sparklines no longer show baseline-anchor drops.

### Migration notes — v0.9.6

- **`UxTableListExpandRow` close X moved.** The sticky viewport-anchored X is gone. By default the `#details` slot now renders inside one `UxTableListExpandSection` card (same chrome `DataTable` used to hand-roll) with a card-anchored close X. Consumers that bring their own details chrome — or compose their own ExpandSection stack — must pass `bare` on the row (details slot scope provides `close`; `open()`/`close()` are exposed for template refs). Notably: app.qpoint.io's direct ExpandRow sites (traffic/inventory ItemUI, alerting) will want `bare` when they take this version.
- **`DataTable`** no longer wraps `#details` in its own card (ExpandRow's default supplies it); new `bareDetails` prop for sectioned stacks; `#details` slot scope is now `{ row, close }`.
- **`UxButton`** default-kind background moved grape-400 → grape-600; new `size` prop (px height, default `'48'` — unchanged height by default).
- **New `DataSurfacePanel`** (`data/SurfacePanel.vue`) — ranked rows + DataPercentBar column, extracted from qdash /inventory; qdash's and design's local `SurfacePanel.vue` copies are deleted in favor of it.

## Authentication

Consumers need a `GITHUB_TOKEN` with `read:packages` scope. Each consumer project has an `.npmrc`:

```
@qpoint-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Locally, set `export GITHUB_TOKEN=ghp_YOUR_TOKEN` in `~/.zshrc`. In CI, use `actions/setup-node` with `registry-url: https://npm.pkg.github.com`.

## Local Development

All consumer projects use `NUXT_LOCAL_LAYER=1` in `.env` to extend `../q-nuxt-layer` (the sibling folder) instead of the npm package. This gives live HMR — edits to layer components appear instantly in the running consumer dev server. No publishing or version bumps needed for local iteration.

## AI Agents

The `.claude/` directory contains specialized agents and skills for working with this layer:

### Agents
- **layer-expert** — Recommends components, explains APIs, suggests compositions, guides token usage
- **extraction-expert** — Extracts components from sister projects following "replicate first, optimize later"

### Skills (knowledge files loaded by agents)
- **layer-catalog** — Full inventory of all shared components with props, slots, emits, and usage guidance
- **layer-standards** — File structure, naming, auto-import rules, publishing workflow, consumer integration
- **design-tokens** — Color scales, typography, spacing, border-radius, breakpoints from tailwind.config.js

Note: `.claude/` does not ship in the npm package (not in `"files"` whitelist). It is used when working directly in this repository.

## Conventions

- Color is functional, not decorative
- Composition over configuration — use slots, not deep prop trees
- Tailwind-native — scoped CSS only for things Tailwind can't express
- Props use camelCase, events use kebab-case
- **Unified pantry:** This layer is the single shared pantry for all Qpoint visual components — generic primitives and domain-specific presentational components alike. Nuxt tree-shakes unused components, so breadth costs nothing. The boundary: visual/presentational → layer; wired to app state/APIs → stays local in the consumer.
- See design's `brand/component_philosophy.md` for full component design principles

## Sister Projects

### design — Brand soul, methodology & vision
- **When to use:** Need brand context when designing tokens, understanding color rationale, or checking voice in component copy
- **Key data:** `../design/brand/qpoint_brand_essential_guide_v1.5.md`, `../design/brand/design_tokens.md`, `../design/brand/component_philosophy.md`

### bob-wire — Interface design & prototyping
- **When to use:** Bob-wire is the primary testing ground for new components; check its wireframes/mockups to understand real usage patterns before extracting
- **Key data:** `../bob-wire/app/data/wireframe-registry.ts`, `../bob-wire/app/pages/c0/wireframes/` and `../bob-wire/app/pages/c0/mockups/`
