# 01 — Library Audit

_Captured 2026-06-04. State of both Figma files and the code library at cycle start. Source for all later phases._

## Authenticated context

- Figma MCP authenticated as **mark@qpoint.io**, **Qpoint** team, **pro** tier, expert/full seat.
- **Code Connect is unavailable** — it requires Org/Enterprise. This is the defining constraint for the bridge design.

## File A — "Qpoint Design System" (NEW, canonical going forward)

- **fileKey:** `wzzmExswgFGXNKQyDSqGMF`
- **State:** v1, created 2026-06-03. Cover subtitle: "Components & tokens mirrored from q-nuxt-layer".
- **Not yet published** as a library (no libraries attached; not in org library list).
- **Structure:** one page per component (19 pages): `Cover`, `Foundations`, `— Components —` (divider), `Button`, `Tag`, `BoxTag`, `Avatar`, `Severity`, `Link`, `Input`, `Toggle`, `DataStat`, `TrendDirection`, `KeyVal`, `PercentBar`, `HealthDial`, `SparkChart`, `Table`, `Overview`.
- Each component page = a Documentation frame + a single component symbol. **No variant properties** encoded.
- **Tokens are wired** and correct: sampled `grape-500 #895ae8`, `grape-100 #efebfc`, `grey-600 #565454`, `grey-900 #111111` — all match `tailwind.config.js`.
- **Verdict:** clean token foundation and naming aligned to the current layer, but shallow. Good base; needs depth (variants) and scalable structure.

## File B — "app.qpoint.io - 3.0" (LEGACY, source of maturity to port)

- **fileKey:** `8pllCWHTjstwHaj5ZAZUOo`
- **State:** Published **team** library (`libraries_added_to_file` confirms it's a subscribed team library). Robust; used to mock the old Qpoint app.
- **Structure:** single mega-page "🌟 - Library" (`node 388:774`) — frames-per-component spread across a large canvas, with heavy use of a `meta` component for inline docs. This is the "single page, frames per component" model the user prefers.
- **Mature variant sets observed:**
  - `ux/button` — `Flavor` (Primary/Secondary/Danger) × `state` (Default/Hover/Pressed/Disabled) × `With Icon` (true/false)
  - `toggle` — `On` (true/false) × `Size` (42/30/24)
  - `input` (`Helpers`×`Label`), `text-field` (`Is Select`×`Placeholder`), `helpers` (`Hint`×`?`×`Link`), `select` (`select`×`underline`), `radio` (`on`), `checkbox` (`checked`)
  - `tag` (`size` 15/19/23/30 × `outline`), `tag` (`close`×`key/val`×`size` 28/22/19), `tag-add` (`size`), `tag-text` (`Flavor`)
  - `data` (`line`×`type`×`delta`), `data/sparkline` (`a–d`), `data/percent-bar`, `data/rect-box` (`width` full/75/50/25/5/0), `triangle` (`flip`)
  - `nav` (TopNav/two-lines), `item` (Default/hover/active), `header`, `list-item` (`Drag`×`Manage`), `super-table` (`nested`), `table/column` (`icon`)
  - `meta` doc component (multiple sizes), `_meta - todo`, placeholder/example scaffolding
  - icon families: cloud providers (aws/gcp/azure/k8s/docker/linux + bw variants), brand favicons (stripe/paypal/slack/segment/akamai/github/salesforce/apollo…), `avatar`
- **Caveat:** tokens reflect the **old app**, not the current layer. Variant naming (`Flavor=Primary/Secondary/Danger`) differs from the code's `kind` prop vocabulary. Porting must **re-bind to the new file's token variables** and **re-map variant names** to current `defineProps`.

## Code library — q-nuxt-layer

- **~103 components** across: `ux` (33), `icon` (26), `health` (4), `security` (7), `dev` (16), `data` (21).
- Data family (key for the legacy `data/*` sets): `DataStat`, `DataSparkChart`, `DataPercentBar`, `DataKeyVal`, `DataTrendDirection`, `DataVal`, `DataChartUI`, `DataTimeline`, `DataYAxis`, + `metric/*` subcomponents.
- `vue/` barrel currently exports **only dev-controls**; everything else relies on Nuxt auto-import.
- **No existing Figma/Code Connect artifacts** — clean slate.

### Token groups (from `tailwind.config.js`) → Figma variable collections

| Group | Values |
|---|---|
| grape (12) | DEFAULT #895AE8, 50 #F9F7FF, 100 #EFEBFC, 150 #E5DAFF, 200 #D7CAFE, 300 #BBA5FF, 400 #AB86F6, 500 #895AE8, 600 #7742E2, 700 #5E29CC, 800 #45199E, 850 #32146E, 900 #270B5E |
| leaf (4) | DEFAULT/300 #58E392, 400 #49CF81, 500 #34BC6D, 600 #1B974F |
| grey (13) | DEFAULT/400 #949494, 50 #FAFAFA, 100 #F5F5F5, 150 #F0F0F0, 200 #E8E8E8, 300 #D4D4D4, 350 #AAAAAA, 500 #7A7B7C, 600 #565454, 700 #393939, 800 #2B2A2A, 900 #111111 |
| semantic | error #EF4444, warning #F59E0B, success #58E392, info #D7CAFE, warn #F87F7D |
| accent | mint #21EBD0, orchid #AE73C2, blue #2FAEFD, soot #494b4d, red #FF0033 |
| fontSize | 68/40/28/18/16/14/12 … (px + line-height pairs) |
| fontWeight | reg 400, med 500, semi 600, bold 700, exbold 800, black 900 |
| fontFamily | sans Inter, mono Geist Mono, dev rigid-square |
| spacing | px8 / px16 / px24 / px32 / px40 / px48 / px64 |
| radius | 1px … 32px |

## Architecture (recommended, confirmed with user)

- **Source of truth:** bidirectional, drift-tolerant.
- **Canonical file:** File A; port File B's variant sets into it (re-bound to A's tokens).
- **Structure:** `Foundations` + category pages (`UX`, `Data`, `Health`, `Security`, `Icons`); one **component set** per component with variant props mirroring `defineProps` enums.
- **Bridge:** repo-owned `figma/component-map.json` (node ↔ code, prop ↔ variant). Agent + MCP as the sync engine. No Code Connect.
- **Token sync:** `tailwind.config.js` → `tokens/tokens.json` (DTCG); Figma side via Tokens Studio on the same Git JSON. MCP reads Figma variables for drift detection; cannot write them.

## MCP operational notes

- `get_metadata` with **no nodeId** only lists the page currently open in the desktop app — **not** the full page list. To dump all pages, probe an invalid node id (e.g. `99:1`); the error response lists every top-level page.
- `get_variable_defs`, `get_design_context`, `use_figma` need a **live desktop selection**. Node-scoped `get_metadata` / `get_variable_defs` (with explicit nodeId) work headless.
- `search_design_system` requires a `fileKey` and searches across all subscribed libraries, not just the target file.
